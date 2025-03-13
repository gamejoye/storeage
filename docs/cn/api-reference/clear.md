# clear Api

## 描述

`clear` 方法用于从存储中删除所有项目。

## 用法

```ts
import storeage from 'storeage';

// Promise 方式
await storeage.clear();

// 回调方式
storeage.clear(() => {
  console.log('所有项目已成功删除');
});
```

## 参数

- **onSuccess**: `() => void` (可选)

> 当所有项目被删除时将被调用的回调函数。如果提供了回调函数，该方法返回void而不是Promise。

## 返回值

- `Promise<void>` - 当未提供 `onSuccess` 回调时
- `void` - 当提供了 `onSuccess` 回调时
