import type { TypeCheckFn } from "../type.ts";
import { CheckTypeError, getBasicType, getClassType } from "../utils.ts";

/**
 * 断言目标是给定类的实例
 * @public
 */
export function instanceOf<T extends new (...args: any[]) => any>(
  Class: T,
): TypeCheckFn<InstanceType<T>> {
  if (typeof Class !== "function") throw new Error("Class must be a class");
  return function checkFn(input, option) {
    const basicType = getBasicType(input);
    if (basicType !== "object") throw new CheckTypeError("object", basicType);
    if (input instanceof Class) return input as InstanceType<T>;
    throw new CheckTypeError(Class.name, getClassType(Class));
  };
}

/**
 * 断言目标等于给定的枚举
 * @public
 */
export function enumType<T>(expects: T[]): TypeCheckFn<T> {
  return function expectEnumTYpe(v, option): T {
    if (expects.includes(v as any)) return v as T;
    throw new CheckTypeError(`${v} 不在枚举${expects.join(", ")} 中`);
  };
}
