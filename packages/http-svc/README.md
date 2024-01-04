# HTTP Service

## What is

HTTP Service 是一个基于中间件组织模式，同时也是基于洋葱模式的 JavaScript Request SDK，它既可以帮助你快速发起一个简单的 HTTP 请求，也可以集成社区通用的中间件以构建复杂的请求过程。

## Quick start

请前往Doc站点，查看[快速开始](https://http-svc.vercel.app/quick-start)

此处仅提供简单的示例

- **Base**

```ts
import { HttpService } from 'http-svc';

const httpSvc = new HttpService();

httpSvc
    .request({
        url: 'https://httpbin.org/get',
        method: 'GET',
        params: {
            a: 1,
            b: 2,
        },
        timeout: 1000,
        // ...其他配置
    })
    .then((res) => {
        console.log(res);
    });
```

- **With Middleware**

```ts
import { HttpService } from 'http-svc';

const httpSvc = new HttpService();

httpSvc
    .with(async (ctx, next) => {
        console.log('before request');
        await next()
        console.log('after request');
    })
    .request({
    url: 'https://httpbin.org/get',
    method: 'GET',
    params: {
        a: 1,
        b: 2,
    },
    timeout: 1000,
    // ...其他配置
    }).then((res) => {
    console.log(res);
    });
```

## Polyfill

```shell
npm install --save abortcontroller-polyfill
```

- **Browser**

```js
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
```

- **Browser**

因为node环境我们要结合node-fetch发起请求，可以使用`@http-svc/server-fetch`，请参考该中间件的文档

其依赖的AbortController可以使用下列方式引入

```js
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
```
