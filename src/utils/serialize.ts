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

import { ARRAY_BUFFER_PREFIX } from '../constants';

export function serialize(value: any): string {
  if (value === undefined) value = null;
  const type = Object.prototype.toString.call(value);
  if (type === '[object ArrayBuffer]') {
    return ARRAY_BUFFER_PREFIX + bufferToString(value);
  } else if (type === '[object Float32Array]') {
    // TODO
    return '';
  } else if (type === '[object Float64Array]') {
    // TODO
    return '';
  } else if (type === '[object Int8Array]') {
    // TODO
    return '';
  } else if (type === '[object Int16Array]') {
    // TODO
    return '';
  } else if (type === '[object Int32Array]') {
    // TODO
    return '';
  } else if (type === '[object Uint8Array]') {
    // TODO
    return '';
  } else if (type === '[object Uint8ClampedArray]') {
    // TODO
    return '';
  } else if (type === '[object Uint16Array]') {
    // TODO
    return '';
  } else if (type === '[object Uint32Array]') {
    // TODO
    return '';
  } else if (type === '[object Blob]') {
    // TODO
    return '';
  } else {
    return JSON.stringify(value);
  }
}

function bufferToString(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(byte => String.fromCharCode(byte))
    .join('');
}
