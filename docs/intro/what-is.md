# HTTP Service 是什么 <Badge type="tip" text="概念介绍" />

HTTP Service（HTTP服务），是一个可以用于Web前端 CSR（客户端渲染）以及 SSR（服务端渲染）场景下统一的HTTP Request SDK，我们通常称其为`请求库`或者`统一请求库`。

其设计模式主要借鉴于服务端框架的 middleware 模式，如`koa`，在发起请求部分，我们保留了 Axios 用户发起请求的习惯。

在发起请求的部分，我们遵循 WHATWG Fetch 规范，使用 Fetch API 作为发起请求中间件的内核，于是在现代浏览器中，你可以在不使用任何 polyfill 的情况下使用 HTTP Service。当然我们也为旧版浏览器提供了 polyfill 方案以及为NodeJS用户提供了服务端的使用方案。

通过使用 HTTP Service，你可以通过装配中间件的方式来优雅地组织逻辑发起HTTP请求。

<div class="tip custom-block" style="padding-top: 8px">

想直接使用? 前往 [开始上手](../guide/getting-started).

</div>

## 能力对比

- **XMLHttpRequest VS Fetch**

| 特点 | XMLHttpRequest | fetch API |
| --- | --- | --- |
| **语法** | 使用回调函数处理异步请求 | 基于 Promise，支持 `async/await` |
| **流式传输** | 不支持 | 支持流式传输（例如可以逐步读取响应体）⭐️ |
| **监控请求进度** | 支持⭐️ | 不支持 |
| **错误处理** | 只在网络故障或请求被阻止时抛出异常 | 默认不会因 HTTP 错误状态而抛出异常 |
| **请求/响应格式** | 支持文本和二进制数据 | 支持多种格式，包括 JSON、文本、FormData、Blob 等⭐️ |
| **浏览器支持** | 在所有主流浏览器中广泛支持 | 在现代浏览器中支持，但不支持旧版浏览器 |
| **Service Worker** | 不支持 | 支持⭐️ |
| **中止请求** | 通过 `abort()` 方法 | 使用 `AbortController` |
| **控制重定向** | 不支持 | 支持⭐️ |
| **信任策略** | 默认发送带有凭据的请求（如 cookies） | 默认不包含凭据，但可以配置⭐️ |
| **活跃度** | 停止维护 | 不断迭代⭐️ |

相比XHR，我们为请求库提供了`监控请求进度`适配方案，详见 [监控请求进度中间件](./what-is.md)

- **多种SDK横向对比**

|    Package   | Bundle Size | Extensibility | Browser Compatibility |
|:------------:|:-----------:|:-------------:|:---------------------:|
|     Axios    |      ☁️☁️☁️    |      🔧🔧     |         ⭐️⭐️⭐️         |
|     Fetch+polyfill    |      ☁️+☁️☁️    |       🔧      |           ⭐️⭐️+⭐️         |
| HTTP Service |      ☁️☁️+☁️    |      🔧🔧🔧    |         ⭐️⭐️⭐️         |

体积方面：

- Axios 31KB | 11KB(gzipped)
- Fetch 0K(Modern Browser or NodeJS v18+) | Polyfill 8.8K | 3K(gzipped)
- HTTP Service 22KB | 13KB(gzipped) | 20K(With Fetch Polyfill) ✅

Tips：上为请求服务最基本的package size，不含各项扩展能力

拓展性方面：

- Axios 提供了 Interceptors（拦截器）作为主要干预请求前后的能力
- Fetch 是一个底层库，主要作为**基础请求能力**来进行封装
- HTTP Service 基于链式调用中间件（类似插件形式），灵活，拓展性强 ✅

浏览器兼容性方面：

- Axios 已经稳定运行多年，兼容性良好
- Fetch 在较老的浏览器上没有支持，因此业务引入的时候需要考虑polyfill
- HTTP Service 基于Fetch协议，面向未来，同时可以根据项目运行环境按需引入polyfill，从而使兼容性无需担忧 ✅

## 致谢

感谢以下项目，它们的设计和实现为HTTP Service的开发提供了宝贵的参考：

- [axios](https://github.com/axios/axios)：承载了众多HTTP请求处理的优秀实践，在API层面，我们充分考虑到前端领域中 Axios 的影响，因此也保留了一些Axios用户的使用习惯。
- [koa](https://github.com/koajs/koa)：现代的Web框架，其中间件架构为我们的设计提供了灵感。
- [vitepress](https://github.com/vuejs/vitepress)：本文档站点由 VitePress 驱动。
- [wonder](wonder.md)：如果您阅读到了这里，非常感谢您的耐心，这里有一个精心准备的异想，希望能对您有所帮助。
