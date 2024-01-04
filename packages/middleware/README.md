# Http Service 中间件

## 使用方式

### 接入功能中间件

```js
import { HttpSvcWbiEncode, wbiEncode } from "@http-svc/middleware"

// 全局注册
const http = new HttpService([
    new HttpSvcWbiEncode(),
])

// 请求前使用
const http = new HttpService()
http
    .HttpSvcWbiEncode(new HttpSvcWbiEncode(), { ... }) // 或者 .with(wbiEncode, { ... })
    .request({
        url: '...',
        params: {
            ...
        }
    })
    .then(() => {
        ...
    })

```

### 派生自定义组件

```js
import { HttpSvcMiddleware } from "@http-svc/middleware"

async function customHanlder(ctx, next) {
    ...
    return await next()
}

class HttpSvcCustomMiddleware extends HttpSvcMiddleware {
    name = 'CUSTOM_NAME'
    constructor() {
        super(customHanlder)
    }
}
// 全局注册(参考 http-svc的init文档)
const http = new HttpService([
    new HttpSvcCustomMiddleware(customHanlder)
])
```
