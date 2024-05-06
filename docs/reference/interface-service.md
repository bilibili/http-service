# API 参考

## 初始化

```ts
import { HttpService } from 'http-svc'

new HttpService(initConfig)

// initConfig 接口
interface IHttpServiceInit {
  baseURL?: FetchBaseURL
  fetch?: IHttpSvcMiddleware
  middlewares?: IHttpSvcMiddleware[]
}

// 或者只传入：IHttpSvcMiddleware[]
new HttpService(middlewares)
```

### IHttpServiceInit

|     Key     |        Type         | Required |        Default       |               Desc             |
|:-----------:|:-------------------:|:--------:|:--------------------:|:------------------------------:|
|   baseURL   |        String       |   false  | "//api.domain.com" | 默认host，可在请求时只传入接口path |
|    fetch    |  HttpSvcMiddleware  |   false  |          -           |             请求中间件          |
| middlewares | HttpSvcMiddleware[] |   false  |          -           |             全局中间件          |

## 实例API

### request

发起请求

```ts
import { HttpService } from 'http-svc'

const httpSvc = new HttpService()
httpSvc.request(fetchConfig)

// fetchConfig 接口
interface IFetchConfig {
  url: string
  /**
   * base URL(host) like '//api.bilibili.com'
   */
  baseURL?: FetchBaseURL
  /**
   * 请求方法
   */
  method?: FetchMethod
  /**
   * 请求超时时间
   */
  timeout?: number
  /**
   * 请求头
   */
  headers?: IFetchHeaders
  /**
   * 请求凭证
   */
  credentials?: FetchCredentials
  params?: IFetchParams
  data?: IFetchData
}
```

#### IFetchConfig

|      Key     |       Type       | Required |      Default      |              Desc              |
| :----------: | :---------------: | :------: | :--------------: | :----------------------------: |
|     url      |      String       |   true   |         -         | 请求传入的接口地址或者path      |
|   baseURL    |      String       |  false   | "//api.bilibili.com" | 如果传入的url为path，此处传对应的host，不传则读取全局baseURL |
|   method     |   FetchMethod     |  false   |       "GET"       |       请求方法，常用的有GET、POST       |
|   timeout    |      Number       |  false   |         0         |         请求超时时间           |
|   headers    |      Record       |  false   |         -         |            请求头              |
| credentials  |      String       |  false   |    "include"     |           请求凭证              |
|    params    |      Record       |  false   |         -         |           query 参数            |
|     data     | Record,FormData |  false   |         -         |        POST请求时的body参数         |

### register

一个实例可以多次调用注册中间件，该逻辑为concat逻辑，目前仅推荐在服务端渲染时的入口进行二次注册；

```ts
import { HttpService } from 'http-svc'

const httpSvc = new HttpService()

httpSvc.register(middlewares)
```

如果要多次注册，请参考下列多实例方案

```ts
// for 基础
const httpSvcBase = new HttpService()
// for 场景1
const httpSvcScene1 = new HttpService([
  new Middleware1(),
  new Middleware2(),
])
// for 场景2
const httpSvcScene2 = new HttpService([
  new Middleware1(),
  new Middleware2(),
  new Middleware3(),
  new Middleware4(),
])
```

### with

with是使用过程中最灵活的API，同时按照使用频率自上而下：

1. 传入临时中间件
2. 为全局中间件传入载荷，同时可以调整该中间件在所有中间件中的位置
3. 覆盖全局中间件

```ts
import { HttpService, BUILT_IN_MIDDLEWARE } from 'http-svc'

const httpSvc = new HttpService([
    new Custom1()
])

httpSvc
  // 函数中间件
  .with(async (ctx, next, config) => {
    console.log('before request')
    await next()
    console.log('after request')
  }, payload)
  // 实例化中间件
  .with(new HttpSvcMiddleware(), payload)
  // 使用内置中间件的载荷逻辑
  .with(BUILT_IN_MIDDLEWARE.XSRF, {
    params: true
  })
  // 使用您注册全局中间件的载荷逻辑，注意，这个调用可以临时按照with顺序改变非内置中间件的位置顺序
  .with("CUSTOM_1", {
    customKey: 'ok'
  })
  // 覆盖全局注册的同名中间件，传入自定义的载荷 // 一般用上面这个逻辑就能满足了，除非是new 的时候有参数要传
  .with(new Custom1(), {
    customKey: 'no ok'
  })
  // 覆盖内置中间件
  .with({
    name: BUILT_IN_MIDDLEWARE.RES_DATA,
    handler: async (ctx, next, config) => {
      await next()
      ctx.response.data = ctx.response.json()
    }
  })
   .request(fetchConfig)
```

### disable

禁用全局注册了的中间件

```ts
import { HttpService, BUILT_IN_MIDDLEWARE } from 'http-svc'

const httpSvc = new HttpService([
  new Custom1()
])
httpSvc
  // 函数中间件
  .disable('CUSTOM_1')
```

需要注意，我们的内置中间件也是全局中间件，但其中有些是不支持禁用的，如InitCtx,Timeout。

您在设计中间件时，选择集成HttpSvcMiddleware并且在构造器内调用了super方法传入当前中间件的handler，才能开启默认的disable能力，否则需要您自行在handler内实现

- **继承自默认中间件，详见[什么是中间件](../intro/middleware.md#什么是中间件)**

```ts
export class HttpSvcAddSomeParams extends HttpSvcMiddleware {
  static handler = addSomeParams
  name = 'ADD_SOME_PARAMS'
  constructor() {
    // 调用父类的constructor
    super(addSomeParams)
  }
}
```

- **自行实现**

```ts
export const myCustomMiddlewareHandler = async (ctx, next, config) => {
  if (config?.disabled) {
    return await next()
  }
    ...
}
```

## 虚拟中间件

- **调试**

此举可以返回整个context

```ts
httpSvc.with('DEBUG')
```

- **响应数据提取**

框架默认会提取Response的data字段，禁用此中间件可获得完整的原始Response

```ts
import { HttpService, BUILT_IN_MIDDLEWARE } from 'http-svc'

const httpSvc = new HttpService()
httpSvc
  .disable(BUILT_IN_MIDDLEWARE.RES_EXTRACT)
  .request(fetchConfig)
  .then((res) => {
    console.log(res)
    // Response 对象
  })
```

## 特殊用法

由于request结束后resolve的默认是context.response.data这个字段，因此可以通过中间件干涉这个字段，以返回所期望的data

例如

```ts
httpSvc
  .with(async (ctx, next) => {
    await next()

    if (ctx.response?.data) {
      ctx.response.data = {
        test: 1,
        oData: ctx.response.data
      }
    }
  })
  .request(fetchConfig)
  .then(res => {
    console.log(res)
    // { test: 1, oData: ... }
  })
```

## 其他参考

### 上下文

```ts
// context
interface IHttpSvcContext {
    // 超时控制器
    abortController?: AbortController
    // 超时id
    timeoutId?: ReturnType<typeof setTimeout>
    // 当前重试次数
    retry?: number
    // 响应
    response?: IFetchResponse
    // 请求对象
    request?: IFetchRequest
    // 请求配置对象
    config: IFetchConfig
    // 中间件ctx
    middleware: IMiddlewareContext
    // 使用异步请求
    useAsyncRequest: IUseAsyncRequest
}
```

### 响应

```ts
interface IFetchResponse extends Response {
  data?: any
}

/**
 * This Fetch API interface represents the response to a request.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response)
 */
interface Response extends Body {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/headers) */
    readonly headers: Headers;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/ok) */
    readonly ok: boolean;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/redirected) */
    readonly redirected: boolean;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/status) */
    readonly status: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/statusText) */
    readonly statusText: string;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/type) */
    readonly type: ResponseType;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/url) */
    readonly url: string;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/clone) */
    clone(): Response;
}
```

### 中间件上下文

中间件上下文是每次请求存储挂载的所有中间件config的字典，一般情况下，避免跨中间件读写（会加重耦合）

如果一定要跨中间件读写，请将这类中间件做使用上的强关联

```ts
interface IMiddlewareContext {
  [name: string]: IMiddlewareHandlerConfig<any>
}
```

### 组合式请求方案

#### 串行请求

- **Bad**

```ts
await httpSvc
    .with(async function(ctx, next) {
        await httpSvc.request(cfg2)
        return await next()
    })
    .request(cfg1)
```

- **Good**

```ts
await httpSvc.request(cfg2)
await httpSvc.request(cfg1)
```

#### 异步请求

- **Bad**

```ts
await httpSvc
    .with(async function(ctx, next) {
        httpSvc
            .request(cfg2)
            .then(res => {

            })
        return await next()
    })
    .request(cfg1)
```

- **Good**

```ts

await httpSvc
  .with(async function(ctx, next) {
    ctx.useAsyncRequest(async (request) => {
      try {
        await request(cfg2)
      } catch {
        // dosth
      }
    })
  })
  .request(cfg1)
```
