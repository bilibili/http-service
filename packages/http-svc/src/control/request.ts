import { HttpSvcControl } from './_'
import { IMiddlewareContext, IHttpSvcContext, IFetchConfig, IRequestFunction, FetchMethod, IUseAsyncRequest } from 'types/exports'
/**
 * 请求控制
 */
export class RequestControl extends HttpSvcControl {
  // 基于全局中间件组织的默认请求方法
  private fn: IRequestFunction | null = null

  /**
   * 发起请求方法
   * @param config 请求配置
   * @param middlewareCtx 中间件配置上下文
   * @param fn 临时组织的请求方法
   * @returns
   */
  public async request(config: IFetchConfig, middlewareCtx: IMiddlewareContext = {}, fn?: any): Promise<any> {
    if (!fn) {
      if (!this.fn) {
        this.generateRequestFunction()
      }
      fn = this.fn
    }
    return await fn(this.createContext(config, middlewareCtx, fn))
  }

  private generateRequestFunction() {
    this.fn = this.httpSvc.assembleCtrl.compose()
  }

  public reset() {
    this.fn = null
  }

  private get useAsyncRequest(): IUseAsyncRequest {
    return (asyncRequest, config?) => {
      const inst = this.httpSvc.create(config)
      asyncRequest(inst.request.bind(inst))
    }
  }

  /**
   * 创建请求的上下文
   * @param config 请求配置
   * @param middleware 中间件上下文
   * @returns 请求上下文
   */
  private createContext(config: IFetchConfig, middleware: IMiddlewareContext = {}, requestFn): IHttpSvcContext {
    const { url, method } = config
    const ctx: IHttpSvcContext = {
      // 初始的config
      config: {
        baseURL: this.httpSvc.baseURL,
        ...config
      },
      useAsyncRequest: this.useAsyncRequest,
      middleware,
      request: {
        url,
        method: (method || 'get').toUpperCase() as FetchMethod,
        function: requestFn
      }
    }
    return ctx
  }
}
