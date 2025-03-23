import { ExpectType, InferExpect } from "./type.ts";

//或许，放弃 replace, 换成两种检测，一种是纯检测，不修改原数据，另外一种是根据断言的类型返回新的数据

export type AssertTypeOption = {
  /**
   * 检测策略
   * @remarks 对于对象和元组类型, 如果对象或元组中存在预期类型中不存在的字段, 应该执行的策略
   *   "pass": 检测通过
   *   "error": 检测不通过
   * @defaultValue "error"
   */
  policy?: "pass" | "error";

  /**
   * 为 true 检测所有预期类型, 为 false 时返回第一检测不通过的结果
   * @defaultValue false
   */
  checkAll?: boolean;
};

/**
 * 校验数据类型，校验通过后返回参数本身
 * @public
 */
export declare function checkType<T extends ExpectType>(
  input: unknown,
  expectType: ExpectType,
  opts?: AssertTypeOption,
): InferExpect<T>;
export declare function checkType(input: unknown, expectType: ExpectType): unknown;

/**
 * 校验数据类型，校验通过后返回转换后的数据
 * @public
 */
export declare function copyAssertType<T extends ExpectType>(
  input: unknown,
  expectType: ExpectType,
  opts?: AssertTypeOption,
): InferExpect<T>;
export declare function copyAssertType(input: unknown, expectType: ExpectType): unknown;

export interface TypeAssert<T, C extends ExpectType = any> {
  /** 只对 object 有效，允许建不存在 */
  optional?: boolean;
  /** 前置类型 */
  baseType: C;
  (input: InferExpect<C>, option: Readonly<AssertTypeOption>): T;
}

export type CreateAssertTypeFnOption<Base extends ExpectType = ExpectType> = {
  optional?: boolean;
  baseType?: Base;
};
export declare function createTypeAssert<T>(typeAssert: (input: unknown) => T): TypeAssert<T>;
export declare function createTypeAssert<T, Base extends ExpectType>(
  assertFn: (input: InferExpect<Base>) => T,
  option?: CreateAssertTypeFnOption<Base>,
): TypeAssert<T>;

export declare class AssertTypeError extends Error {
  constructor();
  toReasonText(): string;
  toReasonMap(): object;
}

//关于自定义检测函数，能否改成如果检测不通过，抛出异常，然后只返回一个值用于替换转换值
//还是自定义检测函数，添加一个转换器选项，根据给定断言进行检测，然后传给转换器进行转换
