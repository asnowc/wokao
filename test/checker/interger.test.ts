import { expect, test } from "vitest";
import { checkType, integer } from "@asla/wokao";
import "../assests/type_check.assert.ts";

test("integer", function () {
  expect(() => checkType(NaN, integer())).checkFail();
  expect(() => checkType(Infinity, integer())).checkFail();
  expect(() => checkType(-Infinity, integer())).checkFail();
  expect(() => checkType("1", integer())).checkFail();
  expect(() => checkType(true, integer())).checkFail();

  checkType(2, integer());
});
test("integer-range", function () {
  expect(() => checkType(-1, integer(0))).checkFail();
  checkType(9, integer(0));
  checkType(9, integer(0, 10));
  expect(() => checkType(11, integer(0, 10))).checkFail();
  expect(() => checkType(NaN, integer(0, 10))).checkFail();
  expect(() => checkType(Infinity, integer(0, 10))).checkFail();

  checkType("56", integer({ acceptString: true }));
  expect(() => checkType("3", integer({ max: 2, acceptString: true }))).checkFail();
  expect(() => checkType("3", integer({ min: 5, acceptString: true }))).checkFail();
  checkType("3", integer({ min: 0, max: 10, acceptString: true }));
});
test("integer.positive", function () {
  checkType(1, integer.positive);
  checkType(100, integer.positive);
  checkType("100", integer.positive);

  expect(() => checkType(-1, integer.positive)).checkFail();
  expect(() => checkType(0, integer.positive)).checkFail();
  expect(() => checkType("0", integer.positive)).checkFail();
  expect(() => checkType("-1", integer.positive)).checkFail();
});
test("integer.nonnegative", function () {
  checkType(0, integer.nonnegative);
  checkType(1, integer.nonnegative);
  checkType(100, integer.nonnegative);
  checkType("100", integer.nonnegative);

  expect(() => checkType(-1, integer.nonnegative)).checkFail();
  expect(() => checkType("-1", integer.nonnegative)).checkFail();
});
