import { assertType, expect, test } from "vitest";
import { array, checkType, checkTypeCopy, CheckTypeError, createCheckerFn, tuple } from "@asla/wokao";
import "./assests/type_check.assert.ts";

test("使用自定义函数判断", function () {
  const checker = (a: unknown) => {
    if (a == 1) return 2;
    throw new CheckTypeError("只能是1");
  };
  const value = checkType(1, checker);
  assertType<number>(value);

  expect(value).toBe(2);
  expect(checkTypeCopy(1, checker), "转换值").toBe(2);
  expect(() => checkType(0, checker)).checkFail();
});
test("可选", function () {
  expect(checkType({}, { abc: createCheckerFn((input) => 8, { optional: true }) })).toEqual({ abc: 8 });
  expect(() => checkType({}, { abc: createCheckerFn((input) => 8) })).checkFailWithField(["abc"]);

  expect(() => checkType({ age: "12" }, { abc: createCheckerFn((input) => 8), age: "number" }, { checkAll: true }))
    .checkFailWithField(
      ["abc", "age"],
    );
});
test("Checker 的返回值会替换原始值", function () {
  const expectType = (input: unknown): number => {
    return 1;
  };
  expect(checkType(undefined, expectType)).toBe(1);
  expect(checkType({ abc: undefined }, { abc: expectType })).toEqual({ abc: 1 });
  expect(checkType([undefined], tuple([expectType]))).toEqual([1]);
  expect(checkType([undefined], array([expectType]))).toEqual([1]);

  expect(checkTypeCopy(undefined, expectType)).toBe(1);
  expect(checkTypeCopy({ abc: undefined }, { abc: expectType })).toEqual({ abc: 1 });

  assertType<{ abc: number }>(checkTypeCopy({ abc: undefined }, { abc: expectType }));
});
