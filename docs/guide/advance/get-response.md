# 获得响应对象 <Badge type="warning" text="操作指南" />

```ts
import { HttpService, BUILT_IN_MIDDLEWARE } from 'http-svc'
import { HttpService } from 'http-svc'

const http = new HttpService()

/**
 * 通过禁用响应数据提取从而获得Response
 */
http
  .disable(BUILT_IN_MIDDLEWARE.RES_EXTRACT)
  .request({
    url: '//xxx',
  })
  .then((res) => {
    console.log(res)
    // { status: 200, data: {}, statusText: '' }
  })
  .catch((err) => {
    console.log(err)
  })
```
