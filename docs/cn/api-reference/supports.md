# supports Api

## 描述

`supports` 方法用于检查存储是否支持特定的驱动。

## 用法

```ts
import storeage, { INTERNAL_DRIVERS } from 'storeage';
const isSupported = storeage.supports(INTERNAL_DRIVERS.LOCALSTORAGE);
console.log(isSupported);
```

## 参数

- **driverName**: `string`

> 要检查的驱动名称。如果检索的驱动是自定义驱动则driverName应该是defineDriver方法的第一个参数

## 返回值

- `boolean`
