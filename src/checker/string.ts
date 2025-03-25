import type { TypeCheckFn } from "../type.ts";
import { internalCheckType } from "../_check_base.ts";
import { CheckTypeError } from "../utils.ts";

/**
 * @public 断言目标能够被正则表达式匹配
 */
export function stringMatch(regexp: RegExp): TypeCheckFn<string> {
  return function checkFn(value, option): string {
    if (!regexp.test(internalCheckType(value, "string", option))) {
      throw new CheckTypeError(`预期能够被正则 ${regexp.source} 匹配`);
    }
    return value as string;
  };
}
