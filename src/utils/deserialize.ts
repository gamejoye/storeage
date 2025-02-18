import { ARRAY_BUFFER_PREFIX } from '../constants';

export function deserialize(valueString: string): any {
  // TODO 处理 ArrayBuffer, Int8Array 等类型
  try {
    return JSON.parse(valueString);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (o_O) {
    if (valueString.startsWith(ARRAY_BUFFER_PREFIX)) {
      return decodeStringToBuffer(valueString.substring(ARRAY_BUFFER_PREFIX.length));
    }
    console.warn('Storage internal error: Failed to deserialize value', valueString);
    return '';
  }
}

function decodeStringToBuffer(str: string): ArrayBuffer {
  if ('TextDecoder' in window) {
    const textEncoder = new TextEncoder();
    return textEncoder.encode(str).buffer as ArrayBuffer;
  }
  const uint8Array = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    uint8Array[i] = str.charCodeAt(i);
  }
  return uint8Array.buffer;
}
