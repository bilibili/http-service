# 放弃请求 <Badge type="warning" text="操作指南" />

- **示例**

```ts
interface ICustomAbortPayload {
  abortController: AbortController
}

const customAbort = async function (ctx, next, config) {
  const { abortController } = config.payload? || {}
  if (abortController) {
    ctx.abortController = abortController
  }
  await next()
}

// 使用时
const abortController = new AbortController()

httpSvc
  .with(customAbort, { abortController })
  .request({...})

// 在你需要abort的时机
abortController.abort()
```

- **附录**
我们内置的超时中间件实现如下

```ts
const timeout = async function (ctx, next) {
  let ms = ctx.config.timeout
  if (!isNum(ctx.config.timeout)) {
    ms = isNode ? 350 : 10000
  }
  if (!ctx.abortController && ms) {
    const abortController = new AbortController()
    ctx.abortController = abortController
    ctx.timeoutId = setTimeout(() => {
      abortController.abort()
    }, ms)
    await next()
    clearTimeout(ctx.timeoutId)
  } else {
    await next()
  }
}
```
