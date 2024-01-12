# Unios

一个基于http-svc的http client，采用和axios近似的接口定义，便于使用过axios用户快速接入

默认8秒超时

## 使用

### 发起请求

```js
import unios from 'unios'

// get
unios.get('//xxx', { params: { id: 1 } })
unios({
    url: '//xxx'
})
unios.request({
    url: '//xxx'
})

// post
unios.post('//xxx', { title: 'test' }, { headers: { 'Content-Type': '...' } })
unios({
    url: '//xxx',
    method: 'POST',
    data: {
        title: 'test',
    },
    headers: { 'Content-Type': '...' },
})
unios.request({
    url: '//xxx',
    method: 'POST',
    data: {
        title: 'test',
    },
    headers: { 'Content-Type': '...' },
})

```

### 使用http service的能力

```js
// 链式调用
unios.get('//xxx', {
    chainProxy: (httpSvc) => httpSvc.with(new Middleware) // 参考with方法
})

// 注册逻辑
unios.service.setFetch(new CustomFetch())
unios.service.register([...])
```

### 接口

请查看"unios/index.d.ts"
