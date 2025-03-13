# createInstance Api

## 描述

`createInstance` 方法用户创建一个 storeage 实例

## 用法

```ts
import storeage, { INTERNAL_DRIVERS } from 'storeage';

const instance = storeage.createInstance({
  storeName: 'my-store',
  driver: [INTERNAL_DRIVERS.LOCALSTORAGE],
});
```

## 参数

- **options**: `{ name?: string, storeName?: string, driver?: string[] }` (可选)

> 配置storeage的参数

## 返回值

- `typeof storeage`
