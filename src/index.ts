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
    const result = this.getDriver().config(options);
    this.getDriver()
      .ready()
      .then(() => {
        this.driverName = this.getDriver().driverName;
      });
    return result;
  };

  getItem: IDriver['getItem'] = (...args) => {
    return this.getDriver().getItem(...args);
  };
  setItem: IDriver['setItem'] = (...args) => {
    return this.getDriver().setItem(...args);
  };

  removeItem: IDriver['removeItem'] = (...args) => {
    return this.getDriver().removeItem(...args);
  };

  clear: IDriver['clear'] = (...args) => {
    return this.getDriver().clear(...args);
  };

  ready: IDriver['ready'] = (...args) => {
    return this.getDriver().ready(...args);
  };

  length: IDriver['length'] = (...args) => {
    return this.getDriver().length(...args);
  };

  keys: IDriver['keys'] = (...args) => {
    return this.getDriver().keys(...args);
  };

  driver = () => {
    return this.driverName;
  };
}

const storeage = new Storeage();

export default storeage;
