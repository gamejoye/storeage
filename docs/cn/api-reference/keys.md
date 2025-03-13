# keys Api

## 描述

`keys` 方法返回存储中所有键的数组。

## 用法

```ts
import storeage from 'storeage';

// Promise 方式
const keys = await storeage.keys();
console.log(keys);

// 回调方式
storeage.keys(keys => {
  console.log(keys);
});
```

## 参数

- **onSuccess**: `(keys: string[]) => void` (可选)

> 当获取到键列表时将被调用的回调函数。如果提供了回调函数，该方法返回void而不是Promise。

## 返回值

- `Promise<string[]>` - 当未提供 `onSuccess` 回调时
- `void` - 当提供了 `onSuccess` 回调时
