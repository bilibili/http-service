# HTTP Service &middot; [![GitHub license](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://github.com/bilibili/http-service/blob/main/LICENSE)

## 什么是 HTTP Service

HTTP Service（HTTP服务），是一个可以用于Web前端 CSR（客户端渲染）以及 SSR（服务端渲染）场景下统一的HTTP Request SDK，我们通常称其为`请求库`或者`统一请求库`。

其设计模式主要借鉴于服务端框架的 middleware 模式，如`koa`，在发起请求部分，我们保留了 Axios 用户发起请求的习惯。

在发起请求的部分，我们遵循 WHATWG Fetch 规范，使用 Fetch API 作为发起请求中间件的内核，于是在现代浏览器中，你可以不使用任何 polyfill 的情况下使用 HTTP Service。当然我们也为旧版浏览器提供了 polyfill 方案以及为NodeJS用户提供了服务端的使用方案。

通过使用 HTTP Service，你可以通过装配中间件的方式来优雅地组织逻辑发起HTTP请求。

## 环境支持

### Browser

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

### NodeJS

| 版本 | 使用方案 |
|----------------|---------|
| 低于 16.5.0    | 推荐使用 [node-fetch](https://github.com/node-fetch/node-fetch) 作为fetch中间件内核 |
| 16.5.0 及以上  | 按您喜好使用 [node-fetch](https://github.com/node-fetch/node-fetch) 或者 [undici](https://github.com/nodejs/undici) 作为fetch中间件内核 |
| 高于 18.0.0    | 已内置fetch |

## 开始上手

请前往Doc站点，查看[快速开始](https://github.io/bilibili/http-service/guide/getting-started)
