import type { IHttpSvcMiddleware, IMiddlewareHandler, IHttpSvcMiddlewareInitConfig, IMiddlewareHandlerConfig } from './types/middleware'

export abstract class HttpSvcMiddleware<T = unknown> implements IHttpSvcMiddleware<T> {
  static handler: IMiddlewareHandler
  static mergeConfig = (config?: IMiddlewareHandlerConfig, payload?: any): IMiddlewareHandlerConfig => {
    const _payload = Object.assign({}, payload || {}, config?.payload || {})
    return Object.assign({}, config || {}, { payload: _payload })
  }

  abstract name: string
  handler: IMiddlewareHandler<T> = () => Promise.resolve('Please set a handler for middleware')
  constructor(handlerOrConfig?: IMiddlewareHandler | IHttpSvcMiddlewareInitConfig) {
    let handler
    let payload
    if (typeof handlerOrConfig === 'function') {
      handler = handlerOrConfig
    } else {
      handler = handlerOrConfig?.handler
      if (handlerOrConfig?.payload) payload = handlerOrConfig.payload
    }
    this.handler = (ctx, next, config) =>
      new Promise((resolve, reject) => {
        if (config?.disabled === true) {
          return next().then(resolve).catch(reject)
        }
        if (!handler) {
          handler = this.handler
        }
        handler.bind(this)(ctx, next, HttpSvcMiddleware.mergeConfig(config, payload)).then(resolve).catch(reject)
      })
  }
}
