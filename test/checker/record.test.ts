import { expect, test } from "vitest";
import { array, checkType, checkTypeCopy, record } from "@asla/wokao";
import "../assests/type_check.assert.ts";

test("检测 record", function () {
  checkType({ a: 1, b: 2, c: 3 }, record.number);
  expect(() => checkType({ a: 1, c: null, d: 4 }, record.number)).checkFailWithField(["c"]);
  expect(() => checkType(null, record.string)).checkFail();
});
test("检测所有字段", function () {
  expect(() => checkType({ a: 1, b: "2", c: 3, d: "4" }, record.number, {})).checkFailWithField(["b"]);
  expect(() => checkType({ a: 1, b: "2", c: 3, d: "4" }, record.number, { checkAll: true })).checkFailWithField([
    "b",
    "d",
  ]);
});
test("嵌套", function () {
  checkType([{ a: 1 }, { a: 2 }, { a: 3 }], array({ a: "number" }));
  expect(() => checkType([{ a: 1 }, { a: "str" }, { a: 3 }], array({ a: "number" }))).checkFailWithField(["1"]);
  expect(() => checkType([{ a: 1 }, {}, { a: 3 }], array({ a: "number" }))).checkFailWithField(["1"]);
});

test("替换键值", function () {
  const expectType = record((val: any) => val * 2);

  expect(checkTypeCopy({ a: 1, b: 2 }, expectType), "值已被替换成").toEqual({ a: 2, b: 4 });

  const r0 = { a: 1, b: 2 };
  expect(checkType(r0, expectType), "值已被替换成").toBe(r0);
  expect(r0).toEqual({ a: 2, b: 4 });
});
