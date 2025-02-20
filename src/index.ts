import IDBDriver from './drivers/idb';
import LocalStorageDriver from './drivers/localstorage';
import { DEFAULT_CONFIG, INTERNAL_DRIVERS } from './constants';

class Storeage {
  private driversMap: [string, IDriver][];
  private defaultDriversSequence = [INTERNAL_DRIVERS.IDB, INTERNAL_DRIVERS.LOCALSTORAGE];
  private configDriversSequence: string[] = [];
  private driverName: string | null = null;

  constructor() {
    this.driversMap = [
      [INTERNAL_DRIVERS.IDB, new IDBDriver()],
      [INTERNAL_DRIVERS.LOCALSTORAGE, new LocalStorageDriver()],
    ];
  }

  getDriver() {
    for (const driver of this.configDriversSequence) {
      const iDriver = this.driversMap.find(item => item[0] === driver);
      if (iDriver && iDriver[1].supports()) {
        return iDriver[1];
      }
    }

    for (const driver of this.defaultDriversSequence) {
      const iDriver = this.driversMap.find(item => item[0] === driver);
      if (iDriver && iDriver[1].supports()) {
        return iDriver[1];
      }
    }

    throw new Error('No driver supported');
  }

  findDriver(driverName: string) {
    return this.driversMap.find(item => item[0] === driverName)?.[1];
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

  createInstance(config: ConfigOptions = {}): Storeage {
    config = { ...DEFAULT_CONFIG, ...config };
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

    console.warn('dropInstance config error', config);
    return Promise.reject(new Error('dropInstance config error'));
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
