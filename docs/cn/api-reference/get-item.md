# getItem API

## 描述

`getItem` 方法用于从存储中检索项目。支持泛型，为检索到的数据提供类型安全。

## 用法

```ts
import storeage from 'storeage';

// Promise
const item = await storeage.getItem<string>('key');

// Callback
storeage.getItem<string>('key', item => {
  console.log(item);
});
```

## 参数

- **key**: `string`

  > 要检索的项目的键名

- **onSuccess**: `(item: T | null) => void` (可选)

  > 可选的回调函数，将在操作完成时调用，参数为检索到的值或 `null`

## 返回值

- `Promise<T | null>` - 当未提供 `onSuccess` 时
- `void` - 当提供了 `onSuccess` 时

其中“T”是表示存储项类型的泛型类型参数。
