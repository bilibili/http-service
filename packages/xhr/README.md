# @http-svc/xhr

本中间件为替换HTTPService里的Fetch, 用于一些需要使用xhr监听的场景

## 使用方式

```js
import { HttpSvcXhr } from "@http-svc/xhr"

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
