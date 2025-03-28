import type { TypeCheckFn } from "../type.ts";
import { CheckTypeError } from "../utils.ts";

/**
 * 断言目标是数字且在指定的范围内
 * @public
 */
export function numberRange(min: number, max = Infinity): TypeCheckFn<number> {
  return function checkNumberRange(val, option): number {
    if (typeof val !== "number") throw new CheckTypeError("number", typeof val);
    if (Number.isNaN(val)) throw new CheckTypeError("Integer", String(val));
    if (val > max || val < min) throw new CheckTypeError(`[${min},${max}]`, val.toString());
    return val;
  };
}
/** @public */
export type NumberCheckOption = {
  /** 默认为 -Infinity */
  min?: number;
  /** 默认为 Infinity */
  max?: number;
  /** 如果为 true, 尝试将字符串转为整数 */
  acceptString?: boolean;
};
/**
 * @public 断言目标是一个整数
 * @param min - 默认 -Infinity
 * @param max - 默认 Infinity
 */
export function integer(min?: number, max?: number): TypeCheckFn<number>;
/**
 * @public 断言目标是一个整数
 */
export function integer(option?: NumberCheckOption): TypeCheckFn<number>;
export function integer(min: number | NumberCheckOption = -Infinity, max: number = Infinity): TypeCheckFn<number> {
  let acceptString: boolean | undefined = false;
  if (typeof min === "object") {
    max = min.max ?? Infinity;
    acceptString = min.acceptString;
    min = min.min ?? -Infinity;
  }
  return function checkInteger(input): number {
    let useValue: number;
    if (typeof input !== "number") {
      if (acceptString && typeof input === "string") {
        useValue = Number.parseInt(input);
      } else {
        throw new CheckTypeError("Integer", typeof input);
      }
    } else useValue = input;

    if (!Number.isInteger(useValue)) throw new CheckTypeError("Integer", String(input));

    if (useValue > max || useValue < min) {
      throw new CheckTypeError(`[${min},${max}]`, useValue.toString());
    }
    return useValue;
  };
}
