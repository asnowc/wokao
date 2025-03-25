/**
 * 自定义类型校验函数
 * @public
 */
export interface TypeCheckFn<T> {
  /** 只对 object 有效，允许建不存在 */
  wokaOptional?: boolean;
  (input: unknown, option: Readonly<TypeCheckFnOption>): T;
}

/** @public */
export type BasicType =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function"
  | "null";

/**  @public */
export type ExpectUnionType = ExpectType[];

/**
 * 对象属性检测
 * @public
 */
export type ExpectObjectType = {
  [key: string | number]: ExpectType;
  [key: symbol]: any;
};

/** 类型检测
 * @remarks
 * string: BasicType 基础类型检测
 * function: 自定义检测函数
 * true: 检测通过, 可以用于 any类型
 * @public
 */
export type ExpectType<T = unknown> =
  | TypeCheckFn<T>
  | BasicType
  | ExpectObjectType
  | ExpectUnionType;

export type TypeCheckFnOption = TypeCheckOption & {
  copy?: boolean;
};
/** @public */
export type TypeCheckOption = {
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

type InferBaseMap = {
  number: number;
  bigint: bigint;
  boolean: boolean;
  undefined: undefined;
  null: null;
  function: Fn;
  object: object;
  symbol: symbol;
  string: string;
  [key: string]: unknown;
};
/**
 * 推断预期类型
 * @public
 */
export type InferExpect<T> = T extends string ? InferBaseMap[T]
  : T extends any[] ? InferExpectUnion<T>
  : T extends TypeCheckFn<infer E> ? E
  : T extends object ? {
      [key in keyof T]: InferExpect<T[key]>;
    }
  : unknown;

/** @public */
export type InferExpectUnion<T extends any[]> = T extends [infer P, ...infer Q] ? InferExpect<P> | InferExpectUnion<Q>
  : never;

type Fn = (...args: any[]) => any;
