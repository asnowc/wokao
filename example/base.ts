import { checkType, checkTypeCopy, CheckTypeError, ExpectType, InferExpect, optional } from "@asla/wokao";

checkType(null, "null");
checkType(2, "number");
checkType({}, "object");

try {
  checkType(null, "object"); // null 不是 object
} catch (e) {
  if (e instanceof CheckTypeError) {
    //...
  }
}

const expectObject = {
  name: "string",
  age: "number",
  phone: "string",
  info: optional({
    address: "string",
  }),
  site: (input) => {
    if (typeof input !== "string") throw new CheckTypeError("string", typeof input);
    return new URL(input);
  },
} satisfies ExpectType;

/*
{
    name: string;
    age: number;
    phone: string;
    info: {  address: string;  } | undefined;
    site: URL;
}
*/
type ExpectObject = InferExpect<typeof expectObject>;
const value = checkTypeCopy({ name: "123", age: 12 }, "object");
console.log(value);
