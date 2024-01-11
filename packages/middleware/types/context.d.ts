import { IFetchConfig, FetchBaseURL, FetchMethod, IFetchParams, IFetchData, IFetchHeaders } from './fetch'
import { IMiddlewareHandlerConfig, IHttpSvcMiddleware, IMiddlewareHandler } from './middleware'
export interface IFetchRequest {
  url: string
  params?: IFetchParams
  data?: IFetchData
  method: FetchMethod
  headers?: IFetchHeaders
  credentials?: RequestCredentials
  function?: IRequestFunction
}
export interface IFetchResponse extends Response {
  data?: any
}
export interface IMiddlewareContext {
  [name: string]: IMiddlewareHandlerConfig<any>
}

export interface IUseAsyncRequest {
  (asyncRequest: <T = unknown>(request: IHttpSvcRequest) => Promise<T>, config?: IHttpServiceInit): void
}

export interface IHttpSvcContext {
  abortController?: AbortController
  useAsyncRequest: IUseAsyncRequest
  timeoutId?: ReturnType<typeof setTimeout>
  retry?: number
  response?: IFetchResponse
  request?: IFetchRequest
  config: IFetchConfig
  middleware: IMiddlewareContext
}