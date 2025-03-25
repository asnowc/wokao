import type { ExpectType, InferExpect, TypeCheckFn, TypeCheckFnOption } from "../type.ts";
import { CheckTypeError, createCheckerFn, getCheckTypeErrorReason, getClassType } from "../utils.ts";
import { internalCheckType } from "../_check_base.ts";

function checkArray<T>(
  input: unknown,
  expect: ExpectType,
  checkOpts: Readonly<TypeCheckFnOption>,
  option: {
    maxLen?: number;
    minLen?: number;
  } = {},
): T[] {
  if (!Array.isArray(input)) throw new CheckTypeError("Array", getClassType(input));
  const { maxLen, minLen } = option;
  const errors: Record<string | number, any> = {};
  let errCount = 0;

  if (maxLen !== undefined && input.length > maxLen) {
    if (checkOpts.policy === "pass") {
      if (checkOpts.copy) return input.slice(0, maxLen);
    } else {
      errors.length = CheckTypeError.createCheckErrorDesc(`最大 ${maxLen}`, input.length.toString());
      errCount++;
      if (!checkOpts.checkAll) throw new CheckTypeError(errors);
    }
  }
  if (minLen !== undefined && input.length < minLen) {
    errors.length = CheckTypeError.createCheckErrorDesc(`最小 ${minLen}`, input.length.toString());
    errCount++;
    if (!checkOpts.checkAll) throw new CheckTypeError(errors);
  }
  const res: T[] = checkOpts.copy ? new Array(input.length) : input;

  let item: T;
  for (let i = 0; i < input.length; i++) {
    try {
      item = internalCheckType(input[i], expect, checkOpts) as T;
      if (checkOpts.copy) res[i] = item!;
    } catch (error) {
      errCount++;
      errors[i] = getCheckTypeErrorReason(error);
      if (!checkOpts.checkAll) throw new CheckTypeError(errors);
    }
  }
  if (errCount) throw new CheckTypeError(errors);
  return res;
}
interface ArrayChecker {
  <T extends ExpectType>(
    type: T,
    option?: {
      maxLen?: number;
      minLen?: number;
    },
  ): TypeCheckFn<InferExpect<T>[]>;
  number: TypeCheckFn<number[]>;
  string: TypeCheckFn<string[]>;
  boolean: TypeCheckFn<boolean[]>;
  bigint: TypeCheckFn<bigint[]>;
  symbol: TypeCheckFn<symbol[]>;
  object: TypeCheckFn<object[]>;
  function: TypeCheckFn<((...args: any[]) => any)[]>;
}

/**
 * 断言目标是数组且元素为给定的类型
 * @public
 */
export const array: ArrayChecker = /*  @__NO_SIDE_EFFECTS__ */ function array<
  T extends ExpectType,
>(
  type: T,
  option: {
    maxLen?: number;
    minLen?: number;
  } = {},
): TypeCheckFn<InferExpect<T>[]> {
  return createCheckerFn(function wokaoArrayChecker(val, checkOpts) {
    return checkArray<any>(val, type, checkOpts, option);
  });
};

array.number = array("number");
array.string = array("string");
array.boolean = array("boolean");
array.bigint = array("bigint");
array.symbol = array("symbol");
array.object = array("object");
array.function = array("function");
