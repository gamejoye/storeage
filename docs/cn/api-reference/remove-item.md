# removeItem API

## 描述

`removeItem` 方法用于从存储中删除一个项目。它会删除与指定键关联的项目。

## 用法

```ts
import storeage from 'storeage';

// Promise 方式
await storeage.removeItem('user');

// 回调方式
storage.removeItem('user', () => {
  console.log('用户已成功删除');
});
```

## 参数

- **key**: `string`

> 要删除的项目的键名。

- **onSuccess**: `() => void` (可选)

> 项目成功删除时将被调用的回调函数。如果提供了回调函数，该方法返回void而不是Promise。

## 返回值

- `Promise<void>` - 当未提供 `onSuccess` 回调时
- `void` - 当提供了 `onSuccess` 回调时
