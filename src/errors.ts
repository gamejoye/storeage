export class UnsupportedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedError';
  }
}

export class DroppedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DroppedError';
  }
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export class UnsupportedTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedTypeError';
  }
}

export class InternalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InternalError';
  }
}
