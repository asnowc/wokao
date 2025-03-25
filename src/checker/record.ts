import { internalCheckType } from "../_check_base.ts";
import type { ExpectType, InferExpect, TypeCheckFn, TypeCheckFnOption } from "../type.ts";
import { CheckTypeError, getCheckTypeErrorReason } from "../utils.ts";

function checkRecord<T>(
  input: unknown,
  type: ExpectType,
  options: Readonly<TypeCheckFnOption>,
): Record<string, T> {
  const inputObj = internalCheckType(input, "object", options) as Record<string, any>;

  let errCount = 0;
  const errors: any = {};
  const list = Object.keys(inputObj);

  let key: string;
  const res = options.copy ? {} : inputObj;
  for (let i = 0; i < list.length; i++) {
    key = list[i];
    try {
      const value = internalCheckType(inputObj[key], type, options);
      if (options.copy) res[key] = value;
    } catch (error) {
      errors[key] = getCheckTypeErrorReason(error);
      errCount++;
      if (!options.checkAll) throw new CheckTypeError(errors);
    }
  }
  if (errCount) throw new CheckTypeError(errors);
  return res;
}

interface RecordChecker {
  <T extends ExpectType>(type: T): TypeCheckFn<Record<string, InferExpect<T>>>;
  number: TypeCheckFn<Record<string, number>>;
  string: TypeCheckFn<Record<string, string>>;
  boolean: TypeCheckFn<Record<string, boolean>>;
  bigint: TypeCheckFn<Record<string, bigint>>;
  symbol: TypeCheckFn<Record<string, symbol>>;
  object: TypeCheckFn<Record<string, object>>;
  function: TypeCheckFn<Record<string, (...args: any[]) => any>>;
}
/**
 * 断言目标是字典类型
 * @public
 */
export const record: RecordChecker = /*  @__NO_SIDE_EFFECTS__ */ function record<
  T extends ExpectType,
>(
  type: T,
): TypeCheckFn<Record<string, InferExpect<T>>> {
  return function checkRecordChecker(val: unknown, checkOpts: TypeCheckFnOption) {
    return checkRecord(val, type, checkOpts);
  };
};
record.number = record("number");
record.string = record("string");
record.boolean = record("boolean");
record.bigint = record("bigint");
record.symbol = record("symbol");
record.object = record("object");
record.function = record("function");
