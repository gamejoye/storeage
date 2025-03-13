# 快速入门

## 安装

```bash
npm install storeage
```

## 使用

```ts
import storeage from 'storeage';

// 存储复杂数据（2秒后过期）
await storage.setItem(
  'userProfile',
  {
    id: BigInt(991234567890123456),
    avatar: new Blob([
      /* 二进制数据 */
    ]),
    loginTime: new Date(),
  },
  2000
);

// 获取数据（自动反序列化）
const profile = await storage.getItem('userProfile');
console.log(profile);
```

## 示例

- [离线待办列表基础用法](https://github.com/gamejoye/storeage-demo-react)
