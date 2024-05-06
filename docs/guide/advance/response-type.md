# 设置响应数据解析类型 <Badge type="warning" text="操作指南" />

由于默认解析类型为json，但有些接口返回的不是json格式，我们提供了以下方法，参考[内置中间件-ResData](../../reference/interface-middleware-builtin.md)

```ts
import { HttpService, BUILT_IN_MIDDLEWARE } from 'http-svc'

const http = new HttpService()

/**
 * 传入data解析type字段
 */
http
  .with(BUILT_IN_MIDDLEWARE.RES_DATA, { type: 'text' })
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
