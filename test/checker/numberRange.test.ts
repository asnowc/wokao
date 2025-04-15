import { checkType, numberRange } from "@asla/wokao";

import { expect, test } from "vitest";
import "../assests/type_check.assert.ts";

test("numberRange-range", function () {
  expect(() => checkType(-1, numberRange(0))).checkFail();
  checkType(9, numberRange(0));
  checkType(9, numberRange(0, 10));
  expect(() => checkType(11, numberRange(0, 10))).checkFail();
  expect(() => checkType(NaN, numberRange(0, 10))).checkFail();
  expect(() => checkType("9", numberRange(0, 10))).checkFail();
  expect(() => checkType(Infinity, numberRange(0, 10))).checkFail();
});
