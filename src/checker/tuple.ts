import { internalCheckType } from "../_check_base.ts";
import type { ExpectType, InferExpect, TypeCheckFn, TypeCheckFnOption } from "../type.ts";
import { CheckTypeError, getClassType } from "../utils.ts";

function checkLen(expectLen: number, actualLen: number): void {
  if (actualLen !== expectLen) {
    throw new CheckTypeError({
      length: CheckTypeError.createCheckErrorDesc(expectLen.toString(), actualLen.toString()),
    });
  }
}

function checkTuple<T extends any[] = unknown[]>(
  arr: unknown,
  expect: ExpectType[],
  options: Readonly<TypeCheckFnOption>,
): T {
  const { checkAll, copy } = options;

  if (!Array.isArray(arr)) throw new CheckTypeError("Array", getClassType(arr));
  const expectLen = expect.length;

  checkLen(expectLen, arr.length);

  let isErr = false;

  const errors: Record<string, any> = {};
  const res: T = (copy ? new Array(expectLen) : arr) as T;
  for (let i = 0; i < expectLen; i++) {
    try {
      const raw = arr[i];
      const value = internalCheckType(raw, expect[i], options);
      if (copy) res[i] = value;
      else if (value !== raw) res[i] = value;
    } catch (error) {
      isErr = true;
      errors[i] = error;
      if (!checkAll) break;
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
    return checkTuple(input, expect, option);
  };
}
