import { assertType, expect, test } from "vitest";
import { checkType, checkTypeCopy, CheckTypeError } from "@asla/wokao";
import "./assests/type_check.assert.ts";

test("使用自定义函数判断", function () {
  const checker = (a: unknown) => {
    if (a == 1) return 2;
    throw new CheckTypeError("只能是1");
  };
  const value = checkType(1, checker);
  assertType<number>(value);

  expect(value).toBe(1);
  expect(checkTypeCopy(1, checker), "转换值").toBe(2);
  expect(() => checkType(0, checker)).checkFail();
});

test("Checker 的返回值只有在 checkTypeCopy 下才会替换原始值", function () {
  const expectType = (input: unknown) => {
    return 1;
  };
  expect(checkType(undefined, expectType)).toBe(undefined);
  expect(checkType({ abc: undefined }, { abc: expectType })).toEqual({ abc: undefined });

  expect(checkTypeCopy(undefined, expectType)).toBe(1);
  expect(checkTypeCopy({ abc: undefined }, { abc: expectType })).toEqual({ abc: 1 });

  assertType<{ abc: number }>(checkTypeCopy({ abc: undefined }, { abc: expectType }));
});
