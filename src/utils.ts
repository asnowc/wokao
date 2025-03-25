import type { BasicType, TypeCheckFn, TypeCheckFnOption } from "./type.ts";

/**
 * 获取数据类型。在typeof之上区分null
 * @public
 */
export function getBasicType(val: any): BasicType {
  return val === null ? "null" : typeof val;
}
/**
 * 获取对象的类名, 如果val为基础类型, 则返回基础类型
 * @public
 */
export function getClassType(val: any): string {
  let basicType = getBasicType(val);
  if (basicType === "object") {
    let type: string = val.constructor?.name ?? "Object";
    return type;
  } else return basicType;
}
type ReasonMap = {
  [key: string]: string | ReasonMap;
};
export class CheckTypeError extends Error {
  static createCheckErrorDesc(expect: string, actual: string): string {
    return `Expect: ${expect}, actual: ${actual}`;
  }
  constructor(expect: string, actual: string);
  constructor(reason: string);
  constructor(reason: ReasonMap);
  constructor(reason: string | ReasonMap, actual?: string) {
    let msg: string | undefined;
    let cause: CheckTypeError | object | undefined;
    if (typeof reason === "string") {
      msg = actual ? CheckTypeError.createCheckErrorDesc(reason, actual) : reason;
    } else {
      msg = "Check type error";
      cause = reason;
    }
    super(msg, { cause: cause });
    this.reason = reason;
  }
  declare cause: CheckTypeError | Record<string, any>;
  reason?: string | ReasonMap;
}
/** 获取 CheckTypeError 的异常信息，如果 err 不是 CheckTypeError， 则抛出异常 */
export function getCheckTypeErrorReason(err: unknown): CheckTypeError["reason"] {
  if (err instanceof CheckTypeError) {
    return err.reason;
  } else {
    throw err;
  }
}
export type CreateCheckerFnOption = {
  optional?: boolean;
};
/** 创建自定义检测函数 */
export function createCheckerFn<T>(
  assertFn: (input: unknown, checkOption: Readonly<TypeCheckFnOption>) => T,
  option: CreateCheckerFnOption = {},
): TypeCheckFn<T> {
  if (option.optional) (assertFn as TypeCheckFn<any>).wokaOptional = true;
  return assertFn as TypeCheckFn<T>;
}
