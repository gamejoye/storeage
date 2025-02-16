export function deserialize(valueString: string): any {
  if (valueString === null) return null;
  const { type, value } = JSON.parse(valueString);
  if (type === 'Number') {
    return +value;
  }
  return value;
}
