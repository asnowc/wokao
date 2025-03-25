import { internalCheckType } from "../_check_base.ts";
import type { ExpectType, InferExpect, TypeCheckFn, TypeCheckFnOption } from "../type.ts";
import { CheckTypeError, getClassType } from "../utils.ts";

function checkTuple<T extends any[] = unknown[]>(
  arr: unknown[],
  expect: ExpectType[],
  options: Readonly<TypeCheckFnOption>,
): T {
  const { checkAll, copy } = options;
  const checkProvidedOnly = options.policy == "pass";

  if (!Array.isArray(arr)) throw new CheckTypeError("Array", getClassType(arr));
  const expectLen = expect.length;

  if (arr.length != expectLen) {
    if (arr.length > expectLen) {
      if (checkProvidedOnly) {
        if (copy) return arr.slice(0, expectLen) as T;
        else return arr as T;
      }
    }
    throw new CheckTypeError({
      length: CheckTypeError.createCheckErrorDesc(expectLen.toString(), arr.length.toString()),
    });
  }

  let isErr = false;

  const errors: Record<string, any> = {};
  let res: T;
  if (copy) {
    res = new Array(expectLen) as T;
    for (let i = 0; i < expectLen; i++) {
      try {
        res[i] = internalCheckType(arr[i], expect[i], options);
      } catch (error) {
        if (!checkAll) throw error;
        isErr = true;
        errors[i] = error;
      }
    }
  } else {
    res = arr as T;
    for (let i = 0; i < expectLen; i++) {
      const actualType = arr[i];
      try {
        internalCheckType(actualType, expect[i], options);
      } catch (error) {
        errors[i] = error;
        isErr = true;
        if (!checkAll) break;
      }
    }
  }

  if (isErr) throw new CheckTypeError(errors);
  return res;
}
/** @public */
export type InferExpectTuple<T extends any[]> = T extends [infer P, ...infer Q]
  ? [InferExpect<P>, ...InferExpectTuple<Q>]
  : [];

/** @public 断言目标匹配给定元组类型 */
export function tuple<T extends ExpectType[]>(expect: T): TypeCheckFn<InferExpectTuple<T>> {
  return function tupleChecker(input, option): InferExpectTuple<T> {
    if (!Array.isArray(input)) throw new CheckTypeError("Array", getClassType(input));
    return checkTuple(input, expect, option);
  };
}
