import { checkType, checkTypeCopy, ExpectType, integer } from "@asla/wokao";

import { assertType, expect, test } from "vitest";

test("转换 host", function () {
  const expectType = {
    value: "number",
    host: (input, option): { hostName: string; port: number } => {
      const str = checkType(input, "string");
      const [hostName, portStr] = str.split(":");
      const port = checkTypeCopy(portStr, integer({ min: 0, max: 65535, acceptString: true }));

      return {
        hostName,
        port,
      };
    },
  } satisfies ExpectType;
  const input = { value: 1, host: "deno.com:80" };
  expect(checkType(input, expectType)).toBe(input);

  const copyValue = checkTypeCopy(input, expectType);
  expect(copyValue).toEqual({ value: 1, host: { hostName: "deno.com", port: 80 } });
  assertType<{ value: number; host: { hostName: string; port: number } }>(copyValue);
});
