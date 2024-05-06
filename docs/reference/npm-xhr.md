# XHR <Badge type="warning" text="操作指南" />

使用本中间件可以帮助您实现：

  1. 直接使用XHR发起请求，无需对Fetch进行polyfill；
  2. 进度监控等依赖XHR对象的请求方式；

## 安装

```shell
npm install @http-svc/xhr
```

## 接入

```ts
import { HttpService } from 'http-svc'
import { HttpSvcXhr } from '@http-svc/xhr'

const xttpSvc = new HttpService({
  fetch: new HttpSvcXhr()
})

xttpSvc
    .with('XHR', {
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

## 参考：Xhr 中间件

- **Payload Interface**

```ts
// 中间件载荷
interface IPayload {
    // 生命钩子，在xhr 创建完毕后
    onCreated?: (xhr: XHRHttpRequest) => void
}
```
