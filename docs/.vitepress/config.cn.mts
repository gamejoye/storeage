import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Storeage",
  description: "一款提供了一个高性能的离线存储与localstorage类似的API的Javascript库",
  themeConfig: {    
    sidebar: [
      {
        text: '介绍',
        items: [
          { text: '什么是storeage?', link: '/cn/introduction/what-is-storeage' },
          { text: '快速开始', link: '/cn/introduction/quick-start' },
          { text: '支持的数据类型', link: '/cn/introduction/supported-data-types' },
        ],
      },
      {
        text: 'API 指南',
        items: [
          { text: 'getItem', link: '/cn/api-reference/get-item' },
          { text: 'setItem', link: '/cn/api-reference/set-item' },
          { text: 'removeItem', link: '/cn/api-reference/remove-item' },
          { text: 'clear', link: '/cn/api-reference/clear' },
          { text: 'length', link: '/cn/api-reference/length' },
          { text: 'keys', link: '/cn/api-reference/keys' },
          { text: 'iterate', link: '/cn/api-reference/iterate' },
          { text: 'ready', link: '/cn/api-reference/ready' },
          { text: 'driver', link: '/cn/api-reference/driver' },
          { text: 'supports', link: '/cn/api-reference/supports' },
          { text: 'config', link: '/cn/api-reference/config' },
          { text: 'defineDriver', link: '/cn/api-reference/define-driver' },
          { text: 'createInstance', link: '/cn/api-reference/create-instance' },
          { text: 'dropInstance', link: '/cn/api-reference/drop-instance' },
        ]
      },
    ]
  }
})
