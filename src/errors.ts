/** 创建一个类型错误的描述
 * @public
 */
export function createTypeErrorDesc(expect: string, actual: string): string {
  return `预期: ${expect}, 实际: ${actual}`;
  //return `Expect: ${expect}, actual: ${actual}`;
}
