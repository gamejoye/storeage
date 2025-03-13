---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Storeage'
  text: '一个提供离线存储的JavaScript库'
  actions:
    - theme: brand
      text: 什么是storeage?
      link: /cn/introduction/what-is-storeage
    - theme: alt
      text: 快速开始
      link: /cn/introduction/quick-start
    - theme: alt
      text: API指南
      link: /cn/api-reference/get-item

features:
  - title: 支持多种类型
    details: 您可以存储各种数据类型，包括bigint、blob、arraybuffer、typedarray、object、array等。
  - title: Promise / Callback 风格 API
    details: API 支持 Promise / 回调函数风格，您可以根据需要选择使用方式。
  - title: 支持设置数据过期时间
    details: 您可以为存储的数据设置过期时间，无需担心数据过期问题。
  - title: 支持多实例
    details: 您可以创建多个实例，每个实例可以有自己的存储后端和配置。
---
