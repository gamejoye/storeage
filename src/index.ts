import IDBDriver from './drivers/idb';
import LocalStorageDriver from './drivers/localstorage';
import { INTERNAL_DRIVERS } from './constants';
import { ConfigError, UnsupportedError } from './errors';
import { ConfigOptions, DropInstanceOptions, IDriver } from './interface';

class Storeage {
  private driversMap: Map<string, IDriver> = new Map();
  private defaultDriversSequence = [INTERNAL_DRIVERS.IDB, INTERNAL_DRIVERS.LOCALSTORAGE];
  private configDriversSequence: string[] = [];
  private driverName: string | null = null;

  constructor() {
    this.driversMap.set(INTERNAL_DRIVERS.IDB, new IDBDriver());
    this.driversMap.set(INTERNAL_DRIVERS.LOCALSTORAGE, new LocalStorageDriver());
  }

  private getDriver() {
    for (const driver of this.configDriversSequence) {
      const iDriver = this.driversMap.get(driver);
      if (iDriver && iDriver.supports()) {
        return iDriver;
      }
    }

    for (const driver of this.defaultDriversSequence) {
      const iDriver = this.driversMap.get(driver);
      if (iDriver && iDriver.supports()) {
        return iDriver;
      }
    }

    throw new UnsupportedError('No driver supported');
  }

  private findDriver(driverName: string) {
    return this.driversMap.get(driverName);
  }

  defineDriver(driverName: string, driver: IDriver) {
    if (this.driversMap.has(driverName)) {
      throw new ConfigError(`Driver ${driverName} already defined`);
    }
    this.driversMap.set(driverName, driver);
  }

  config: IDriver['config'] = (options: ConfigOptions) => {
    if (options.driver) {
      this.configDriversSequence = options.driver;
    }
    options = {
      ...options,
      driver: this.configDriversSequence.length
        ? this.configDriversSequence
        : this.defaultDriversSequence,
    };
    return this.getDriver().config(options);
  };

  getItem<T>(key: string): Promise<T | null>;
  getItem<T>(key: string, onSuccess: (value: T | null) => void): void;
  getItem<T>(key: string, onSuccess?: (value: T | null) => void): void | Promise<T | null> {
    const executor = async () => {
      await this.ready();
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.getItem<T>(key);
    };
    if (onSuccess) {
      executor().then(onSuccess);
      return;
    }
    return executor();
  }

  setItem<T>(key: string, value: T): Promise<T>;
  setItem<T>(key: string, value: T, expirationTime: number): Promise<T>;
  setItem<T>(key: string, value: T, onSuccess: (value: T) => void): void;
  setItem<T>(key: string, value: T, expirationTime: number, onSuccess: (value: T) => void): void;
  setItem<T>(
    key: string,
    value: T,
    expirationOrCallback?: number | ((value: T) => void),
    onSuccess?: (value: T) => void
  ): void | Promise<T> {
    let expirationTime: number | undefined;
    let callback: ((value: T) => void) | undefined;

    if (typeof expirationOrCallback === 'number') {
      expirationTime = expirationOrCallback;
      callback = onSuccess;
    } else if (typeof expirationOrCallback === 'function') {
      callback = expirationOrCallback;
    }
    const executor = async () => {
      await this.ready();
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.setItem<T>(key, value, expirationTime);
    };
    if (callback) {
      executor().then(callback);
      return;
    }
    return executor();
  }

  removeItem(key: string): Promise<void>;
  removeItem(key: string, onSuccess: () => void): void;
  removeItem(key: string, onSuccess?: () => void): void | Promise<void> {
    const executor = async () => {
      await this.ready();
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.removeItem(key);
    };
    if (onSuccess) {
      executor().then(onSuccess);
      return;
    }
    return executor();
  }

  clear(): Promise<void>;
  clear(onSuccess: () => void): void;
  clear(onSuccess?: () => void): void | Promise<void> {
    const executor = async () => {
      await this.ready();
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.clear();
    };
    if (onSuccess) {
      executor().then(onSuccess);
      return;
    }
    return executor();
  }

  async ready() {
    const driver = this.getDriver();
    await driver.ready();
    this.driverName = driver.driverName;
  }

  length(): Promise<number>;
  length(onSuccess: (length: number) => void): void;
  length(onSuccess?: (length: number) => void): void | Promise<number> {
    const executor = async () => {
      await this.ready();
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.length();
    };
    if (onSuccess) {
      executor().then(onSuccess);
      return;
    }
    return executor();
  }

  keys(): Promise<string[]>;
  keys(onSuccess: (keys: string[]) => void): void;
  keys(onSuccess?: (keys: string[]) => void): void | Promise<string[]> {
    const executor = async () => {
      await this.ready();
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.keys();
    };
    if (onSuccess) {
      executor().then(onSuccess);
      return;
    }
    return executor();
  }

  iterate<T, U>(callback: (key: string, value: T, index: number) => U): Promise<U | void>;
  iterate<T, U>(
    callback: (key: string, value: T, index: number) => U | void,
    onSuccess: (result: U | void) => void
  ): void;
  iterate<T, U>(
    callback: (key: string, value: T, index: number) => U | void,
    onSuccess?: (result: U | void) => void
  ): void | Promise<U | void> {
    const executor = async () => {
      await this.ready();
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.iterate<T, U>(callback);
    };
    if (onSuccess) {
      executor().then(onSuccess);
      return;
    }
    return executor();
  }

  createInstance(config: ConfigOptions = {}): Storeage {
    const instance = new Storeage();
    instance.config(config);
    return instance;
  }

  dropInstance(config?: DropInstanceOptions): Promise<void> {
    if (!config) {
      // 如果没有传入config，则删除当前实例的name/storeName
      return this.getDriver().drop();
    }

    if (config.name && config.storeName) {
      const instance = this.createInstance({
        name: config.name,
        storeName: config.storeName,
      });
      return instance.dropInstance();
    }

    if (config.name && !config.storeName) {
      // TODO
      // 删除整个name下的所有storeName
    }
    return Promise.reject(new ConfigError('dropInstance config error: config.name is required'));
  }

  supports(driverName: string) {
    const driver = this.findDriver(driverName);
    if (!driver) return false;
    return driver.supports();
  }

  driver = () => {
    return this.driverName;
  };
}

const storeage = new Storeage();

export default storeage;
export { INTERNAL_DRIVERS } from './constants';

export type { ConfigOptions, DropInstanceOptions, IDriver } from './interface';
