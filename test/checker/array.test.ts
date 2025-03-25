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
test("数组长度限制(checkType)", function () {
  const input = [2, 4, 56, 78];
  const expectType = array("number", { maxLen: 3 });
  expect(checkType(input, expectType, { policy: "pass" })).toBe(input);

  expect(() => checkType([2, 4, 56, 78], expectType)).checkFailWithField(["length"]);

  expect(() => checkType([2, 4, "d", 78], expectType, { checkAll: true })).checkFailWithField(["2", "length"]);
});
test("数组长度限制(copyCheckType)", function () {
  const input = [2, 4, 56, 78];
  const expectType = array("number", { maxLen: 3 });
  const c1 = checkTypeCopy(input, expectType, { policy: "pass" });
  expect(c1).toHaveLength(3);
  expect(c1).toEqual([2, 4, 56]);
  expect(c1).not.toBe(input);
});

test("数组替换", function () {
  const value = checkTypeCopy([10, 20], array((val: any) => val / 2));
  expect(value, "值已被替换成").toEqual([5, 10]);
});
