# 修改响应数据解析方式 <Badge type="warning" text="操作指南" />

我们以BigInt 解析举例

```ts
import { HttpService, BUILT_IN_MIDDLEWARE } from 'http-svc'
import JSONBigInt from 'json-bigint'

const http = new HttpService()

/**
 * @way1 覆盖内建中间件，当传入一个同名中间件时执行覆盖
 */
http
  .with({
    handler: async function (ctx, next) {
      await next()
      if (ctx.response) {
        // 先取string
        const data = await ctx.response.text()
        // 执行解析
        ctx.response.data = JSONBigInt.parse(data)
      }
    },
    name: BUILT_IN_MIDDLEWARE.RES_DATA
  })
  .request({
    url: '//xxx',
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

/**
 * @way2 禁用内建中间件，继续传入一个自己的临时解析中间件
 */
http
  .disable(BUILT_IN_MIDDLEWARE.RES_DATA)
  .with(async function (ctx, next) {
    await next()
    if (ctx.response) {
      // 同上
      const data = await ctx.response.text()
      ctx.response.data = JSONBigInt.parse(data)
    }
  })
  .request({
    url: '//xxx',
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

/**
 * @way3 使用内建中间件的totext方式，再传入自己的parse逻辑
 */
http
  .with(BUILT_IN_MIDDLEWARE.RES_DATA, { type: 'text' })
  .with(async function (ctx, next) {
    await next()
    if (ctx.response) {
      // 已经是text
      // const data = await ctx.response.text()
      ctx.response.data = JSONBigInt.parse(ctx.response.data)
    }
  })
  .request({
    url: '//xxx',
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
