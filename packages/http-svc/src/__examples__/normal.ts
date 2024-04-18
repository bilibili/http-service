/**
 * 测试上传进度
 */
import { HttpService } from '..'

document.title = 'Normal Test'

// 可以cd到/server 目录下，运行start，启动一个简单的服务
const http = new HttpService({
  baseURL: 'http://localhost:3333'
})
http
  .request({
    url: '/get'
  })
  .then((res) => {
    console.log(res)
  })
  .catch((error) => {
    alert('cd到/server 目录下，运行start，启动一个简单的服务')
    console.error(error)
  })
http
  .request({
    url: '/post',
    method: 'post',
    data: {
      test_key: 1
    }
  })
  .then((res) => {
    console.log(res)
  })
  .catch((error) => {
    console.error(error)
  })
