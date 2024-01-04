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

## Development

### 初始化项目

```shell
pnpm run init

# or
pnpm install
# + skip install
pnpm run init
```

### 项目说明

核心为`middleware` + `http-svc`

`http-svc`作为Framework，`middleware`作为中间件（插件）

`template`作为中间件模板，可以通过`pnpm run create`创建新的中间件

### 调试

在 http-svc 项目中执行

```shell
pnpm run dev
```

可以在index.html下增加示例代码`<script src="./src/__examples__/xxx.test.ts"></script>`

### 单元测试

```shell
pnpm run test
```

### 构建

```shell
pnpm run build
```
