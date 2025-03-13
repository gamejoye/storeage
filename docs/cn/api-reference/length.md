# length Api

## 描述

`length` 方法返回存储中项目的数量。

## 用法

```ts
import storeage from 'storeage';

// Promise 方式
const length = await storeage.length();
console.log(length);

// 回调方式
storeage.length(length => {
  console.log(length);
});
```

## 参数

- **onSuccess**: `(length: number) => void` (可选)

> 当获取到长度时将被调用的回调函数。如果提供了回调函数，该方法返回void而不是Promise。

## 返回值

- `Promise<number>` - 当未提供 `onSuccess` 回调时
- `void` - 当提供了 `onSuccess` 回调时
