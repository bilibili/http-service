import { IMiddlewareContext, IMiddlewareHandlerConfig, IHttpSvcConfigControl, IMiddlewareContextProvider } from 'types/exports'
import { HttpSvcControl } from './_'

/**
 * 中间件配置控制
 */
export class ConfigControl extends HttpSvcControl implements IHttpSvcConfigControl {
  /**
   * 提供
   * @param ctx 初始中间件上下文，可不传
   * @returns 中间件上下文提供者
   */
  public provide(ctx: IMiddlewareContext = {}): IMiddlewareContextProvider {
    const provider = {
      inject: (key: string, value: IMiddlewareHandlerConfig) => {
        this.inject(ctx, key, value)
        return provider
      },
      disable: (key: string) => {
        this.disable(ctx, key)
        return provider
      },
      get: () => {
        return ctx
      }
    }
    return provider
  }
  /**
   * 插入中间件的载荷
   * @param ctx 中间件上下文
   * @param name 中间件名称
   * @param config 中间件配置
   */
  private inject(ctx: IMiddlewareContext, name: string, config: IMiddlewareHandlerConfig) {
    ctx[name] = config
  }

  /**
   * 设置中间件禁用载荷
   * @param ctx 中间件上下文
   * @param name 需要禁用的中间件名称
   */
  private disable(ctx: IMiddlewareContext, name: string) {
    ctx[name] = {
      ...(ctx[name] || {}),
      disabled: true
    }
  }
  /**
   * 获取中间件在当前上下文的配置
   * @param ctx 中间件配置上下文
   * @param name 中间件名称
   * @returns 中间件的配置
   */
  public get(ctx: IMiddlewareContext, name: string) {
    return ctx[name] || {}
  }
}
