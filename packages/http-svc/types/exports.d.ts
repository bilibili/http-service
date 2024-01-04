import type { FetchBaseURL, IFetchConfig, IFetchResponse, FetchMethod } from '@http-svc/middleware/types/fetch'
import type { IMiddlewareHandler, IHttpSvcMiddleware, IMiddlewareHandlerConfig } from '@http-svc/middleware/types/middleware'
import type { IMiddlewareContext, IHttpSvcContext, IUseAsyncRequest } from '@http-svc/middleware/types/context'

export interface IHttpServiceInit {
  baseURL?: FetchBaseURL
  fetch?: IHttpSvcMiddleware
  middlewares?: IHttpSvcMiddleware[]
}
/* ================= HttpSvcControl ================= */
/**
 * AssembleControl
 */
export interface IAssembleDispatcherWith {
  (middleware: IHttpSvcMiddleware | IMiddlewareHandler | BuiltInMiddlewareName | string, payload?: any): IAssembleDispatcher
}
export interface IAssembleDispatcherDisable {
  (name: BuiltInMiddlewareName | string): IAssembleDispatcher
}
export interface IAssembleDispatcher {
  with: IAssembleDispatcherWith
  disable: IAssembleDispatcherDisable
  request: IHttpSvcRequest
}

export interface IHttpSvcAssembleControl {
  register(middlewares: IHttpSvcMiddleware[]): void
  with: IAssembleDispatcherWith
  disable: IAssembleDispatcherDisable
  compose(middlewares?: IHttpSvcMiddleware[]): IRequestFunction
}

/**
 * ConfigControl
 */
export interface IMiddlewareContextProvider {
  inject(key: string, value: IMiddlewareHandlerConfig): IMiddlewareContextProvider
  disable(key: string): IMiddlewareContextProvider
  get(): IMiddlewareContext
}
export interface IHttpSvcConfigControl {
  provide(ctx: IMiddlewareContext): IMiddlewareContextProvider
  get(ctx: IMiddlewareContext, name: string): IMiddlewareHandlerConfig<any>
}
/**
 * RequestControl
 */

export interface IRequestFunction {
  (ctx: IHttpSvcContext): Promise<any>
}
export interface IHttpSvcControlRequest {
  (config: IFetchConfig, middlewareCtx: IMiddlewareContext, fn?: any): Promise<any>
}
export interface IHttpSvcRequestControl {
  request: IHttpSvcControlRequest
}

export interface IHttpSvcRequest {
  (config: IFetchConfig): Promise<any>
}

export interface IHttpService {
  request: IHttpSvcRequest
  with: IAssembleDispatcherWith
  disable: IAssembleDispatcherDisable
  register(middlewares: IHttpSvcMiddleware[]): void
  setFetch(fetch: IHttpSvcMiddleware): void
}

/**
 * 内置中间件相关
 */
export type BuiltInMiddleware = 'INIT_CTX' | 'TIMEOUT' | 'BODY' | 'XSRF' | 'FETCH' | 'RETRY' | 'SPRAY' | 'RES_DATA' | 'RES_EXTRACT' | 'LOG' | 'CACHE'
export type BuiltInMiddlewareName = `BUILT_IN_${BuiltInMiddleware}`

export {
  FetchBaseURL,
  IHttpSvcMiddleware,
  IMiddlewareHandler,
  IFetchConfig,
  IHttpSvcContext,
  IFetchResponse,
  IMiddlewareHandlerConfig,
  IMiddlewareContext,
  FetchMethod,
  IUseAsyncRequest
}
  