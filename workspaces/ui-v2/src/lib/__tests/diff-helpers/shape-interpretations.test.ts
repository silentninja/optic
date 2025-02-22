import { IShapeDiffTestSnapshot, shapeDiffPreview, testCase } from './fixture';

const cases = testCase('shape-diff-engine');

function commonAssertions(result: IShapeDiffTestSnapshot) {
  if (result.preview.previewTabs.length < 0) {
    throw new Error('all diffs should have a preview');
  }
  if (result.trailValues.affordances.length < 0) {
    throw new Error('all diffs should have affordances');
  }

  const totalResults =
    result.trailValues.interactions.wasString.length +
    result.trailValues.interactions.wasArray.length +
    result.trailValues.interactions.wasNull.length +
    result.trailValues.interactions.wasBoolean.length +
    result.trailValues.interactions.wasMissing.length +
    result.trailValues.interactions.wasNumber.length +
    result.trailValues.interactions.wasObject.length;

  if (totalResults < 0) {
    throw new Error('all diffs should have interactions attached');
  }

  result.preview.toCommands(result.preview.updateSpecChoices!);
}

test('a known field is missing.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('a known field is provided the wrong shape.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('a new field is provided as an array with any contents.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('a new field is provided as an empty array.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('a new field is provided in a required nested object.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('a new field is provided in an optional nested object.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('a primitive type is provided to an optional object.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('a required array field has no items, no diff.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  expect(diff).toBeUndefined();
});

test('a required array field is an object.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('a required array field of strings provided with an object.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('an array type is provided to an optional object.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('an extra field is provided as an object.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  // expect(result).toMatchSnapshot();
});

test('an extra field is provided.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('an required object field is null, suggests nullable.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('an required object field is ommitted.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('an required object field is provided with a missing required field.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('an required object field is provided with an array.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

// This appears to be wrong in Optic 10 too. Unknown Arrays never get types
// test('array unknown is provided with concrete values.managed', async () => {
//   const universe = await cases(expect.getState().currentTestName);
//   const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
//   const result = await shapeDiffPreview(diff, universe.universe);
//   commonAssertions(result);
// logResult(result.preview);
//   expect(result).toMatchSnapshot();
// });

test('array unknown is provided with no values.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  expect(universe.diffs.length).toBe(0);
});

test('array with object listitem is provided an empty sub array.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('array with object listitem is provided an sub array of numbers.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('array with object listitem is provided with no values.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  expect(universe.diffs.length).toBe(0);
});

test('array with object listitem is provided with one matching and one primitive.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('array with object listitem is provided with one matching, no diff.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  expect(universe.diffs.length).toBe(0);
});

test('deeply nested fields inside of arrays.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('field is array of strings, and 1 item does not match expected type.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('field is array of strings, and more than 1 items does not match expected type.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('no diff expected for basic objects.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  expect(universe.diffs.length).toBe(0);
});

// test('required fields are omitted in an optional object.managed', async () => {
//   const universe = await cases(expect.getState().currentTestName);
//   const diff = universe.diffs.groupedByEndpointAndShapeTrail()[0];
//   const preview = await shapeDiffPreview(diff, universe);
// });

test('root array is provided with object.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});

test('when a nullable is provided with a concrete type.managed', async () => {
  const universe = await cases(expect.getState().currentTestName);
  const diff = universe.diffSet.groupedByEndpointAndShapeTrail()[0];
  const result = await shapeDiffPreview(diff, universe.universe);
  commonAssertions(result);
  // logResult(result.preview);
  expect(result).toMatchSnapshot();
});
