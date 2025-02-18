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

  getItem: IDriver['getItem'] = (...args) => {
    return this.ready().then(() => {
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.getItem(...args);
    });
  };
  setItem: IDriver['setItem'] = (...args) => {
    return this.ready().then(() => {
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.setItem(...args);
    });
  };

  removeItem: IDriver['removeItem'] = (...args) => {
    return this.ready().then(() => {
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.removeItem(...args);
    });
  };

  clear: IDriver['clear'] = (...args) => {
    return this.ready().then(() => {
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.clear(...args);
    });
  };

  ready: IDriver['ready'] = (...args) => {
    const driver = this.getDriver();
    return driver.ready(...args).then(val => {
      this.driverName = driver.driverName;
      return val;
    });
  };

  length: IDriver['length'] = (...args) => {
    return this.ready().then(() => {
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.length(...args);
    });
  };

  keys: IDriver['keys'] = (...args) => {
    return this.ready().then(() => {
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.keys(...args);
    });
  };

  iterate: IDriver['iterate'] = (...args) => {
    return this.ready().then(() => {
      const driver = this.getDriver();
      this.driverName = driver.driverName;
      return driver.iterate(...args);
    });
  };

  driver = () => {
    return this.driverName;
  };
}

const storeage = new Storeage();

export default storeage;
