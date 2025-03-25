import { assertType, expect, test } from "vitest";
import { checkType, checkTypeCopy, optional } from "@asla/wokao";
import "../assests/type_check.assert.ts";
test("对象字段可选", function () {
  const result = checkType({ s: undefined }, { s: optional("number"), q: optional("string") });
  assertType<{ s?: number; q?: string }>(result);
  checkType({ s: 1, q: "abc" }, { s: optional("number"), q: optional("string") });

  expect(
    () => checkType({ s: "abc" }, { s: optional("number") }),
  ).checkFailWithField(["s"]);
});
test("默认值(copyCheckType)", function () {
  const result = checkTypeCopy({}, { q: optional("string", undefined, 7) });
  assertType<{ q: string | number }>(result);

  expect(checkTypeCopy({}, { q: optional("string", undefined, 7) })).toEqual({ q: 7 });
  expect(checkTypeCopy({ q: null }, { q: optional("string", null, 7) })).toEqual({ q: 7 });
  expect(
    checkTypeCopy({ q: null, c: undefined, a: null }, {
      q: optional("string", null, 7),
      c: optional("string", "nullish", 7),
      a: optional("string", "nullish", 7),
    }),
  ).toEqual({ q: 7, c: 7, a: 7 });

  assertType<{ a?: string | null }>(checkTypeCopy({}, { a: optional("string", "nullish") }));
});

test("默认值 checkType", function () {
  const obj = {};
  const result = checkType(obj, { q: optional("string", undefined, 7) });
  expect(result).toBe(obj);
  expect(obj).toEqual({ q: 7 });
});
