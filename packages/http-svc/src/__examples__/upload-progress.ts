/**
 * 测试上传进度
 */
import { HttpService } from '..'
import { HttpSvcXhrProgress } from '../../../xhr-progress/index'

document.title = 'upload progress test'

const http = new HttpService({
  fetch: new HttpSvcXhrProgress()
})

const app = document.querySelector('#app') as HTMLElement

const el = document.createElement('input')
el.accept = 'image/png'
el.type = 'file'
el.addEventListener('change', (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    const file = target.files[0]
    testupload(file)
  }
})

app.appendChild(el)

const testupload = (file) => {
  const data = new FormData()
  data.append('file', file)
  http
    .with('XHR_PROGRESS', {
      onCreated(xhr: XMLHttpRequest) {
        xhr.upload.addEventListener('progress', (e) => {
          console.log(`${Math.round((e.loaded * 100) / e.total)}%`)
        })
      }
    })
    .request({
      url: '//api.bilibili.com/test-upload',
      method: 'POST',
      data
    })
    .then((res) => {
      app.innerText = JSON.stringify(res)
    })
    .catch((error) => {
      app.innerText = error.message
    })
}
