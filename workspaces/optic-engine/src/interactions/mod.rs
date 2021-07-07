use crate::events::http_interaction::{Body, HttpInteraction};
use crate::learn_shape::{observe_body_trails, TrailObservationsResult, TrailValues};
use crate::projections::{EndpointProjection, SpecProjection};
use crate::protos::shapehash::ShapeDescriptor;
use crate::queries::endpoint::EndpointQueries;
use crate::shapes::diff as diff_shape;
use crate::shapes::ShapeDiffResult;
use crate::state::body::BodyDescriptor;

pub mod result;
mod traverser;
mod visitors;

use result::InteractionTrail;
pub use result::{BodyAnalysisLocation, BodyAnalysisResult, InteractionDiffResult};
use visitors::{InteractionVisitors, PathVisitor};

/// Compute diffs based on a spec and an interaction.
///
/// Will first try to match the interaction to a Request + Response pair from the spec. From there
/// will either produce unmatched results or proceed to diff bodies of the Request and Response
/// respectively.
pub fn diff(
  spec_projection: &SpecProjection,
  http_interaction: HttpInteraction,
  config: &DiffConfig,
) -> Vec<InteractionDiffResult> {
  let endpoint_projection = spec_projection.endpoint();
  let endpoint_queries = EndpointQueries::new(endpoint_projection);
  let interaction_traverser = traverser::Traverser::new(&endpoint_queries);
  let mut diff_visitors = visitors::diff::DiffVisitors::new();

  interaction_traverser.traverse(&http_interaction, &mut diff_visitors);

  let results = diff_visitors.take_results().unwrap();

  results
    .into_iter()
    .filter(|result| {
      config.include_query_params
        || !matches!(result, InteractionDiffResult::UnmatchedQueryParameters(_))
    })
    .flat_map(move |result| match result {
      InteractionDiffResult::MatchedQueryParameters(result) => {
        let query_params = &http_interaction.request.query;
        let shape_diff_results = diff_shape(
          spec_projection.shape(),
          query_params.into(),
          &result.root_shape_id,
        );
        shape_diff_results
          .into_iter()
          .map(|shape_diff| {
            InteractionDiffResult::UnmatchedQueryParametersShape(
              result.clone().into_shape_diff(shape_diff),
            )
          })
          .collect()
      }
      InteractionDiffResult::MatchedRequestBodyContentType(result) => {
        // eprintln!("shape diffing for matched a request body content type");
        let body = &http_interaction.request.body.value;
        let shape_diff_results =
          diff_shape(spec_projection.shape(), body.into(), &result.root_shape_id);
        shape_diff_results
          .into_iter()
          .map(|shape_diff| {
            InteractionDiffResult::UnmatchedRequestBodyShape(
              result.clone().into_shape_diff(shape_diff),
            )
          })
          .collect()
      }
      InteractionDiffResult::MatchedResponseBodyContentType(result) => {
        // eprintln!(
        //   "interaction-diff: shape diffing for matched a response body content type: {:?}",
        //   &http_interaction.response.body
        // );
        let body = &http_interaction.response.body.value;
        let shape_diff_results =
          diff_shape(spec_projection.shape(), body.into(), &result.root_shape_id);
        shape_diff_results
          .into_iter()
          .map(|shape_diff| {
            InteractionDiffResult::UnmatchedResponseBodyShape(
              result.clone().into_shape_diff(shape_diff),
            )
          })
          .collect()
      }
      _ => vec![result],
    })
    .collect()
}

#[derive(Clone, Debug)]
pub struct DiffConfig {
  include_query_params: bool,
}

impl Default for DiffConfig {
  fn default() -> Self {
    Self {
      include_query_params: false,
    }
  }
}

impl DiffConfig {
  pub fn with_query_params(self, flag: bool) -> Self {
    let mut new = self.clone();
    new.include_query_params = flag;
    new
  }
}

/// Analysises the shapes of interactions that have request or response bodies with previously
/// unseen content types. From the result, observed types per json trail, commands can be generated
/// applyable to the spec that would make the interaction compliant. Results can also be merged with
/// each other, creating a union. In effect, this allows a spec to be learned from interactions.
///
/// A diff is performed to find a matching Request / Response, but with missing content types
/// respectively. When found, a normalized description of the shape of the interaction is traversed.
pub fn analyze_undocumented_bodies<'a>(
  spec_projection: &SpecProjection,
  interaction: HttpInteraction,
  config: &AnalyzeUndocumentedBodiesConfig,
) -> impl Iterator<Item = BodyAnalysisResult> {
  let endpoint_projection = spec_projection.endpoint();
  let endpoint_queries = EndpointQueries::new(endpoint_projection);
  let interaction_traverser = traverser::Traverser::new(&endpoint_queries);
  let mut diff_visitors = visitors::diff::DiffVisitors::new();

  interaction_traverser.traverse(&interaction, &mut diff_visitors);

  let results = diff_visitors.take_results().unwrap();
  let include_query_params = config.include_query_params;

  results.into_iter().flat_map(move |result| match result {
    InteractionDiffResult::UnmatchedQueryParameters(diff) => {
      if include_query_params {
        let query_params = &interaction.request.query;
        let query_trail_observations = observe_body_trails(query_params);

        vec![BodyAnalysisResult {
          body_location: BodyAnalysisLocation::from(diff),
          trail_observations: query_trail_observations,
        }]
      } else {
        vec![]
      }
    }
    InteractionDiffResult::UnmatchedRequestBodyContentType(diff) => {
      let body = &interaction.request.body;
      let body_trail_observations = observe_body_trails(&body.value);

      vec![BodyAnalysisResult {
        body_location: BodyAnalysisLocation::from(diff.clone()),
        trail_observations: body_trail_observations,
      }]
    }
    InteractionDiffResult::UnmatchedResponseBodyContentType(diff) => {
      let body = &interaction.response.body;
      let trail_observations = observe_body_trails(&body.value);

      vec![BodyAnalysisResult {
        body_location: BodyAnalysisLocation::from(diff),
        trail_observations,
      }]
    }
    _ => vec![],
  })
}

#[derive(Clone, Debug)]
pub struct AnalyzeUndocumentedBodiesConfig {
  include_query_params: bool,
}

impl Default for AnalyzeUndocumentedBodiesConfig {
  fn default() -> Self {
    Self {
      include_query_params: false,
    }
  }
}

impl AnalyzeUndocumentedBodiesConfig {
  pub fn with_query_params(self, flag: bool) -> Self {
    let mut new = self.clone();
    new.include_query_params = flag;
    new
  }
}

pub fn analyze_documented_bodies(
  spec_projection: &SpecProjection,
  interaction: HttpInteraction,
) -> impl Iterator<Item = BodyAnalysisResult> {
  let endpoint_rpojection = spec_projection.endpoint();
  let endpoint_queries = EndpointQueries::new(endpoint_rpojection);

  let interaction_traverser = traverser::Traverser::new(&endpoint_queries);
  let mut diff_visitors = visitors::diff::DiffVisitors::new();

  interaction_traverser.traverse(&interaction, &mut diff_visitors);

  let results = diff_visitors.take_results().unwrap();

  results.into_iter().filter_map(move |result| match result {
    InteractionDiffResult::MatchedRequestBodyContentType(diff) => {
      let body = &interaction.request.body;
      let trail_observations = observe_body_trails(&body.value);

      Some(BodyAnalysisResult {
        body_location: BodyAnalysisLocation::from(diff),
        trail_observations,
      })
    }
    InteractionDiffResult::MatchedResponseBodyContentType(diff) => {
      let body = &interaction.response.body;
      let trail_observations = observe_body_trails(&body.value);

      Some(BodyAnalysisResult {
        body_location: BodyAnalysisLocation::from(diff),
        trail_observations,
      })
    }
    _ => None,
  })
}
