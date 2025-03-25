import { CheckTypeError, getBasicType, getCheckTypeErrorReason } from "./utils.ts";
import type { ExpectObjectType, ExpectType, InferExpect, TypeCheckFnOption } from "./type.ts";

/**
 * 如果 对象的字段预期类型为可选, 并且实际存在字段为undefined, 则在deleteSurplus为true是将字段删除
 */
export function checkObject<T extends {}>(
  input: any,
  except: ExpectObjectType,
  options: Readonly<TypeCheckFnOption>,
): T {
  const { checkAll, copy, policy = "error" } = options;
  if (getBasicType(input) !== "object") throw new CheckTypeError("object", getBasicType(input));
  let isErr = false;
  const keys = Object.keys(input);
  const keysSet = policy === "pass" ? undefined : new Set(keys);

  const res: Record<string, any> = copy ? {} : input;
  const errors: Record<string, any> = {};
  let exist: boolean;
  let itemValue: any;
  for (const [testKey, exceptType] of Object.entries(except)) {
    exist = Object.hasOwn(input, testKey);
    itemValue = input[testKey];
    if (!exist) {
      if (typeof exceptType === "function" && exceptType.wokaOptional) {
        itemValue = undefined;
      } else {
        errors[testKey] = new CheckTypeError("存在", "不存在");
        if (checkAll) continue;
        else {
          isErr = true;
          break;
        }
      }
    }
    try {
      const value = internalCheckType(itemValue, exceptType, options);
      if (copy) res[testKey] = value;
    } catch (error) {
      isErr = true;
      errors[testKey] = getCheckTypeErrorReason(error);
      if (!checkAll) break;
    }
    keysSet?.delete(testKey);
  }
  if (keysSet?.size) {
    for (const key of keysSet) {
      errors[key] = CheckTypeError.createCheckErrorDesc("不存在", "存在");
    }
    isErr = true;
  }
  if (isErr) throw new CheckTypeError(errors);
  return res as T;
}

function checkUnion<T>(
  arr: unknown,
  exceptUnion: ExpectType[],
  option: Readonly<TypeCheckFnOption>,
): T {
  const errors: any[] = [];
  for (let i = 0; i < exceptUnion.length; i++) {
    try {
      return internalCheckType(arr, exceptUnion[i], option) as T;
    } catch (error) {
      errors.push(error);
    }
  }
  throw new CheckTypeError("没有符合的联合类型： " + errors.join(" | "));
}
export function internalCheckType<T extends ExpectType>(
  input: any,
  except: T,
  options: Readonly<TypeCheckFnOption>,
): InferExpect<T>;
export function internalCheckType(
  input: any,
  expect: ExpectType,
  opts: Readonly<TypeCheckFnOption>,
): any {
  switch (typeof expect) {
    case "string": {
      const actualType = getBasicType(input);
      if (actualType !== expect) throw new CheckTypeError(expect, actualType);
      return input;
    }
    case "object": {
      if (expect !== null) {
        if (expect instanceof Array) return checkUnion(input, expect, opts);
        return checkObject(input, expect, opts);
      }
      throw new ParameterError(
        2,
        CheckTypeError.createCheckErrorDesc("ExpectType", getBasicType(input)),
        "exceptType",
      );
    }
    case "function": {
      const res = expect(input, opts);
      if (opts.copy) return res;
      return input;
    }
    default: {
      throw new ParameterError(
        2,
        CheckTypeError.createCheckErrorDesc("ExpectType", typeof expect),
        "exceptType",
      );
    }
  }
}

class ParameterError extends Error {
  /**
   * @param index - 异常参数的索引 （从 1 开始）
   */
  constructor(index: number, cause: string, name?: string) {
    const msg = name ? `${index}(${name})` : index.toString();
    super(`参数 ${msg} 错误: ${cause}`);
  }
}
