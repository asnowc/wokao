import { expect, test } from "vitest";
import { checkType, stringMatch } from "@asla/wokao";
import "../assests/type_check.assert.ts";

test("integer", function () {
  checkType("123", stringMatch(/123/));
  expect(() => checkType(123, stringMatch(/123/))).checkFail();
  expect(() => checkType(undefined, stringMatch(/123/))).checkFail();
});
