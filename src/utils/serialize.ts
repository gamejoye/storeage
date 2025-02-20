//   | 'Object'
//   | 'Array'
//   | 'ArrayBuffer'
//   | 'Blob'
//   | 'Float32Array'
//   | 'Float64Array'
//   | 'Int8Array'
//   | 'Int16Array'
//   | 'Int32Array'
//   | 'Uint8Array'
//   | 'Uint8ClampedArray'
//   | 'Uint16Array'
//   | 'Uint32Array';

import {
  ARRAY_BUFFER_PREFIX,
  FLOAT32_ARRAY_PREFIX,
  FLOAT64_ARRAY_PREFIX,
  INT8_ARRAY_PREFIX,
  INT16_ARRAY_PREFIX,
  INT32_ARRAY_PREFIX,
  UINT8_ARRAY_PREFIX,
  UINT8_CLAMPED_ARRAY_PREFIX,
  UINT16_ARRAY_PREFIX,
  UINT32_ARRAY_PREFIX,
} from '../constants';

const prefixMap = {
  '[object Float32Array]': FLOAT32_ARRAY_PREFIX,
  '[object Float64Array]': FLOAT64_ARRAY_PREFIX,
  '[object Int8Array]': INT8_ARRAY_PREFIX,
  '[object Int16Array]': INT16_ARRAY_PREFIX,
  '[object Int32Array]': INT32_ARRAY_PREFIX,
  '[object Uint8Array]': UINT8_ARRAY_PREFIX,
  '[object Uint8ClampedArray]': UINT8_CLAMPED_ARRAY_PREFIX,
  '[object Uint16Array]': UINT16_ARRAY_PREFIX,
  '[object Uint32Array]': UINT32_ARRAY_PREFIX,
};

export function serialize(value: any): string {
  if (value === undefined) value = null;
  let prefix = '';
  const type = Object.prototype.toString.call(value);
  if (type === '[object ArrayBuffer]') {
    return ARRAY_BUFFER_PREFIX + bufferToString(value);
  } else if (type === '[object Blob]') {
    // TODO
    return '';
  } else {
    prefix = prefixMap[type as keyof typeof prefixMap] ?? '';
  }
  if (prefix) {
    return prefix + JSON.stringify(Array.from(value));
  }
  return JSON.stringify(value);
}

function bufferToString(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(byte => String.fromCharCode(byte))
    .join('');
}
