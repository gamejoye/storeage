# 介绍

> 如果只想了解如何使用 Storeage，可以直接阅读[快速入门](/cn/introduction/quick-start)页面。

## Storeage 是什么？

Storeage 是一个轻量级、零依赖、易用的现代 Web 应用存储库，提供以下特性：

- **简洁直观的 API** - 类 localStorage 的操作体验
- **多存储后端支持** - 支持配置存储后端 IndexedDB / LocalStorage
- **类型安全存储** - 支持存储复杂数据类型，无需手动处理序列化
- **数据生命周期管理** - 内置过期时间设置功能

## 与 localForage 的关系

Storeage 的 API 设计灵感来源于 localForage，但并非其 localForage

## 核心差异对比

- 🕒 **有效期支持** - 可为存储数据设置过期时间
- 🧩 **扩展数据类型** - 支持存储更多复杂类型 [查看详情](/cn/introduction/supported-data-types)
- 🚫 **不兼容 WebSQL** - 专注于现代存储方案
