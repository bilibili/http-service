import type {
  IHttpSvcMiddleware,
  IMiddlewareHandler,
  IHttpServiceInit,
  BuiltInMiddlewareName,
  IFetchConfig,
  IHttpService,
  FetchBaseURL,
  IAssembleDispatcher
} from 'types/exports'
import { HttpSvcFetch } from './built-in'
import { ConfigControl } from './control/config'
import { AssembleControl } from './control/assemble'
import { RequestControl } from './control/request'

/**
 * HTTP 服务
 * 一个基于中间件顺序组织调用的请求框架
 */
export default class HttpService implements IHttpService {
  // fetch 中间件，可由外部传入，但须按接口实现，不传入则使用内置fetch中间件
  public fetch: IHttpSvcMiddleware | undefined
  // 负责装配中间件的控制单元
  public assembleCtrl = new AssembleControl(this)
  // 负责管理每次请求的中间件配置上下文的控制单元
  public configCtrl = new ConfigControl(this)
  // 负责发起请求的控制单元
  public requestCtrl = new RequestControl(this)
  // 全局基本配置：baseURL，用于拼接请求仅传入path时，完善接口地址
  public baseURL: FetchBaseURL = '//api.domain.com'

  /**
   * 初始化
   * @param initConfig 初始配置，参考interface
   */
  constructor(initConfig?: IHttpServiceInit | IHttpSvcMiddleware[]) {
    if (initConfig) {
      // 如果是一个数组，认为是请求前（before）的中间件顺序数组
      if (Array.isArray(initConfig)) {
        // 使用默认中间件
        this.fetch = new HttpSvcFetch()
        this.register(initConfig)
      } else {
        // 如果是一个配置对象
        const { middlewares, fetch, baseURL } = initConfig
        // 可配fetch
        this.fetch = fetch || new HttpSvcFetch()
        this.register(middlewares || [])
        if (baseURL) this.baseURL = baseURL
      }
    } else {
      // 使用默认fetch
      this.fetch = new HttpSvcFetch()
      this.register([])
    }
  }

  // 注册中间件，调用装配控制
  public register(middlewares: IHttpSvcMiddleware[]): void {
    this.assembleCtrl.register(middlewares)
  }

  // 发起请求，调用请求控制
  public request<T = any>(config: IFetchConfig): Promise<T> {
    return this.requestCtrl.request(config)
  }

  // 禁用已注册的全局中间件
  public disable(middlewareName: BuiltInMiddlewareName | string): IAssembleDispatcher {
    return this.assembleCtrl.disable(middlewareName)
  }

  // 使用临时中间件，可附带载荷
  public with(middleware: IHttpSvcMiddleware | IMiddlewareHandler | BuiltInMiddlewareName | string, payload?: any): IAssembleDispatcher {
    return this.assembleCtrl.with(middleware, payload)
  }

  // 设置fetch中间件
  public setFetch(fetch: IHttpSvcMiddleware): void {
    this.fetch = fetch
    this.requestCtrl.reset()
  }

  // 创建一个实例
  public create(config?: IHttpServiceInit): IHttpService {
    return new HttpService({
      fetch: this.fetch,
      ...(config || {})
    })
  }
}
