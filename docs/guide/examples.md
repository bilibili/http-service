# 基础案例 <Badge type="warning" text="操作指南" />

请求库的使用案例

 **API 参考**: 详细的参数定义见 [API 参考](../reference/interface-service)

<!-- 更多案例👉🏻[前往](../examples/response-type.md) -->

## Browser 环境使用

- **基础**

```ts
import { HttpService } from 'http-svc';

const httpSvc = new HttpService()
```

- **全局注册中间件**

```ts
import { HttpService } from 'http-svc';

const httpSvc = new HttpService()
```

- **替换请求库内置的`fetch`请求**

详细的替换方式参考： [替换请求库内置的fetch请求](#自定义fetch)

## NodeJS 环境使用

本节的API参考见 [服务端环境常用中间件](../reference/npm-server-fetch)

如果您想在您的node server 中使用请求库，我们提供了一个NPM包 `@http-svc/server-fetch`

```ts
import { HttpService } from 'http-svc'
import { HttpSvcServerFetch } from '@http-svc/server-fetch'

const httpSvc = new HttpService({
  fetch: new HttpSvcServerFetch()
})

httpSvc.request({
  url: 'http://xxxx.com/x/api'
})
```

- **前端项目SSR接入**

前端项目进行服务端渲染时，除了使用上述server-fetch中间件，还需要做以下步骤：

```ts
// 实例化
import { HttpService } from 'http-svc'
const httpSvc = new HttpService()

// 从某处引入（一般是API.ts文件）
import httpSvc from '@/API/http-svc.ts'


// entry-server.js
import { HttpSvcServerFetch } from '@http-svc/server-fetch'
import { HttpSvcMiddleward } from '@http-svc/middleware'

class HttpSvcServerSide extends HttpSvcMiddleward {
  name = 'SERVER_SIDE'
  constructor() {
    super(async () => {
      // 您的服务端特殊逻辑
      ...
    })
  }
}

httpSvc.setFetch(new HttpSvcServerFetch())
httpSvc.register([
  new HttpSvcServerSide(),
])
// 发起请求，假设您需要注入一些服务端的信息，如ssrContext
httpSvc
  // 对全局中间件传入载荷，可选
  .with('SERVER_SIDE', {
    headers: ssrContext.headers,
  })
  .request({
    url: 'http://xxxx.com/x/api'
  })
```

## 自定义Fetch

以`axios`为例，请求库支持将请求方法替换成您自定义的方法，通过创建继承自 `HttpSvcMiddleware` 的 `MyCustomFetch` 类，您可以将之前编写的 `axiosRequest` 函数转化为中间件形式，从而能够无缝地嵌入到 `http-svc` 的请求处理过程中。

## 1：创建自定义请求方法

以下是一个使用 Axios 实现的自定义请求方法示例：`axiosRequest`。这个函数将会替代默认的 `fetch` 方法

```js
import axios from 'axios'
export const axiosRequest = async (ctx, next) => {
  const { url, method, headers, data } = ctx.request;
  try {
    const response = await axios({
      method,
      url,
      headers,
      data
    });
    console.log('Custom fetch response:', response);
    ctx.response = response.data;
  } catch (error) {
    console.error('Custom fetch error:', error);
  }
  return await next();
};
```

## 2：创建一个自定义的中间件

通过创建继承自 `HttpSvcMiddleware` 的 `MyCustomFetch` 类，您可以将之前编写的 `axiosRequest` 函数转化为中间件形式，从而能够无缝地嵌入到 `http-svc` 的请求处理过程中。

```js
import { HttpSvcMiddleware } from '@http-svc/middleware';

export class MyCustomFetch extends HttpSvcMiddleware {
  static handler = axiosRequest;
  handler = axiosRequest;
  name = 'AXIOS_REQUEST';
}
```

## 3：创建HTTP服务实例

现在，您可以通过创建 `HttpService` 实例，并将 `MyCustomFetch` 实例作为自定义的请求处理方法传递进去。同时，您还可以添加其他中间件，如 `HttpSvcWbiEncode`。
或者使用`setFetch`方法设置自定义的请求方法

```js
import { HttpService } from 'http-svc';
import { HttpSvcWbiEncode } from '@http-svc/middleware';

const http = new HttpService({
  fetch: new MyCustomFetch(),
  middlewares: [new HttpSvcWbiEncode()]
});

// or
http.setFetch(new MyCustomFetch())
```

## 4：发起请求

```ts
http
  .request({
    url: '//api.domain.com/test',
    params: {
      x: 'x'
    }
  })
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })

```
