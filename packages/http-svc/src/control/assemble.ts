import {
  IFetchConfig,
  IHttpSvcMiddleware,
  IMiddlewareHandler,
  IHttpSvcContext,
  IAssembleDispatcher,
  IMiddlewareContextProvider,
  IHttpSvcAssembleControl,
  IRequestFunction,
  BuiltInMiddlewareName
} from 'types/exports'
import { HttpSvcMiddleware } from '@http-svc/middleware'
import { HttpSvcControl } from './_'
import { HttpSvcInitCtx, HttpSvcTimeout, HttpSvcBody, HttpSvcResData, HttpSvcSprayMiddleware, HttpSvcRetry } from '../built-in'
import { createError, isMiddleware } from '../shared'
import { BUILT_IN_MIDDLEWARE, ORDER_PRIFIX } from '../const'

class AssembleDispatcher implements IAssembleDispatcher {
  public middlewares: IHttpSvcMiddleware[] = []
  public middlewareConfigCtxProvider: IMiddlewareContextProvider

  constructor(public control: AssembleControl) {
    this.middlewareConfigCtxProvider = this.control.httpSvc.configCtrl.provide()
  }

  public with(middleware: IHttpSvcMiddleware | IMiddlewareHandler | BuiltInMiddlewareName | string, payload?: any) {
    if (!middleware) return this
    if (typeof middleware === 'string') {
      this.middlewares.push({
        name: `${ORDER_PRIFIX}${middleware}`,
        handler: HttpSvcSprayMiddleware.handler
      })
      if (payload) {
        this.inject(middleware, payload)
      }
    } else if (typeof middleware === 'function') {
      this.middlewares.push(new HttpSvcSprayMiddleware(middleware as IMiddlewareHandler, payload) as HttpSvcMiddleware)
    } else if (isMiddleware(middleware)) {
      this.middlewares.push(middleware as IHttpSvcMiddleware)
      if (payload) {
        this.inject(middleware.name, payload)
      }
    }
    return this
  }

  /**
   * 插入中间件载荷
   * @param name 中间件名称
   * @param payload 中间件的载荷
   * @returns this
   */
  public inject(name: BuiltInMiddlewareName | string, payload: any) {
    // 包裹成config 再进行inject
    this.middlewareConfigCtxProvider.inject(name, { payload })
    return this
  }

  /**
   * 禁用中间件
   * @param name 中间件名称
   * @returns this
   */
  public disable(name: BuiltInMiddlewareName | string) {
    this.middlewareConfigCtxProvider.disable(name)
    return this
  }

  public request(config: IFetchConfig) {
    const fn = this.control.compose(this.middlewares)
    return this.control.httpSvc.requestCtrl.request(config, this.middlewareConfigCtxProvider.get(), fn)
  }
}

/**
 * 装配中间件控制
 */
export class AssembleControl extends HttpSvcControl implements IHttpSvcAssembleControl {
  // 中间件
  private middlewares: IHttpSvcMiddleware[] = []

  // 判断是否重复注册
  private alreadyExistsIdx(middlewareName: string) {
    return this.middlewares.findIndex((m) => m.name === middlewareName)
  }

  // 注册中间件
  public register(middlewares: IHttpSvcMiddleware[]): void {
    if (Array.isArray(middlewares)) {
      let reset = false
      middlewares.forEach((m) => {
        if (isMiddleware(m)) {
          reset = true
          const idx = this.alreadyExistsIdx(m.name)
          if (idx > -1) {
            this.middlewares[idx] = m
          } else {
            this.middlewares.push(m)
          }
        }
      })
      if (reset) {
        this.httpSvc.requestCtrl.reset()
      }
    }
  }

  // 启动装配调度
  private setup() {
    return new AssembleDispatcher(this)
  }

  /**
   * 禁用注册了的全局中间件
   * @param middlewareName 中间件名称
   * @returns dispatcher
   */
  public disable(middlewareName: BuiltInMiddlewareName | string) {
    return this.setup().disable(middlewareName)
  }

  /**
   * 挂载临时中间件
   * @param middleware 中间件
   * @param payload 中间件的载荷
   * @returns dispatcher
   */
  public with(middleware: IHttpSvcMiddleware | IMiddlewareHandler | BuiltInMiddlewareName | string, payload: any) {
    return this.setup().with(middleware, payload)
  }

  /**
   * 组织中间件，获得组织后的请求方法
   * @param middlewares 临时挂载的前中间件
   * @returns 请求方法
   */
  public compose(middlewares?: IHttpSvcMiddleware[]): IRequestFunction {
    // 全局中间件列表拷贝
    const list1: IHttpSvcMiddleware[] = [...this.middlewares]
    // 临时中间件收集
    const list2: IHttpSvcMiddleware[] = []

    const builtInOverride: Record<string, IHttpSvcMiddleware | null> = {
      [BUILT_IN_MIDDLEWARE.RETRY]: null,
      [BUILT_IN_MIDDLEWARE.BODY]: null,
      [BUILT_IN_MIDDLEWARE.RES_DATA]: null,
      [BUILT_IN_MIDDLEWARE.TIMEOUT]: null
    }

    const builtInNames = Object.keys(builtInOverride)
    const unique: Record<string, IHttpSvcMiddleware | null> = {}

    /**
     * 顺序逻辑：
     * 1. 如果是内置组件，走覆盖逻辑
     * 2. 非内置组件，同名中间件，with 覆盖 global；不同名中间件，global顺序靠洋葱外层，with顺序靠洋葱内层
     * 3. 如果是调整global 与 with 的调用顺序，可使用with(globalMiddlewareName, payload)
     */
    ;(middlewares || []).forEach((m) => {
      if (isMiddleware(m)) {
        let middlewareName = m.name
        if (builtInNames.includes(middlewareName)) {
          if (!builtInOverride[middlewareName]) {
            builtInOverride[middlewareName] = m
          }
        } else {
          // 如果是顺序调整
          if (middlewareName.startsWith(ORDER_PRIFIX)) {
            middlewareName = middlewareName.substring(ORDER_PRIFIX.length)
            // 必须是没设置过的
            if (!unique[middlewareName] && !(middlewareName in builtInOverride)) {
              const globalMiddlewareIndex = list1.findIndex((m) => m.name === middlewareName)
              if (globalMiddlewareIndex > -1) {
                // 取对应中间件
                const realM = list1[globalMiddlewareIndex]
                // 移除原列表
                list1.splice(globalMiddlewareIndex, 1)
                unique[middlewareName] = realM
                list2.push(realM)
              }
            }
          } else {
            // 临时函数中间件
            if (BUILT_IN_MIDDLEWARE.SPRAY === middlewareName) {
              list2.push(m)
            } else if (!unique[middlewareName]) {
              // 没用过的中间件
              unique[middlewareName] = m
              list2.push(m)
            }
          }
        }
      }
    })

    const list: IHttpSvcMiddleware[] = []

    list1.forEach((m) => {
      if (builtInNames.includes(m.name)) {
        if (!builtInOverride[m.name]) {
          builtInOverride[m.name] = m
        }
      } else if (!unique[m.name]) {
        list.push(m)
      }
    })

    list.push(...list2)

    const middlewareList = [
      // after 倒序
      // 重试
      builtInOverride[BUILT_IN_MIDDLEWARE.RETRY] || new HttpSvcRetry(),
      // before 正序
      new HttpSvcInitCtx(),
      // 临时 + 全局
      ...list,
      // 取res data
      builtInOverride[BUILT_IN_MIDDLEWARE.RES_DATA] || new HttpSvcResData(),
      // 处理body
      builtInOverride[BUILT_IN_MIDDLEWARE.BODY] || new HttpSvcBody(),
      // 开始超时计时
      builtInOverride[BUILT_IN_MIDDLEWARE.TIMEOUT] || new HttpSvcTimeout(),
      // fetch
      this.httpSvc.fetch as HttpSvcMiddleware
      // 有兜底处理
    ]
    return async (context: IHttpSvcContext) => {
      let index = -1
      const configCtrl = this.httpSvc.configCtrl
      const debug = configCtrl.get(context.middleware, 'DEBUG').payload
      await dispatch(0)
      if (debug) {
        return context
      }
      const disableResExtract = configCtrl.get(context.middleware, BUILT_IN_MIDDLEWARE.RES_EXTRACT).disabled
      if (!disableResExtract && context.response?.ok) {
        return context.response?.data || null
      }
      return context.response
      async function dispatch(i: number): Promise<any> {
        if (i === middlewareList.length) return
        if (i <= index) throw createError(context, 'The next() called multiple times')
        index = i
        const middleware = middlewareList[index]
        if (!middleware) {
          throw createError(context, 'Middleware is not exist')
        }
        await middleware.handler(context, dispatch.bind(null, i + 1), configCtrl.get(context.middleware, middleware.name))
      }
    }
  }
}
