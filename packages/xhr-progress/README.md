# XHR发起请求获取上传下载进度

本中间件为替换HTTPService里的Fetch作用

## 使用方式

```js
import { HttpSvcXhrProgress } from "@bilibili/http-svc-xhr-progress"

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
