import { describe, expect, it } from "vitest";
import { CheckTypeError, getBasicType, getCheckTypeErrorReason, getClassType } from "../src/utils.ts";

describe("getClassType", () => {
  it("should return 'null' for null values", () => {
    expect(getBasicType(null)).toBe("null");
  });

  it("should return 'undefined' for undefined values", () => {
    expect(getBasicType(undefined)).toBe("undefined");
  });

  it("should return 'string' for string values", () => {
    expect(getBasicType("test")).toBe("string");
  });

  it("should return 'number' for number values", () => {
    expect(getBasicType(123)).toBe("number");
  });

  it("should return 'boolean' for boolean values", () => {
    expect(getBasicType(true)).toBe("boolean");
  });

  it("should return 'symbol' for symbol values", () => {
    expect(getBasicType(Symbol("test"))).toBe("symbol");
  });

  it("should return 'function' for function values", () => {
    expect(getBasicType(() => {})).toBe("function");
  });

  it("should return the class name for object values", () => {
    class TestClass {}
    expect(getClassType(new TestClass())).toBe("TestClass");
  });

  it("should return 'Object' for plain objects", () => {
    expect(getClassType({})).toBe("Object");
  });

  it("should return 'Array' for array values", () => {
    expect(getClassType([])).toBe("Array");
  });

  it("should return 'Date' for date values", () => {
    expect(getClassType(new Date())).toBe("Date");
  });

  it("should return 'RegExp' for regular expression values", () => {
    expect(getClassType(/test/)).toBe("RegExp");
  });
});

describe("getCheckTypeErrorReason", () => {
  it("should return the reason if the error is an instance of CheckTypeError", () => {
    const reason = { message: "Invalid type" };
    const error = new CheckTypeError(reason);
    expect(getCheckTypeErrorReason(error)).toBe(reason);
  });

  it("should throw the error if it is not an instance of CheckTypeError", () => {
    const error = new Error("Some other error");
    expect(() => getCheckTypeErrorReason(error)).toThrow(error);
  });

  it("should return the reason if the error is an instance of CheckTypeError with string reason", () => {
    const reason = "Invalid type";
    const error = new CheckTypeError(reason);
    expect(getCheckTypeErrorReason(error)).toBe(reason);
  });

  it("should return the reason if the error is an instance of CheckTypeError with expect and actual", () => {
    const expectType = "string";
    const actualType = "number";
    const error = new CheckTypeError(expectType, actualType);
    expect(getCheckTypeErrorReason(error)).toBe(error.message);
  });
});
