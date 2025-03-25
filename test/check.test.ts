import { describe, expect, test } from "vitest";
import { checkType, checkTypeCopy, ExpectType } from "@asla/wokao";
import "./assests/type_check.assert.ts";

describe("基础类型检测", function () {
  test("null", function () {
    checkType(null, "null");
    expect(() => checkType(null, {})).checkFail();
  });
  test("object", function () {
    checkType({}, "object");
    expect(() => checkType(null, "object")).checkFail();
    expect(() => checkType("abc", "object")).checkFail();
  });
  test("symbol", function () {
    checkType(Symbol(), "symbol");
    expect(() => checkType({}, "symbol")).checkFail();
  });
});
describe("检测对象", function () {
  test("检测对象字段", function () {
    let obj = { s: 3, i: "s", q: undefined };
    checkType(obj, { s: "number", i: "string", q: "undefined" });
    expect(obj).toEqual({ s: 3, i: "s", q: undefined });
    expect(() => checkType({ a: 8 }, { a: "number", b: "number" })).checkFailWithField(["b"]);

    checkType({ a: null }, { a: "null" });
    expect(() => checkType({ a: undefined }, { a: "null" })).checkFail();
  });
  test("undefined 字段和 字段不存在是有区别的", function () {
    checkType({ a: undefined }, { a: "undefined" });
    expect(() => checkType({}, { a: "undefined" })).checkFail();
  });
  test("默认情况下，如果存在多余的字段，则检测不通过, 可通过设置 policy 为 pass 改变这一行为", function () {
    const obj = { s: 3, i: "s", q: undefined };
    expect(() => checkTypeCopy(obj, { s: "number", i: "string" })).checkFailWithField(["q"]);
    expect(checkTypeCopy(obj, { s: "number", i: "string" }, { policy: "pass" })).toEqual({ s: 3, i: "s" });

    expect(() => checkType(obj, { s: "number", i: "string" })).checkFailWithField(["q"]);
  });

  test("默认情况下，检测第一个字段不通过就立即抛出异常, 可通过 checkAll 改变这一行为", function () {
    const obj = { s: 3, i: "s", q: undefined };
    const expectType = { s: "number", i: "string", q: "number", y: "number" } satisfies ExpectType;
    expect(() => checkType(obj, expectType, { checkAll: true })).checkFailWithField(["q", "y"]);
    expect(() => checkType(obj, expectType, { checkAll: false })).checkFailWithField(["q"]);
  });

  test("传入错误预期类型", function () {
    expect(() => checkType({ a: 3 }, { a: "D" } as any)).checkFailWithField(["a"]);
  });
});

describe("嵌套", function () {
  test("仅检测", function () {
    checkType({ s: 3, i: { q: "s", c: undefined } }, { s: "number", i: { q: "string", c: "undefined" } });
  });
  test("copy", function () {
    const createObj = () => {
      return { s: 3, i: { q: "s", y: null, c: undefined }, b: 6 };
    };
    const obj = createObj();
    const res = checkTypeCopy(obj, { s: "number", i: { q: "string", c: "undefined" } }, { policy: "pass" });
    expect(res).toEqual({ s: 3, i: { q: "s", c: undefined } });
    expect(obj).toEqual(createObj());
  });
});

test("联合类型", function () {
  checkType(null, ["string", "null"]);
  checkType({ s: 3, i: null }, { s: ["number", "string"], i: ["string", "null"] });

  expect(() => checkType(undefined, ["string", "null"])).checkFail();

  expect(() => checkType({ s: 3 }, { s: ["bigint", "string"] })).checkFailWithField(["s"]);
});
