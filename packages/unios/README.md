# Unios

一个基于http-svc的http client，采用和axios近似的接口定义，便于使用过axios用户快速接入。

* **关于为什么命名为unios**

1. 我们了解了axios的名称由来：Axios 这个名称来自于希腊语 "ἄξιος"（axios），意思是 "值得的" 或 "配得上的"。
2. 我们这个库希望保留axios的特征，以显示其跟axios有密不可分的关联（接口类似），于是我们选用了其单词内的ios，并且我们赋予其新的含义（IOS = Input Output System），意为输入输出系统，即输入一个请求，输出一个响应。
3. 我们基于了http-svc（统一请求库）来作为内核的部分，因此我们取名为unios，即Unified IO System，一个统一输入输出的请求系统设计。

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

### 默认项

| 选项 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| baseURL | 基础URL | `string` | `//api.domain.com` |
| timeout | 超时时间 | `number` | `8000` |

## 接口定义

请查看"unios/index.d.ts"
