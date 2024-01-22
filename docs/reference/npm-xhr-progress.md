# XHR Progress <Badge type="warning" text="操作指南" />

使用本中间件可以帮助您实现进度监控。

## 安装

```shell
npm install @http-svc/xhr-progress
```

## 接入

```ts
import { HttpService } from 'http-svc'
import { HttpSvcXhrProgress } from '@http-svc/xhr-progress'

const xttpSvc = new HttpService({
  fetch: new HttpSvcXhrProgress()
})

xttpSvc
    .with('XHR_PROGRESS', {
        onCreated(xhr) {
            xhr.upload.addEventListener('progress', (e) => {
            console.log(`${Math.round((e.loaded * 100) / e.total)}%`)
            })
        }
    })
    .request({
        url: '/upload',
        data: ((f) => {
            const formData = new FormData()
            formData.append('file', f)
            return formData
        })(file)
    })
    .then(() => {
        ...
    })
```

## 参考：XhrProgress 中间件

- **Payload Interface**

```ts
// 中间件载荷
interface IPayload {
    // 生命钩子，在xhr 创建完毕后
    onCreated?: (xhr: XHRHttpRequest) => void
}
```
