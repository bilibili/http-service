import type { IHttpSvcMiddleware, IMiddlewareHandler, IHttpSvcMiddlewareInitConfig, IMiddlewareHandlerConfig } from './types/middleware'

export abstract class HttpSvcMiddleware<T = unknown> implements IHttpSvcMiddleware<T> {
  static handler: IMiddlewareHandler
  static mergeConfig = (config?: IMiddlewareHandlerConfig, payload?: any): IMiddlewareHandlerConfig => {
    return {
      ...(config || {}),
      payload: {
        ...(config?.payload || {}),
        ...(payload || {})
      }
    }
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
    this.handler = async (ctx, next, config) => {
      if (config?.disabled === true) {
        return await next()
      }
      return await (handler || this.handler).bind(this)(ctx, next, HttpSvcMiddleware.mergeConfig(config, payload))
    }
  }
}
