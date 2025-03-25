import { expect, test } from "vitest";
import { checkType, enumType, instanceOf, numberRange } from "@asla/wokao";
import "../assests/type_check.assert.ts";

test("numberRange", function () {
  const towToFour = numberRange(2, 4);

  checkType(2, towToFour);
  checkType(3, towToFour);
  checkType(4, towToFour);

  expect(() => checkType(5, towToFour)).checkFail();
  expect(() => checkType(1, towToFour)).checkFail();
  expect(() => checkType("d", towToFour)).checkFail();

  expect(() => checkType(undefined, towToFour)).checkFail();
  expect(() => checkType(new Set(), towToFour)).checkFail();
});
test("instanceOf", function () {
  const mapIns = instanceOf(Map);
  checkType(new Map(), mapIns);
  expect(() => checkType(null, mapIns)).checkFail();
  expect(() => checkType(NaN, mapIns)).checkFail();
  expect(() => checkType(undefined, mapIns)).checkFail();
  expect(() => checkType({}, mapIns)).checkFail();
});

test("enumTypes", function () {
  const exp = enumType([13, 2, 3]);
  checkType(3, exp);
  expect(() => checkType(0, exp)).checkFail();
  expect(() => checkType("str", exp)).checkFail();
});
