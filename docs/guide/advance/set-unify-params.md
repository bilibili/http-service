# 设置统一参数写法 <Badge type="warning" text="操作指南" />

请求库参考了axios的params与data的用法，对于一些业务场景，可能只关心一个唯一的参数key，这样可以降低参数心智，属于一种特殊简写操作

```ts
import { HttpService } from 'http-svc'

// 我们实现一个，当POST请求时，我们将params对象赋值到data上~
const httpSvc = new HttpService([
  {
    name: "CONVERT_DATA_FROM_POST_PARAMS",
    async handler(ctx, next) {
      // 非空判断，有利于ts提示
      if (ctx.request) {
        const { method, params } = ctx.request
        // 如果是post请求
        if (method === 'POST' && params) {
          ctx.request.data = params
          delete ctx.request.params
        }
      }
      await next()
    }
  }
])

// 这样在后续的post请求时，可以使用params传递data，同理，也可以只对get请求将data赋值给params
httpSvc.request({
  url: '/x/...',
  method: 'POST',
  params: {
    mid: 2
  }
})

// 二次封装时
const ajax = {
  get(url, params) {
    return httpSvc.request({
      url,
      params
    })
  },
  post(url, params) {
    return httpSvc.request({
      url,
      method: 'POST',
      params
    })
  },
}

// 当然，二次封装时也能直接解决这个问题，上述只是提供了一种可能
const ajax = {
  get(url, params) {
    return httpSvc.request({
      url,
      params
    })
  },
  post(url, data) {
    return httpSvc.request({
      url,
      method: 'POST',
      data
    })
  },
}
```
