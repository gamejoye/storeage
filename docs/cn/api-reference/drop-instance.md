# dropInstance Api

## 描述

`dropInstance` 方法用于删除一个 storeage 实例

## 用法

```ts
import storeage from 'storeage';

const instance = storeage.createInstance();

await instance.dropInstance();

instance.getItem('key'); // 抛出错误
```

## 参数

- **options**: `{ name?: string, storeName?: string }` (可选)

> 对应删除的实例的属性

> 如果没有提供，当前实例将被删除 ✅

> 如果提供了`name`和`storeName`，对应该`name`和`storeName`的store实例将被删除 ✅

> 如果只提供了`name`，什么都不会发生 ⚠️

> 如果只提供了`storeName`，将抛出错误 ❌

## 返回值

- `Promise<void>`
