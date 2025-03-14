# config Api

## 描述

`config` 方法用于配置 storeage 仓库。
该方法应该在调用 “数据相关” API之前被调用（不调用则使用默认配置）

- [`setItem`](/cn/api-reference/set-item.md)
- [`getItem`](/cn/api-reference/get-item.md)
- [`removeItem`](/cn/api-reference/remove-item.md)
- [`clear`](/cn/api-reference/clear.md)
- [`length`](/cn/api-reference/length.md)
- [`keys`](/cn/api-reference/keys.md)
- [`iterate`](/cn/api-reference/iterate.md)

## 用法

```ts
import storeage, { INTERNAL_DRIVERS } from 'storeage';

storeage.config({ driver: [INTERNAL_DRIVERS.LOCALSTORAGE] });
```

## 参数

- **options**: `{ name?: string, storeName?: string, driver?: string[], expirationTime?: number }` (可选)
  - **name**: `string` (可选)
    > 存储数据库的名称
  - **storeName**: `string` (可选)
    > 存储的名称
  - **driver**: `string[]` (可选)
    > 期望的驱动序列
  - **expirationTime**: `number` (可选)
    > 存储的过期时间

> 配置 storeage 的参数

## 返回值

- `void`
