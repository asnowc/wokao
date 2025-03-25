import { checkType, checkTypeCopy, ExpectType } from "@asla/wokao";

const item = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
};
const expectType = {
  a: "number",
  b: "number",
  c: "number",
  d: "number",
} satisfies ExpectType;

Deno.bench("checkType", function () {
  checkType(item, expectType);
});
Deno.bench("checkTypeCopy", function () {
  checkTypeCopy(item, expectType);
});
