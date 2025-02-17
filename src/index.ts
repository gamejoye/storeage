import { idbDriver } from './drivers/idb';
import { localstorageDriver } from './drivers/localstorage';
import { INTERNAL_DRIVERS } from './constants';

const driversMap: [string, IDriver][] = [
  [INTERNAL_DRIVERS.IDB, idbDriver],
  [INTERNAL_DRIVERS.LOCALSTORAGE, localstorageDriver],
];

const defaultDriversSequence = [INTERNAL_DRIVERS.IDB, INTERNAL_DRIVERS.LOCALSTORAGE];
let configDriversSequence: string[] = [];

const getDriver = () => {
  for (const driver of configDriversSequence) {
    const iDriver = driversMap.find(item => item[0] === driver);
    if (iDriver /** TODO 并且支持该驱动程序 */) {
      return iDriver[1];
    }
  }

  for (const driver of defaultDriversSequence) {
    const iDriver = driversMap.find(item => item[0] === driver);
    if (iDriver /** TODO 并且支持该驱动程序 */) {
      return iDriver[1];
    }
  }

  // 如果没有任何驱动程序支持，则使用 localstorage 驱动程序
  return localstorageDriver;
};

const config: IDriver['config'] = (options: ConfigOptions = {}) => {
  if (options.driver) {
    configDriversSequence = options.driver;
  }
  options = {
    ...options,
    driver: configDriversSequence.length ? configDriversSequence : defaultDriversSequence,
  };
  return getDriver().config(options);
};

const getItem: IDriver['getItem'] = (...args) => {
  return getDriver().getItem(...args);
};
const setItem: IDriver['setItem'] = (...args) => {
  const idriver = getDriver();
  return idriver.setItem(...args);
};
const removeItem: IDriver['removeItem'] = (...args) => {
  return getDriver().removeItem(...args);
};
const clear: IDriver['clear'] = (...args) => {
  return getDriver().clear(...args);
};

const ready: IDriver['clear'] = (...args) => {
  return getDriver().ready(...args);
};

export default {
  config,
  getItem,
  setItem,
  removeItem,
  clear,
  ready,
};
