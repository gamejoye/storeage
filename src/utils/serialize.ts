export function serialize(value: any): string {
  const type = Object.prototype.toString.call(value);
  let valueType: StoreageItemType | null = null;
  if (type === '[object Number]') {
    valueType = 'Number';
  } else if (type === '[object String]') {
    valueType = 'String';
  } else if (type === '[object Object]') {
    valueType = 'Object';
  } else if (type === '[object Array]') {
    valueType = 'Array';
  }

  return JSON.stringify({
    type: valueType,
    value,
  });
}
