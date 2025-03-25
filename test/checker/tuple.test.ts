import { assertType, expect, test } from "vitest";
import { checkType, checkTypeCopy, tuple } from "@asla/wokao";
import "../assests/type_check.assert.ts";

test("tuple 检测", function () {
  const res0 = checkType([2, "3"], tuple(["number", "string"] as const));
  assertType<[number, string]>(res0);

  checkType([2], tuple(["number"]));
  checkType([], tuple([]));

  expect(() => checkType([undefined], tuple([]))).checkFail();
  expect(() => checkType({}, tuple([]))).checkFail();
  expect(() => checkType(undefined, tuple([]))).checkFail();
  expect(() => checkType([2], tuple([]))).checkFail();

  expect(() => checkType([2, 3], tuple(["number"]))).checkFail();
  expect(() => checkType([2], tuple(["number", "string"]))).checkFail();
  expect(() => checkType(["2", "3"], tuple(["number", "string"]))).checkFail();
});
test("替换原始值", function () {
  const raw = [1, 2];
  expect(checkType(raw, tuple([(input) => (input as number * 2), "number"]))).toBe(raw);
  expect(raw).toEqual([2, 2]);

  expect(checkTypeCopy([1, 2], tuple([(input) => (input as number * 2), "number"]))).toEqual([2, 2]);
});
test("全匹配", function () {
  checkType([1, "d"], tuple(["number", "string"]));

  expect(() => checkType([1, "d"], tuple(["number", "number"]))).checkFailWithField(["1"]);
});
test("长度小于预期", function () {
  expect(() => checkType([1], tuple(["number", "string"]))).checkFailWithField(["length"]);
  expect(() => checkType([1], tuple(["number", "string"]), { policy: "pass" })).checkFailWithField(["length"]);
});
test("长度大于预期", function () {
  const val = [1, "d", null];
  expect(() => checkType(val, tuple(["number", "string"]))).checkFailWithField(["length"]);
  expect(() => checkType(val, tuple(["number", "string"]), { policy: "pass" })).checkFailWithField(["length"]);

  expect(() => checkTypeCopy(val, tuple(["number", "string"]))).checkFailWithField(["length"]);
  expect(() => checkTypeCopy(val, tuple(["number", "string"]), { policy: "pass" })).checkFailWithField(["length"]);
});
