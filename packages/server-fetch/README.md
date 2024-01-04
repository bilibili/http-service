# Http Service ServerFetch

## 使用方式

### 接入

```js
import { HttpSvcServerFetch } from "@http-svc/server-fetch"

// 全局注册
const httpSvc = new HttpService({
    fetch: new HttpSvcServerFetch()
})

// entry-server.js
httpSvc.setFetch(new HttpSvcServerFetch())
```
