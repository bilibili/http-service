# Server Fetch <Badge type="warning" text="操作指南" />

服务端请求中间件，可服务于node server场景，也可以配合前端的服务端渲染使用

## 安装

```shell
npm install @http-svc/server-fetch
```

## 接入

```ts
import { HttpService } from 'http-svc'
import { HttpSvcServerFetch } from '@http-svc/server-fetch'

const httpSvc = new HttpService({
  fetch: new HttpSvcServerFetch()
})
```
