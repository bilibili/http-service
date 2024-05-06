# 起步 <Badge type="warning" text="操作指南" />

## 安装

```shell
npm install http-svc

# Or via yarn:
yarn add http-svc
```

## 导入和创建实例

<!-- 具体区别请前往👉🏻[导入](../reference/interface-service.html#导入) -->

在初始化HttpService时，可以传入[全局配置](../reference/interface-service.md#初始化)

```ts
import { HttpService } from 'http-svc'

const httpSvc = new HttpService()
// or
const httpSvc = new HttpService({
  // 全局配置
})
```

## 发起请求

- **GET**

```ts
httpSvc.request({
  url: '/x/web-interface/nav'
})
.then(res => {
  console.log(res)
})
.catch(err => {
  console.log(err)
})
```

- **POST**

默认行为：请求库会按 data（body）的类型进行自适应设置`Content-Type`，当传入的 data 为普通对象时默认的`Content-Type`为`application/json`

```ts
import { HttpService } from 'http-svc'

const httpSvc = new HttpService()

httpSvc.request({
  url: '/xxxxxxx',
  method: 'POST',
  data:  {
      title: 'title'
  },
})
.then(res => {
  console.log(res)
})
```

想要更多[案例](./examples.md)

## 构建

### Rule

我们在node环境默认提供产物形式是ES Module。
如果您的项目还需要在非现代浏览器使用，那么可能需要进行配置babel 解析

以下为常见的构建工具配置的简单示例

- **Webpack Config**

```js

const excludePkgList = [
  'http-svc',
  '@http-svc/middleware',
  // 对于http-svc相关的npm包，我们默认都是esm格式，因此如果有依赖额外的公共中间件npm包，理论上都需要在这儿增加
]
const babelLoader = {
  test: /\.js(x)?$/,
  exclude: excludePkgList.length ? new RegExp(`/node_modules/(?!${excludePkgList.join('|')})/`) : /node_modules/,
  use: {
      loader: 'babel-loader',
      options: {
      presets: ['@babel/preset-env']
    }
  }
}

module.exports = {
  rules: [
    babelLoader,
    ...,
  ]
}
```

- **Vue2 Config**

```js
module.exports = {
  ...
  transpileDependencies: [
    'http-svc',
    '@http-svc/middlware',
    // 对于http-svc相关的npm包，我们默认都是esm格式，因此如果有依赖额外的公共中间件npm包，理论上都需要在这儿增加
  ],
}
```

## Polyfill

如果您的项目需要在一些低版本（兼容性较差）的环境运行，建议做以下polyfill

- **Browser**

```shell
npm install --save abortcontroller-polyfill
```

```js
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
```

- **NodeJS**

因为node环境我们要结合node-fetch发起请求，可以使用`@http-svc/server-fetch`，请参考该中间件的文档

其依赖的AbortController可以使用下列方式引入

```shell
npm install --save abortcontroller-polyfill
```

```js
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
```
