import {
  ARRAY_BUFFER_PREFIX,
  FLOAT32_ARRAY_PREFIX,
  FLOAT64_ARRAY_PREFIX,
  INT16_ARRAY_PREFIX,
  INT32_ARRAY_PREFIX,
  INT8_ARRAY_PREFIX,
  UINT8_ARRAY_PREFIX,
  UINT8_CLAMPED_ARRAY_PREFIX,
  UINT16_ARRAY_PREFIX,
  UINT32_ARRAY_PREFIX,
} from '../constants';
import { InternalError } from '../errors';

const prefixMap = {
  [ARRAY_BUFFER_PREFIX]: (str: string) => decodeStringToBuffer(str),
  [FLOAT32_ARRAY_PREFIX]: (str: string) => new Float32Array(JSON.parse(str)),
  [FLOAT64_ARRAY_PREFIX]: (str: string) => new Float64Array(JSON.parse(str)),
  [INT8_ARRAY_PREFIX]: (str: string) => new Int8Array(JSON.parse(str)),
  [INT16_ARRAY_PREFIX]: (str: string) => new Int16Array(JSON.parse(str)),
  [INT32_ARRAY_PREFIX]: (str: string) => new Int32Array(JSON.parse(str)),
  [UINT8_ARRAY_PREFIX]: (str: string) => new Uint8Array(JSON.parse(str)),
  [UINT8_CLAMPED_ARRAY_PREFIX]: (str: string) => new Uint8ClampedArray(JSON.parse(str)),
  [UINT16_ARRAY_PREFIX]: (str: string) => new Uint16Array(JSON.parse(str)),
  [UINT32_ARRAY_PREFIX]: (str: string) => new Uint32Array(JSON.parse(str)),
};

export function deserialize(valueString: string): any {
  try {
    return JSON.parse(valueString);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (o_O) {
    for (const [prefix, handler] of Object.entries(prefixMap)) {
      if (valueString.startsWith(prefix)) {
        return handler(valueString.substring(prefix.length));
      }
    }
    throw new InternalError('Failed to deserialize value: ' + valueString);
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
