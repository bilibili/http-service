# Http Service 基础中间件

## 使用方式

派生自定义组件

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
