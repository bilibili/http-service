# 内置中间件 <Badge type="tip" text="概念介绍" />

1. 初始化Context
2. XSRF
3. 请求体封装
4. 超时
5. 发起请求
6. 响应转化data
7. 重试

<div class="tip custom-block" style="padding-top: 8px">

关于如何使用中间件载荷? 前往 [API-with](./interface-service.md#with).
</div>

- **InitCtx**

这个中间件用以初始化请求过程中的上下文。

- **Xsrf**

```ts
/**
 * 响应数据载荷
 */
interface IPayload {
    // 在url上传入
    params?: boolean
    // POST请求时，在data中传入
    data?: boolean
    // 传入时的keyname
    key?: string
}
```

- **Body**

这个中间件用以将params（query）拼接在url上，并将Post请求时的data处理成符合Fetch API的格式，适应headers中的content-type逻辑

- **Timeout**

这个中间件用以控制超时逻辑，使用时请在FetchConfig中传入timeout 值即可使用。

- **Fetch**

这个中间件用以发起请求，可以在初始化请求服务实例时覆盖传入至initConfig[请求服务-初始化](./interface-service.html#初始化)

此中间件的定位为获得响应，如果需要使用缓存等自定义的数据以跳过请求，请在此之前对context.response进行赋值。

- **ResData**

这个中间件用以在response ok时解析结果，以获得json对象或者文本字符串或者其他格式的data，默认json。

```ts
/**
 * 响应数据载荷
 */
interface IPayload {
    type: 'json' | 'text' | 'arrayBuffer' | 'blob' | 'formData'
}
```

- **Retry**

这个中间件负责请求出错时，进行重试相关的逻辑

```ts
/**
 * 重试载荷
 */
interface IPayload {
    // 重试次数
    times?: number
    // 自定义重试条件
    condition?: IRetryCondition
    // 重试前的回调
    onRetry?: IRetryCallback
}

```
