# 设置默认请求头 <Badge type="warning" text="操作指南" />

假设我们实现一个设置POST请求时的默认content-type为form

```ts
import { HttpService } from 'http-svc'

const http = new HttpService([
  {
    name: "SET_DEFAULT_HEADERS",
    async handler(ctx, next) {
      // 非空判断，有利于ts提示
      if (ctx.request) {
        const { method, headers } = ctx.request
        // 如果是post请求
        if (method === 'POST') {
          const key = 'Content-Type'
          ctx.request.headers = {
            // assign
            ...(headers || {}),
            // 默认逻辑
            [key]: headers?.[key] || 'application/x-www-form-urlencoded'
          }
        }
      }
      await next()
    }
  }
])
```
