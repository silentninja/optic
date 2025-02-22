use crate::events::{ShapeEvent, SpecEvent};
use crate::queries::shape::{ChoiceOutput, ShapeQueries};
use crate::shapes::traverser::ShapeTrailPathComponent::ObjectFieldTrail;
use crate::shapes::ShapeTrail;
use crate::state::shape::{
  FieldId, FieldShapeDescriptor, ParameterShapeDescriptor, ProviderDescriptor, ShapeId, ShapeIdRef,
  ShapeKind, ShapeKindDescriptor, ShapeParameterId, ShapeParameterIdRef, ShapeParametersDescriptor,
};
use crate::{RfcEvent, SpecProjection};
use cqrs_core::{Aggregate, AggregateEvent, Event};
use petgraph::graph::{Graph, NodeIndex};
use petgraph::visit::EdgeRef;
use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, HashMap};
use std::iter::FromIterator;

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type", content = "data")]
pub enum Node {
  CoreShape(CoreShapeNode),
  Shape(ShapeNode),
  Field(FieldNode),
  ShapeParameter(ShapeParameterNode),
  BatchCommit(BatchCommitNode),
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ShapeNode {
  pub shape_id: ShapeId,
}
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CoreShapeNode {
  pub shape_id: ShapeId,
  pub descriptor: CoreShapeNodeDescriptor,
}
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FieldNode {
  pub field_id: FieldId,
  pub descriptor: FieldNodeDescriptor,
}
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ShapeParameterNode {
  pub parameter_id: ShapeParameterId,
  pub descriptor: ShapeParameterNodeDescriptor,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BatchCommitNode {
  batch_id: String,
  created_at: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type", content = "data")]
pub enum Edge {
  BelongsTo,
  IsDescendantOf,
  IsFieldOf,
  IsParameterOf,
  HasBinding(ShapeParameterBinding),
  CreatedIn,
  UpdatedIn,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ShapeParameterBinding {
  pub shape_id: ShapeId,
}

pub type NodeId = String;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CoreShapeNodeDescriptor {
  pub kind: ShapeKind,
}
#[derive(Debug, Clone, Serialize)]
pub struct ShapeParameterNodeDescriptor {}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FieldNodeDescriptor {
  pub name: String,
}

#[derive(Debug, Clone)]
pub struct ShapeProjection {
  pub graph: Graph<Node, Edge>,
  pub node_id_to_index: HashMap<NodeId, petgraph::graph::NodeIndex>,
}

impl Default for ShapeProjection {
  fn default() -> Self {
    let graph: Graph<Node, Edge> = Graph::new();
    let node_id_to_index = HashMap::new();
    let mut projection = ShapeProjection {
      graph,
      node_id_to_index,
    };

    add_core_shape_to_projection(&mut projection, ShapeKind::StringKind);
    add_core_shape_to_projection(&mut projection, ShapeKind::NumberKind);
    add_core_shape_to_projection(&mut projection, ShapeKind::BooleanKind);
    add_core_shape_to_projection(&mut projection, ShapeKind::ListKind);
    //@TODO: incomplete
    add_core_shape_to_projection(&mut projection, ShapeKind::ObjectKind);
    add_core_shape_to_projection(&mut projection, ShapeKind::NullableKind);
    add_core_shape_to_projection(&mut projection, ShapeKind::UnknownKind);
    add_core_shape_to_projection(&mut projection, ShapeKind::OptionalKind);
    add_core_shape_to_projection(&mut projection, ShapeKind::OneOfKind);
    projection
  }
}

fn add_core_shape_to_projection(shape_projection: &mut ShapeProjection, shape_kind: ShapeKind) {
  let descriptor = shape_kind.get_descriptor();
  let shape_node = Node::CoreShape(CoreShapeNode {
    shape_id: ShapeId::from(descriptor.base_shape_id),
    descriptor: CoreShapeNodeDescriptor {
      kind: shape_kind.clone(),
    },
  });
  let shape_node_index = shape_projection.graph.add_node(shape_node);
  shape_projection
    .node_id_to_index
    .insert(String::from(descriptor.base_shape_id), shape_node_index);
  if let Some(shape_parameter_descriptor) = shape_kind.get_parameter_descriptor() {
    let shape_parameter_node = Node::ShapeParameter(ShapeParameterNode {
      parameter_id: String::from(shape_parameter_descriptor.shape_parameter_id),
      descriptor: ShapeParameterNodeDescriptor {},
    });
    let shape_parameter_node_index = shape_projection.graph.add_node(shape_parameter_node);
    shape_projection.node_id_to_index.insert(
      String::from(shape_parameter_descriptor.shape_parameter_id),
      shape_parameter_node_index,
    );
    shape_projection.graph.add_edge(
      shape_parameter_node_index,
      shape_node_index,
      Edge::IsParameterOf,
    );
  }
}

impl ShapeProjection {
  ////////////////////////////////////////////////////////////////////////////////
  pub fn with_batch_commit(&mut self, batch_id: String, created_at: String) {
    let node = Node::BatchCommit(BatchCommitNode {
      batch_id: batch_id.clone(),
      created_at: created_at.clone(),
    });
    let node_index = self.graph.add_node(node);
    self.node_id_to_index.insert(batch_id, node_index);
  }
  pub fn with_creation_history(&mut self, batch_id: &str, created_node_id: &str) {
    let created_node_index = self
      .node_id_to_index
      .get(created_node_id)
      .expect("expected created_node_id to exist");

    let batch_node_index_option = self.node_id_to_index.get(batch_id);

    if let Some(batch_node_index) = batch_node_index_option {
      self
        .graph
        .add_edge(*created_node_index, *batch_node_index, Edge::CreatedIn);
    } else {
      eprintln!("bad implicit batch id {}", &batch_id);
    }
  }
  pub fn with_update_history(&mut self, batch_id: &str, updated_node_id: &str) {
    let updated_node_index = self
      .node_id_to_index
      .get(updated_node_id)
      .expect("expected updated_node_id to exist");

    let batch_node_index_option = self.node_id_to_index.get(batch_id);

    if let Some(batch_node_index) = batch_node_index_option {
      self
        .graph
        .add_edge(*updated_node_index, *batch_node_index, Edge::UpdatedIn);
    } else {
      eprintln!("bad implicit batch id {}", &batch_id);
    }
  }
  ////////////////////////////////////////////////////////////////////////////////
  pub fn with_shape_parameter(&mut self, shape_parameter_id: ShapeParameterId, shape_id: ShapeId) {
    let shape_node_index = *self.get_shape_node_index(&shape_id).unwrap();
    let shape_parameter_node = Node::ShapeParameter(ShapeParameterNode {
      parameter_id: shape_parameter_id.clone(),
      descriptor: ShapeParameterNodeDescriptor {},
    });
    let shape_parameter_node_index = self.graph.add_node(shape_parameter_node);
    self
      .node_id_to_index
      .insert(String::from(shape_parameter_id), shape_parameter_node_index);

    self.graph.add_edge(
      shape_parameter_node_index,
      shape_node_index,
      Edge::IsParameterOf,
    );
  }
  pub fn with_shape(
    &mut self,
    shape_id: ShapeId,
    base_shape_id: ShapeId,
    parameters: ShapeParametersDescriptor,
    name: String,
  ) {
    let shape_node = Node::Shape(ShapeNode {
      shape_id: shape_id.clone(),
    });
    let shape_node_index = self.graph.add_node(shape_node);
    self.node_id_to_index.insert(shape_id, shape_node_index);

    let base_shape_node_index = self
      .node_id_to_index
      .get(&base_shape_id)
      .unwrap_or_else(|| {
        panic!(
          "expected base_shape_id '{}' to have a corresponding node",
          &base_shape_id
        )
      });
    // .expect("expected base_shape_id to have a corresponding node");
    self.graph.add_edge(
      shape_node_index,
      *base_shape_node_index,
      Edge::IsDescendantOf,
    );
  }

  pub fn with_base_shape(&mut self, shape_id: ShapeId, base_shape_id: ShapeId) {
    let shape_node_index = *self.node_id_to_index.get(&shape_id).unwrap_or_else(|| {
      panic!(
        "expected shape_id '{}' to have a corresponding node",
        &shape_id
      )
    });

    let mut existing_edges = self
      .graph
      .edges_directed(shape_node_index, petgraph::Direction::Outgoing);

    let existing_edge_index = existing_edges
      .find(|edge| match edge.weight() {
        Edge::IsDescendantOf => true,
        _ => false,
      })
      .expect("there should be an isDescendantOf edge")
      .id();

    self.graph.remove_edge(existing_edge_index);

    let base_shape_node_index = *self
      .node_id_to_index
      .get(&base_shape_id)
      .unwrap_or_else(|| {
        panic!(
          "expected base_shape_id '{}' to have a corresponding node",
          &base_shape_id
        )
      });

    self.graph.add_edge(
      shape_node_index,
      base_shape_node_index,
      Edge::IsDescendantOf,
    );
  }

  pub fn get_ancestor_shape_node_index(&self, parent_node_index: &NodeIndex) -> Option<NodeIndex> {
    let mut edges = self
      .graph
      .edges_directed(*parent_node_index, petgraph::Direction::Outgoing);
    if let Some(ancestor_edge) = edges.find(|edge| match edge.weight() {
      Edge::IsDescendantOf => true,
      _ => false,
    }) {
      Some(ancestor_edge.target())
    } else {
      Some(*parent_node_index)
    }
  }

  pub fn with_shape_parameter_shape(
    &mut self,
    shape_parameter_descriptor: ParameterShapeDescriptor,
  ) {
    match shape_parameter_descriptor {
      ParameterShapeDescriptor::ProviderInShape(p) => {
        let target_shape_id = match p.provider_descriptor {
          ProviderDescriptor::ShapeProvider(provider) => provider.shape_id,
          _ => panic!("expected specs to only use ProviderDescriptor::ShapeProvider"),
        };
        let shape_node_index = self
          .node_id_to_index
          .get(&p.shape_id)
          .expect("expected shape_id to have a corresponding node");
        let shape_parameter_node_index = self
          .node_id_to_index
          .get(&p.consuming_parameter_id)
          .expect("expected consuming_parameter_id to have a corresponding node");
        let mut outgoing_edges = self
          .graph
          .edges_connecting(*shape_node_index, *shape_parameter_node_index);
        if let Some(existing_binding) = outgoing_edges.next() {
          let edge_index = existing_binding.id();
          let edge_weight = self.graph.edge_weight_mut(edge_index).unwrap();
          // mutate the edge to point to the new shape_id
          match edge_weight {
            Edge::HasBinding(b) => {
              b.shape_id = target_shape_id;
            }
            _ => panic!("expected edge to be a HasBinding"),
          }
        } else {
          // add a binding edge
          let binding_edge = self.graph.add_edge(
            *shape_node_index,
            *shape_parameter_node_index,
            Edge::HasBinding(ShapeParameterBinding {
              shape_id: target_shape_id,
            }),
          );
        }
      }
      _ => panic!("expected specs to only use ParameterShapeDescriptor::ProviderInShape"),
    }
  }

  pub fn with_field_shape(&mut self, shape_descriptor: FieldShapeDescriptor) {
    let field_shape = match shape_descriptor {
      FieldShapeDescriptor::FieldShapeFromShape(field_shape) => field_shape,
      _ => panic!("expected specs to only use FieldShapeDescriptor::FieldShapeFromShape"),
    };
    let field_node_index = *self
      .get_field_node_index(&field_shape.field_id)
      .expect("expected field to exist");
    let field_node_weight = self
      .graph
      .node_weight(field_node_index)
      .expect("expected field to exist");
    let existing_field_shape_edge_index = self
      .graph
      .edges_directed(field_node_index, petgraph::Direction::Incoming)
      .find(|edge| match edge.weight() {
        Edge::BelongsTo => true,
        _ => false,
      })
      .expect("expected field to have a target shape via a BelongsTo edge")
      .id();

    self.graph.remove_edge(existing_field_shape_edge_index);

    let target_shape_node_index = *self
      .get_shape_node_index(&field_shape.shape_id)
      .expect("expected shape_id for field value to have a corresponding node");

    self
      .graph
      .add_edge(target_shape_node_index, field_node_index, Edge::BelongsTo);
  }

  pub fn with_field(
    &mut self,
    field_id: FieldId,
    object_id: ShapeId,
    shape_descriptor: FieldShapeDescriptor,
    name: String,
  ) {
    let object_node_index = *self
      .get_shape_node_index(&object_id)
      .expect("expected shape_id of field to have a corresponding node");

    let field_value_shape_node_index = match shape_descriptor {
      FieldShapeDescriptor::FieldShapeFromShape(field_shape) => {
        assert_eq!(
          field_shape.field_id, field_id,
          "expect main field id of event to match one of field shape descriptor"
        );

        *self
          .get_shape_node_index(&field_shape.shape_id)
          .expect("expected shape_id for field value to have a corresponding node")
      }
      _ => panic!("expected specs to only use FieldShapeDescriptor::FieldShapeFromShape"),
    };

    let field_node = Node::Field(FieldNode {
      field_id: field_id.clone(),
      descriptor: FieldNodeDescriptor { name },
    });
    let field_node_index = self.graph.add_node(field_node);
    self
      .node_id_to_index
      .insert(field_id.clone(), field_node_index);

    self.graph.add_edge(
      field_value_shape_node_index,
      field_node_index,
      Edge::BelongsTo,
    );

    self
      .graph
      .add_edge(field_node_index, object_node_index, Edge::IsFieldOf);
  }

  pub fn without_field(&mut self, field_id: FieldId) {
    let field_node_index = self
      .get_field_node_index(&field_id)
      .expect("expected field_id to have corresponding node");

    let object_edge_index = self
      .graph
      .edges_directed(*field_node_index, petgraph::Direction::Outgoing)
      .find(|parent_edge| matches!(parent_edge.weight(), Edge::IsFieldOf))
      .map(|object_edge| object_edge.id());

    if let Some(object_edge_index) = object_edge_index {
      self.graph.remove_edge(object_edge_index); // prevents field to be resolved from the object shape node
    }

    self.node_id_to_index.remove(&field_id); // prevents field node to be looked up by field id

    // GOTCHA: we're not deleting the field node itself, as that would invalidate self.node_id_to_index
    // as the graph indexes shift.
    // TODO: figure out the implications of the above, like correctness of queries and
    // eventual garbage collection.
  }

  pub fn get_shape_node_index(&self, node_id: &NodeId) -> Option<&NodeIndex> {
    let node_index = self.node_id_to_index.get(node_id)?;
    let node = self.graph.node_weight(*node_index);
    match node {
      Some(&Node::Shape(ref node)) => Some(node_index),
      Some(&Node::CoreShape(ref node)) => Some(node_index),
      Some(_) => None,
      None => None,
    }
  }

  pub fn get_node_by_index(&self, node_index: &NodeIndex) -> Option<&Node> {
    self.graph.node_weight(*node_index)
  }

  pub fn get_node_by_id(&self, node_id: &NodeId) -> Option<(NodeIndex, &Node)> {
    let node_index = self.node_id_to_index.get(node_id)?;
    let node = self.graph.node_weight(*node_index);
    node.map(move |node| (*node_index, node))
  }

  pub fn get_core_shape_node_index(&self, node_id: &NodeId) -> Option<&NodeIndex> {
    let node_index = self.node_id_to_index.get(node_id)?;
    let node = self.graph.node_weight(*node_index);
    match node {
      Some(&Node::CoreShape(ref node)) => Some(node_index),
      Some(_) => None,
      None => None,
    }
  }

  pub fn get_field_node_index(&self, node_id: &NodeId) -> Option<&NodeIndex> {
    self
      .get_field_node(node_id)
      .map(|(node_index, _)| node_index)
  }

  pub fn get_field_node(&self, field_id: &FieldId) -> Option<(&NodeIndex, &FieldNode)> {
    let node_index = self.node_id_to_index.get(field_id)?;
    let node = self.graph.node_weight(*node_index)?;
    match node {
      Node::Field(ref node) => Some((node_index, node)),
      _ => None,
    }
  }

  pub fn get_shape_parameter_node_index(&self, node_id: &NodeId) -> Option<&NodeIndex> {
    let node_index = self.node_id_to_index.get(node_id)?;
    let node = self.graph.node_weight(*node_index);
    match node {
      Some(&Node::ShapeParameter(ref node)) => Some(node_index),
      Some(_) => None,
      None => None,
    }
  }

  pub fn get_descendant_shape_node_index(
    &self,
    parent_node_index: &NodeIndex,
    child_id: &NodeId,
  ) -> Option<NodeIndex> {
    let mut edges = self
      .graph
      .edges_directed(*parent_node_index, petgraph::Direction::Incoming);
    let child_edge = edges.find(|edge| match edge.weight() {
      Edge::IsDescendantOf => match self.graph.node_weight(edge.source()) {
        Some(Node::Shape(neighbor)) => *child_id == neighbor.shape_id,
        Some(Node::CoreShape(neighbor)) => *child_id == neighbor.shape_id,
        _ => false,
      },
      _ => false,
    })?;

    Some(child_edge.source())
  }

  pub fn get_owner_node_index(&self, node_index: &NodeIndex) -> Option<NodeIndex> {
    let mut edges = self
      .graph
      .edges_directed(*node_index, petgraph::Direction::Outgoing);
    if let Some(owner_edge) = edges.find(|edge| match edge.weight() {
      Edge::BelongsTo => true,
      Edge::IsFieldOf => true,
      _ => false,
    }) {
      Some(owner_edge.target())
    } else {
      None
    }
  }

  pub fn get_owner_node(&self, node_index: &NodeIndex) -> Option<(NodeIndex, &Node)> {
    let owner_node_index = self.get_owner_node_index(node_index)?;
    self
      .graph
      .node_weight(owner_node_index)
      .map(move |node| (owner_node_index, node))
  }

  //?
  pub fn get_core_shape_nodes(
    &self,
    node_index: &NodeIndex,
  ) -> Option<impl Iterator<Item = &CoreShapeNode>> {
    let graph = &self.graph;
    let node = graph.node_weight(*node_index);
    if let Some(Node::Shape(shape_node)) = node {
      let neighbours = self
        .graph
        .neighbors_directed(*node_index, petgraph::Direction::Outgoing);
      let core_shapes = neighbours.filter_map(move |neighbour_index| {
        if let Some(Node::CoreShape(node)) = graph.node_weight(neighbour_index.clone()) {
          Some(node)
        } else {
          None
        }
      });
      Some(core_shapes)
    } else {
      None
    }
  }

  pub fn get_shape_field_nodes(
    &self,
    node_index: &NodeIndex,
  ) -> Option<impl Iterator<Item = &FieldNode>> {
    let graph = &self.graph;
    let node = graph.node_weight(*node_index);
    if let Some(Node::Shape(shape_node)) = node {
      let neighbours = self
        .graph
        .neighbors_directed(*node_index, petgraph::Direction::Incoming);
      let field_nodes = neighbours.filter_map(move |neighbour_index| {
        if let Some(Node::Field(node)) = graph.node_weight(neighbour_index.clone()) {
          Some(node)
        } else {
          None
        }
      });
      Some(field_nodes)
    } else {
      None
    }
  }

  pub fn get_core_shape_kinds(
    &self,
    node_index: &NodeIndex,
  ) -> Option<impl Iterator<Item = &ShapeKind>> {
    let core_shape_nodes = self.get_core_shape_nodes(node_index)?;

    Some(core_shape_nodes.map(|core_shape_node| &core_shape_node.descriptor.kind))
  }
}

impl Aggregate for ShapeProjection {
  fn aggregate_type() -> &'static str {
    "shape_projection"
  }
}
impl AggregateEvent<ShapeProjection> for RfcEvent {
  fn apply_to(self, projection: &mut ShapeProjection) {
    match self {
      RfcEvent::BatchCommitStarted(e) => projection.with_batch_commit(
        e.batch_id,
        e.event_context
          .expect("why is event_context optional again?")
          .created_at,
      ),
      _ => eprintln!(
        "Ignoring applying event of type '{}' for '{}'",
        self.event_type(),
        ShapeProjection::aggregate_type()
      ),
    }
  }
}

impl AggregateEvent<ShapeProjection> for ShapeEvent {
  fn apply_to(self, projection: &mut ShapeProjection) {
    match self {
      ShapeEvent::ShapeAdded(e) => {
        projection.with_shape(e.shape_id.clone(), e.base_shape_id, e.parameters, e.name);
        if let Some(c) = e.event_context {
          projection.with_creation_history(&c.client_command_batch_id, &e.shape_id);
        }
      }
      ShapeEvent::ShapeParameterAdded(e) => {
        projection.with_shape_parameter(e.shape_parameter_id.clone(), e.shape_id);
        if let Some(c) = e.event_context {
          projection.with_creation_history(&c.client_command_batch_id, &e.shape_parameter_id);
        }
      }
      ShapeEvent::ShapeParameterShapeSet(e) => {
        projection.with_shape_parameter_shape(e.shape_descriptor.clone());
        if let Some(c) = e.event_context {
          if let ParameterShapeDescriptor::ProviderInShape(d) = &e.shape_descriptor {
            projection.with_update_history(&c.client_command_batch_id, &d.shape_id);
          }
        }
      }
      ShapeEvent::FieldAdded(e) => {
        projection.with_field(e.field_id.clone(), e.shape_id, e.shape_descriptor, e.name);

        if let Some(c) = e.event_context {
          projection.with_creation_history(&c.client_command_batch_id, &e.field_id);
        }
      }
      ShapeEvent::FieldShapeSet(e) => {
        projection.with_field_shape(e.shape_descriptor.clone());

        if let Some(c) = e.event_context {
          if let FieldShapeDescriptor::FieldShapeFromShape(d) = &e.shape_descriptor {
            projection.with_update_history(&c.client_command_batch_id, &d.field_id);
          }
        }
      }
      ShapeEvent::FieldRemoved(e) => {
        projection.without_field(e.field_id);
        // TODO: track removal history
      }

      ShapeEvent::BaseShapeSet(e) => {
        projection.with_base_shape(e.shape_id.clone(), e.base_shape_id);

        if let Some(c) = e.event_context {
          projection.with_update_history(&c.client_command_batch_id, &e.shape_id);
        }
      }
      x => {
        //dbg!("skipping ShapeEvent in ShapeProjection. warning?");
        //dbg!(&x);
      }
    }
  }
}

impl AggregateEvent<ShapeProjection> for SpecEvent {
  fn apply_to(self, projection: &mut ShapeProjection) {
    if let SpecEvent::ShapeEvent(event) = self {
      event.apply_to(projection);
    }
  }
}

impl<I> From<I> for ShapeProjection
where
  I: IntoIterator,
  I::Item: AggregateEvent<Self>,
{
  fn from(events: I) -> Self {
    let mut projection = ShapeProjection::default();
    for event in events.into_iter() {
      projection.apply(event);
    }
    projection
  }
}

#[cfg(test)]
mod test {
  use super::*;
  use serde_json;

  #[test]
  fn can_project_shape_added_for_core_shape_ids() {
    let event : ShapeEvent = serde_json::from_str(r#"
            {"ShapeAdded":{"shapeId":"EQSZqM_13","baseShapeId":"$string","parameters":{"DynamicParameterList":{"shapeParameterIds":[]}},"name":"","eventContext":{"clientId":"anonymous","clientSessionId":"051c1e18-9cce-4f70-97c2-831dec850d0c","clientCommandBatchId":"ee02a716-7a3a-43d2-b1b2-b0a8259f071f","createdAt":"2020-04-08T09:23:41.638Z"}}}
        "#).expect("should deserialize json spec event");

    let mut projection = ShapeProjection::default();
    projection.apply(event);
  }
}
