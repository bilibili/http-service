import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "HTTP Service",
  base: process.env.NODE_ENV === 'dev' ? '' : '/bili-utils/unify-http-request/',
  description: "统一请求库站点",
  themeConfig: {
    nav: [
      { text: 'Github', link: 'https://github.com/bilibili/http-service' }
    ],
    sidebar: {
      '/': [
        {
          text: '介绍',
          link: '/intro/what-is',
          items: [
            { text: '什么是请求库', link: '/intro/what-is' },
            { text: '框架设计', link: '/intro/framework' },
            { text: '中间件', link: '/intro/middleware' },
          ]
        },
        {
          text: '开始上手',
          link: '/guide/getting-started',
          items: [
            { text: '起步', link: '/guide/getting-started' },
            { text: '基础案例', link: '/guide/examples' },
            {
              text: '进阶',
              link: '/guide/advance/intro',
              collapsed: true,
              items: [
                { text: '放弃请求', link: '/guide/advance/abort-request' },
                { text: '获得响应对象', link: '/guide/advance/get-response' },
                { text: '修改响应数据解析方式', link: '/guide/advance/modify-res-data' },
                { text: '设置响应数据解析类型', link: '/guide/advance/response-type' },
                { text: '设置自定义响应返回', link: '/guide/advance/return-res-data' },
                { text: '设置默认请求头', link: '/guide/advance/set-default-headers' },
                { text: '设置统一参数写法', link: '/guide/advance/set-unify-params' },
              ]
            },
          ]
        },
        {
          text: '参考',
          link: '/reference/interface-service',
          items: [
            { text: '接口', link: '/reference/interface-service' },
            { text: '内置中间件', link: '/reference/interface-middleware-builtin' },
            {
              text: '公共中间件',
              link: '/reference/interface-middleware-common',
              collapsed: true,
              items: [
                { text: '服务端请求中间件', link: '/reference/npm-server-fetch' },
                { text: '监控请求进度中间件', link: '/reference/npm-xhr-progress' },
              ]
            },
          ]
        },
      ],
    }
  }
})

