# 中间件 <Badge type="tip" text="概念介绍" />

整个请求服务，本质上来说是一个编排中间件执行逻辑的框架

## 什么是中间件？

中间件可以是一个在请求过程中的`异步的handler`

例如下方是一个最简单的`函数式中间件`

```ts
// import { IHttpSvcContext, IMiddlewareHandlerConfig } from '@http-svc/types'

async function addSomeParams(context: IHttpSvcContext, next: Promise<unknow>, config: IMiddlewareHandlerConfig) {
  context.request.params.newKey = 'add value'

  await next()
}
```

当然也可以是一个基于中间件类的实例

```ts
import { IHttpSvcContext, IMiddlewareHandler, IMiddlewareHandlerConfig } from '@http-svc/types'
import { HttpSvcMiddleware } from '@http-svc/middleware'
// 可以扩展配置
interface IAddSomeParamsPayload {
  config1: boolean
}
export const addSomeParams: IMiddlewareHandler<IAddSomeParamsPayload> = async function (ctx, next, config) {
  // 假设这个config1 用以删除请求参数中的某对kv
  if (config?.payload?.config1) {
    delete context.request.params.oldKey
  }
  context.request.params.newKey = 'add value'
  await next()
}

// 推荐是以`HttpSvc`开头，如此以突出适用的框架，当然不强迫，当名称过长时可以考虑使用 `AddSomeParams`
export class HttpSvcAddSomeParams extends HttpSvcMiddleware<IAddSomeParamsPayload> {
  static handler = addSomeParams
  name = 'ADD_SOME_PARAMS'
  constructor() {
    super(addSomeParams)
  }
}

```

这个中间件最好也同时export handler，因为我们兼容三种引入中间件的方式

```ts
import { addSomeParams, HttpSvcAddSomeParams } from './middlewares/add-some-params' // 假设这个中间件在这

// A
httpSvc
  .with(addSomeParams, { config1: true })
// B
httpSvc
  .with(HttpSvcAddSomeParams.handler, { config1: true })
// C
httpSvc
  .with(new HttpSvcAddSomeParams(), { config1: true })

```

## 处理原则

中间件对context进行干预时，有以下原则：

1. 避免修改`context.config`
2. 减少中间件之间的耦合

- **干预请求**

干预请求所涉及的对象是`context.request`，它是由init context中间件克隆出来的runtime state

```ts
// 请求前modify params
const addSomeParam = async (ctx, next) => {
  ctx.request.params.newKey = 'test'
  await next()
}
```

附内置中间件参考：[内置中间件](../reference/interface-middleware-builtin.md)
