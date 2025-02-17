export function deserialize(valueString: string): any {
  // TODO 处理 ArrayBuffer, Int8Array 等类型
  return JSON.parse(valueString);
}
