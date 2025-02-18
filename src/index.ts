import { idbDriver } from './drivers/idb';
import { localstorageDriver } from './drivers/localstorage';
import { INTERNAL_DRIVERS } from './constants';

class Storeage {
  private driversMap: [string, IDriver][] = [
    [INTERNAL_DRIVERS.IDB, idbDriver],
    [INTERNAL_DRIVERS.LOCALSTORAGE, localstorageDriver],
  ];
  private defaultDriversSequence = [INTERNAL_DRIVERS.IDB, INTERNAL_DRIVERS.LOCALSTORAGE];
  private configDriversSequence: string[] = [];
  private driverName: string | null = null;

  getDriver() {
    for (const driver of this.configDriversSequence) {
      const iDriver = this.driversMap.find(item => item[0] === driver);
      if (iDriver /** TODO 并且支持该驱动程序 */) {
        return iDriver[1];
      }
    }

    for (const driver of this.defaultDriversSequence) {
      const iDriver = this.driversMap.find(item => item[0] === driver);
      if (iDriver /** TODO 并且支持该驱动程序 */) {
        return iDriver[1];
      }
    }

    // 如果没有任何驱动程序支持，则使用 localstorage 驱动程序
    return localstorageDriver;
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

  getItem<T>(key: string): Promise<T>;
  getItem<T>(key: string, onSuccess: (value: T) => void): void;
  getItem<T>(key: string, onSuccess?: (value: T) => void): void | Promise<T> {
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
  setItem<T>(key: string, value: T, onSuccess: (value: T) => void): void;
  setItem<T>(key: string, value: T, onSuccess?: (value: T) => void): void | Promise<T> {
    const executor = async () => {
      await this.ready();
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.setItem<T>(key, value);
    };
    if (onSuccess) {
      executor().then(onSuccess);
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

  driver = () => {
    return this.driverName;
  };
}

const storeage = new Storeage();

export default storeage;
