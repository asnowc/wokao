import { internalCheckType } from "./_check_base.ts";
import type { ExpectType, InferExpect, TypeCheckOption } from "./type.ts";

/**
 * 校验数据类型，校验通过后返回参数本身
 * 如果使用自定义检测函数，且自定义检测函数返回了转换后的值，会被忽略。但是推断类型会推断检测函数的返回的类型，这里需要注意区别
 * @public
 */
export function checkType<T extends ExpectType>(
  input: unknown,
  expectType: T,
  opts?: TypeCheckOption,
): InferExpect<T>;
export function checkType(input: unknown, expectType: ExpectType, opts: TypeCheckOption = {}): unknown {
  return internalCheckType(input, expectType, {
    copy: false,
    checkAll: opts.checkAll,
    policy: opts.policy,
  });
}

/**
 * 校验数据类型，校验通过后返回转换后的数据（深拷贝）。如果使用自定义检测函数，需要自定义检测函决定是否深拷贝
 * @public
 */
export function checkTypeCopy<T extends ExpectType>(
  input: unknown,
  expectType: T,
  opts?: TypeCheckOption,
): InferExpect<T>;
export function checkTypeCopy(input: unknown, expectType: ExpectType, opts: TypeCheckOption = {}): unknown {
  return internalCheckType(input, expectType, {
    copy: true,
    checkAll: opts.checkAll,
    policy: opts.policy,
  });
}
