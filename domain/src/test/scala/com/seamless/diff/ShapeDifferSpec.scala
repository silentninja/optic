package com.seamless.diff

import com.seamless.contexts.shapes.Commands.{DynamicParameterList, NoParameterList, ProviderInShape, ShapeProvider}
import com.seamless.contexts.shapes.{ShapeEntity, ShapeValue, ShapesAggregate, ShapesState}
import com.seamless.diff.ShapeDiffer.MultipleInterpretations
import io.circe.Json
import io.circe.literal._
import org.scalatest.FunSpec

class ShapeDifferSpec extends FunSpec {
  describe("diffing") {
    describe("when expecting a Map[String, String]") {
      val shape = ShapeValue(isUserDefined = true, "$map", NoParameterList(), Seq.empty, "x")
      val expected = ShapeEntity("$x", shape, isRemoved = false)
      implicit val shapesState: ShapesState = ShapesAggregate.initialState
        .withShape(expected.shapeId, shape.baseShapeId, shape.parameters, shape.name)
        .withShapeParameterShape(ProviderInShape(expected.shapeId, ShapeProvider("$string"), "$mapValue"))
      describe("when given a number value") {
        it("should return a diff indicating the key that is mismatched") {
          val actual: Json = json"""{"a":"b","c":1,"e":"f"}"""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.MapValueMismatch("c", shapesState.shapes("$string"), json"""1"""))
        }
      }
      describe("when given no values") {
        it("should return an empty diff") {
          val actual: Json = json"""{}"""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.NoDiff())
        }
      }
      describe("when given only string values") {
        it("should return an empty diff") {
          val actual: Json = json"""{"a":"b","c":"d"}"""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.NoDiff())
        }
      }
      describe("when given a non-object") {
        it("should return a diff indicating a mismatch") {
          val actual: Json = json"""[["a","b"],["c","d"]]"""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.ShapeMismatch(expected, actual))
        }
      }
    }
    describe("when expecting a Nullable[String]") {
      val shape = ShapeValue(isUserDefined = true, "$nullable", NoParameterList(), Seq.empty, "x")
      val expected = ShapeEntity("$x", shape, isRemoved = false)
      implicit val shapesState: ShapesState = ShapesAggregate.initialState
        .withShape(expected.shapeId, shape.baseShapeId, shape.parameters, shape.name)
        .withShapeParameterShape(ProviderInShape(expected.shapeId, ShapeProvider("$string"), "$nullableInner"))

      describe("when given a string") {
        it("should return an empty diff") {
          val actual: Json = json""""abc""""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.NoDiff())
        }
      }
      describe("when given null") {
        it("should return an empty diff") {
          val actual: Json = json"""null"""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.NoDiff())
        }
      }
      describe("when given undefined") {
        it("should return a diff indicating a mismatch") {
          val diff = ShapeDiffer.diff(expected, None)
          assert(diff == ShapeDiffer.UnsetValue(expected))
        }
      }
      describe("when given a number") {
        it("should return a diff indicating a mismatch") {
          val actual: Json = json"""123"""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.ShapeMismatch(shapesState.shapes("$string"), actual))
        }
      }
    }
    describe("when expecting an Optional[String]") {
      val shape = ShapeValue(isUserDefined = true, "$optional", NoParameterList(), Seq.empty, "x")
      val expected = ShapeEntity("$x", shape, isRemoved = false)
      implicit val shapesState: ShapesState = ShapesAggregate.initialState
        .withShape(expected.shapeId, shape.baseShapeId, shape.parameters, shape.name)
        .withShapeParameterShape(ProviderInShape(expected.shapeId, ShapeProvider("$string"), "$optionalInner"))

      describe("when given a string") {
        it("should return an empty diff") {
          val actual: Json = json""""abc""""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.NoDiff())
        }
      }
      describe("when given null") {
        it("should return a diff indicating a mismatch") {
          val actual: Json = json"""null"""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.ShapeMismatch(shapesState.shapes("$string"), actual))
        }
      }
      describe("when given undefined") {
        it("should return an empty diff") {
          val diff = ShapeDiffer.diff(expected, None)
          assert(diff == ShapeDiffer.NoDiff())
        }
      }
      describe("when given a number") {
        it("should return a diff indicating a mismatch") {
          val actual: Json = json"""123"""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.ShapeMismatch(shapesState.shapes("$string"), actual))
        }
      }
    }
    describe("when expecting a OneOf[String, Number]") {
      val shape = ShapeValue(isUserDefined = true, "$oneOf", DynamicParameterList(Seq("p1", "p2")), Seq.empty, "x")
      val expected = ShapeEntity("$x", shape, isRemoved = false)
      implicit val shapesState: ShapesState = ShapesAggregate.initialState
        .withShape(expected.shapeId, shape.baseShapeId, shape.parameters, shape.name)
        .withShapeParameter("p1", "$x", ProviderInShape(expected.shapeId, ShapeProvider("$string"), "p1"), "P1")
        .withShapeParameter("p2", "$x", ProviderInShape(expected.shapeId, ShapeProvider("$number"), "p2"), "P2")
        .withShapeParameterShape(ProviderInShape(expected.shapeId, ShapeProvider("$string"), "p1"))
        .withShapeParameterShape(ProviderInShape(expected.shapeId, ShapeProvider("$number"), "p2"))

      describe("when given a string") {
        it("should return an empty diff") {
          val actual: Json = json""""abc""""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.NoDiff())
        }
      }
      describe("when given null") {
        it("should return a diff indicating a mismatch") {
          val actual: Json = json"""null"""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.MultipleInterpretations(expected, actual))
        }
      }
      describe("when given undefined") {
        it("should return an empty diff") {
          val diff = ShapeDiffer.diff(expected, None)
          assert(diff == ShapeDiffer.UnsetValue(expected))
        }
      }
      describe("when given a number") {
        it("should return a diff indicating a mismatch") {
          val actual: Json = json"""123"""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.NoDiff())
        }
      }
      describe("when given a boolean") {
        it("should return a diff indicating a mismatch") {
          val actual: Json = json"""false"""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == MultipleInterpretations(expected, actual))
        }
      }
    }
    describe("when expecting an empty object") {
      describe("when given an empty object") {
        it("should return an empty diff") {
          val shape = ShapeValue(isUserDefined = true, "$object", DynamicParameterList(Seq.empty), Seq.empty, "x")
          val expected = ShapeEntity("$x", shape, isRemoved = false)
          implicit val shapesState: ShapesState = ShapesAggregate.initialState.withShape(expected.shapeId, shape.baseShapeId, shape.parameters, shape.name)

          val actual: Json = json"""{}"""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.NoDiff())
        }
      }
      describe("when given a non-empty object") {
        it("should return a diff indicating an extra key") {
          val shape = ShapeValue(isUserDefined = true, "$object", DynamicParameterList(Seq.empty), Seq.empty, "x")
          val expected = ShapeEntity("$x", shape, isRemoved = false)
          implicit val shapesState: ShapesState = ShapesAggregate.initialState.withShape(expected.shapeId, shape.baseShapeId, shape.parameters, shape.name)

          val actual: Json = json"""{"abc":123}"""
          val diff = ShapeDiffer.diff(expected, Some(actual))
          assert(diff == ShapeDiffer.UnexpectedObjectKey("$x", "abc", expected, json"""123"""))
        }
      }
    }
  }
}
