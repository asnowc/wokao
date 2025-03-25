import { assertType, expect, test } from "vitest";
import { checkType, checkTypeCopy, tuple } from "@asla/wokao";
import "../assests/type_check.assert.ts";

test("tuple 检测", function () {
  const res0 = checkType([2, "3"], tuple(["number", "string"] as const));
  assertType<[number, string]>(res0);

  checkType([2], tuple(["number"]));
  checkType([], tuple([]));

  expect(() => checkType([undefined], tuple([]))).checkFail();
  expect(() => checkType([2], tuple([]))).checkFail();

  expect(() => checkType([2, 3], tuple(["number"]))).checkFail();
  expect(() => checkType([2], tuple(["number", "string"]))).checkFail();
  expect(() => checkType(["2", "3"], tuple(["number", "string"]))).checkFail();
});
test("全匹配", function () {
  checkType([1, "d"], tuple(["number", "string"]));

  expect(() => checkType([1, "d"], tuple(["number", "number"]))).checkFailWithField(["1"]);
});
test("长度检测", function () {
  let val = [1, "d", null];
  expect(() => checkType(val, tuple(["number", "string"]))).checkFailWithField(["length"]);
  expect(val).toEqual([1, "d", null]);
});
test("仅匹配预期提供字段", function () {
  let val = [1, "d", null];
  checkType(val, tuple(["number", "string"]), { policy: "pass" });
  expect(val).toEqual([1, "d", null]);
});
test("移除多余", function () {
  let val = [1, "d", null];
  const result = checkTypeCopy(val, tuple(["number", "string"]), { policy: "pass" });
  expect(result).toEqual([1, "d"]);
  expect(val).toEqual([1, "d", null]);
});
