import { internalCheckType } from "../_check_base.ts";
import type { ExpectType, InferExpect, TypeCheckFn } from "../type.ts";
import { createCheckerFn } from "../utils.ts";

interface OptionalChecker {
  <T extends ExpectType>(type: T, mode?: undefined): TypeCheckFn<InferExpect<T> | undefined>;
  <T extends ExpectType>(type: T, mode: null): TypeCheckFn<InferExpect<T> | null>;
  <T extends ExpectType>(
    type: T,
    mode?: undefined | null | "nullish",
  ): TypeCheckFn<InferExpect<T> | undefined | null>;
  <T extends ExpectType, Def = T>(
    type: T,
    mode: undefined | null | "nullish",
    defaultValue: Def,
  ): TypeCheckFn<InferExpect<T> | Def>;
  number: TypeCheckFn<number | undefined>;
  string: TypeCheckFn<string | undefined>;
  boolean: TypeCheckFn<boolean | undefined>;
  bigint: TypeCheckFn<bigint | undefined>;
  symbol: TypeCheckFn<symbol | undefined>;
  object: TypeCheckFn<object | undefined>;
  function: TypeCheckFn<((...args: any[]) => any) | undefined>;
}
/**
 * 断言目标是可选类型
 * @public
 */
export const optional: OptionalChecker = /*  @__NO_SIDE_EFFECTS__ */ function optional<
  T extends ExpectType,
>(
  type: T,
  mode: undefined | null | "nullish" = undefined,
  defaultValue?: any,
): TypeCheckFn<InferExpect<T>> {
  if (mode === "nullish") {
    return createCheckerFn(function optionalChecker(val, checkOpts) {
      if (val === undefined || val === null) {
        if (defaultValue !== undefined) return defaultValue;
        return val;
      }
      return internalCheckType(val, type, checkOpts);
    }, { optional: true });
  }

  return createCheckerFn(function optionalChecker(val, checkOpts) {
    if (val === mode) {
      if (defaultValue !== undefined) return defaultValue;
      return val;
    }
    return internalCheckType(val, type, checkOpts);
  }, { optional: true });
};
optional.number = optional("number");
optional.string = optional("string");
optional.boolean = optional("boolean");
optional.bigint = optional("bigint");
optional.symbol = optional("symbol");
optional.object = optional("object");
optional.function = optional("function");
