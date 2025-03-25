import { expect } from "vitest";
import { CheckTypeError } from "@asla/wokao";
interface CustomMatchers<R = unknown> {
  checkFail(): R;
  checkFailWithField(fields: string[]): R;
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
function passMsg() {
  return "pass";
}
const passRes = { pass: true, message: passMsg };
expect.extend({
  checkFail(received: () => any) {
    const { error, result } = isCheckTypeError(received);
    if (result) return result;
    return {
      pass: true,
      message: passMsg,
    };
  },
  checkFailWithField(received: () => any, field: string[]) {
    const res = isCheckTypeError(received);
    if (res.result) return res.result;
    const reason = res.error?.reason;
    if (typeof reason !== "object") {
      return {
        pass: false,
        message: () => `抛出的 CheckTypeError reason 应该是一个对象`,
        actual: typeof reason,
        expected: "object",
      };
    }
    const act = Object.keys(reason);

    try {
      expect(act).toEqual(field);
      return passRes;
    } catch (error) {
      return {
        pass: false,
        message: () => `预期检测失败`,
        actual: act,
        expected: field,
      };
    }
  },
});

function isCheckTypeError(received: () => any) {
  let error: any;
  try {
    received();
    return {
      pass: false,
      message: () => `预期不通过检测, 实际通过`,
    };
  } catch (e) {
    error = e;
  }
  if (!(error instanceof CheckTypeError)) {
    return {
      result: {
        pass: false,
        message: () => `应抛出 CheckTypeError 异常`,
        actual: error?.constructor,
        expected: CheckTypeError,
      },
      error: undefined,
    };
  }
  return {
    error,
    result: undefined,
  };
}
