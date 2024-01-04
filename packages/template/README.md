# Http Service 中间件模板

## 使用方式

### 接入功能中间件

```js
import { HttpSvcAbc } from "@http-svc/abc"

// 全局注册
const http = new HttpService([
    new HttpSvcAbc(),
])

// 请求前使用
const http = new HttpService()
http
    .with(new HttpSvcAbc())
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
