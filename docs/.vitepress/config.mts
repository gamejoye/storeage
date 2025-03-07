import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Storeage",
  description: "A Javascript Library provides a High-performance Offline Storage with localStorage-like API",
  themeConfig: {
    nav: [],
    
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is storeage?', link: '/introduction/what-is-storeage' },
          { text: 'Quick Start', link: '/introduction/quick-start' },
          { text: 'Supported Data Types', link: '/introduction/supported-data-types' },
        ]
      },
      {
        text: 'Api Reference',
        link: '/api-reference',
        items: [
          { text: 'getItem', link: '/api-reference/get-item' },
          { text: 'setItem', link: '/api-reference/set-item' },
          { text: 'removeItem', link: '/api-reference/remove-item' },
          { text: 'clear', link: '/api-reference/clear' },
          { text: 'length', link: '/api-reference/length' },
          { text: 'keys', link: '/api-reference/keys' },
          { text: 'iterate', link: '/api-reference/iterate' },
          { text: 'ready', link: '/api-reference/ready' },
          { text: 'driver', link: '/api-reference/driver' },
          { text: 'supports', link: '/api-reference/supports' },
          { text: 'config', link: '/api-reference/config' },
          { text: 'defineDriver', link: '/api-reference/define-driver' },
          { text: 'createInstance', link: '/api-reference/create-instance' },
          { text: 'dropInstance', link: '/api-reference/drop-instance' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gamejoye/storeage' }
    ]
  }
})
