import { expect, test } from "vitest";
import { array, checkType, checkTypeCopy } from "@asla/wokao";
import "../assests/type_check.assert.ts";

test("数组array检测", function () {
  checkType([2, 4, 56, 78], array.number); // "number 数组"
  expect(() => checkType([2, 4, "d", 78], array.number)).checkFailWithField(["2"]);
  expect(() => checkType("123", array.number), "传入非数组").checkFail();
});
test("嵌套", function () {
  checkType([{ a: 1 }, { a: 2 }, { a: 3 }], array({ a: "number" }));
  expect(() => checkType([{ a: 1 }, { a: "str" }, { a: 3 }], array({ a: "number" }))).checkFailWithField(["1"]);
  expect(() => checkType([{ a: 1 }, {}, { a: 3 }], array({ a: "number" }))).checkFailWithField(["1"]);
});
test("最小最大同时限制", function () {
  const expectType = array("number", { minLen: 2, maxLen: 3 });
  expect(checkType([2, 4, 56, 78], expectType, { policy: "pass" })).toEqual([2, 4, 56, 78]);
  expect(checkTypeCopy([2, 4, 56, 78], expectType, { policy: "pass" })).toEqual([2, 4, 56]);

  expect(() => checkType([2, 4, 56, 78], expectType)).checkFailWithField(["length"]);
  expect(() => checkTypeCopy([2, 4, 56, 78], expectType)).checkFailWithField(["length"]);

  expect(() => checkType([2], expectType)).checkFailWithField(["length"]);
  expect(() => checkType([2, 4, "d", 78], expectType, { checkAll: true })).checkFailWithField(["length"]);
});
test("出错后继续检测", function () {
  const arr = [1, 2, "3", 4, "5"];
  expect(() => checkType(arr, array.number)).checkFailWithField(["2"]);
  expect(() => checkType(arr, array.number, { checkAll: true })).checkFailWithField(["2", "4"]);
});

test("超过最大长度", function () {
  const expectType = array("number", { maxLen: 3 });
  expect(() => checkType([2, 4, 56, 78], expectType)).checkFail();
  expect(() => checkTypeCopy([2, 4, 56, 78], expectType)).checkFail();

  expect(checkType([2, 4, 56, 78], expectType, { policy: "pass" })).toEqual([2, 4, 56, 78]);
  expect(checkTypeCopy([2, 4, 56, 78], expectType, { policy: "pass" })).toEqual([2, 4, 56]);
});
test("不足最小长度", function () {
  const expectType = array("number", { minLen: 3 });
  expect(() => checkType([2, 4], expectType)).checkFail();
  expect(() => checkTypeCopy([2, 4], expectType)).checkFail();

  expect(() => checkType([2, 4], expectType, { policy: "pass" })).checkFail();
  expect(() => checkTypeCopy([2, 4], expectType, { policy: "pass" })).checkFail();
});

test("数组替换", function () {
  const expectType = array((val: any) => val / 2);
  expect(checkTypeCopy([10, 20], expectType), "值已被替换成").toEqual([5, 10]);
  expect(checkType([10, 20], expectType), "值已被替换成").toEqual([5, 10]);
});
