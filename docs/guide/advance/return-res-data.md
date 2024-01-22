# 设置自定义响应返回 <Badge type="warning" text="操作指南" />

在不禁用ResExtract的情况下，我们最后返回的是context.response.data这个字段，因此可以通过中间件执行过程中修改这个字段的值，来达到设置自定义响应返回的目的

```ts
import { HttpService, BUILT_IN_MIDDLEWARE } from 'http-svc'

const http = new HttpService()

http
  .with(async function (ctx, next) {
      await next()
      const data = ctx.response?.data
      if (data?.code === -100) {
        // 设置resolve value
        ctx.response.data = {
          success: false,
          message: '未登录'
        }
      } else if (data?.code === 500) {
        // 使promise 进入error逻辑
        ctx.response = new Response(null, {
          status: 500,
          statusText: '服务器错误'
        })
      }
  })
  .request({
    url: '//xxx',
  })
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })
```
