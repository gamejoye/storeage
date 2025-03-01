import { InternalError } from '../errors';
import { deserialize, serialize } from '../utils';

export const EXPIRATION_TAG = '|||';
export const PERMANENT_TAG = 'P';

export type ExpirationItemJSON<T> = {
  value: T;
  expirtiedAt: string;
};

export class ExpirationItem<T = any> {
  private readonly _value: T;
  private readonly _expirtiedAt: string;

  constructor(value: T, expiration: string | number = PERMANENT_TAG) {
    this._value = value;
    if (typeof expiration === 'number') {
      if (expiration <= 0) {
        throw new InternalError('Invalid expiration: ' + expiration);
      }
      expiration = this.getUTCTime() + expiration + '';
    }
    if (
      typeof expiration === 'string' &&
      expiration !== PERMANENT_TAG &&
      Number.isNaN(+expiration)
    ) {
      throw new InternalError('Invalid expiration: ' + expiration);
    }
    this._expirtiedAt = expiration;
  }

  get value() {
    if (this.isExpired()) {
      return null;
    }
    return this._value;
  }

  toJSON(): ExpirationItemJSON<T> {
    return {
      value: this._value,
      expirtiedAt: this._expirtiedAt,
    };
  }

  async toString(): Promise<string> {
    return (
      (this._expirtiedAt === PERMANENT_TAG ? PERMANENT_TAG : this._expirtiedAt) +
      EXPIRATION_TAG +
      (await serialize(this._value))
    );
  }

  static fromString<T = any>(str: string): ExpirationItem<T> {
    const index = str.indexOf(EXPIRATION_TAG);
    if (index === -1) {
      throw new InternalError('Failed to deserialize value: ' + str);
    }
    const expirationTime = str.substring(0, index);
    const value = str.substring(index + EXPIRATION_TAG.length);
    return new ExpirationItem(deserialize(value), expirationTime);
  }

  static fromJSON<T>(json: ExpirationItemJSON<T>): ExpirationItem<T> {
    return new ExpirationItem(json.value, json.expirtiedAt);
  }

  isExpired() {
    if (this._expirtiedAt === PERMANENT_TAG) {
      return false;
    }
    return this.getUTCTime() >= parseInt(this._expirtiedAt);
  }

  getUTCTime(): number {
    const date = new Date();
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
    return utcTime;
  }
}
