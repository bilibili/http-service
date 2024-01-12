import { FetchMethod, IFetchParams, IFetchData, IFetchHeaders } from '@http-svc/middleware/types/fetch'
import { IFetchResponse } from '@http-svc/middleware/types/context'
import { IHttpService, IHttpServiceInit, IAssembleDispatcher } from 'http-svc/types/exports'
import { HttpService } from 'http-svc/types'

export type IRequestInstance = IAssembleDispatcher | IHttpService
export interface RequestChainProxy {
  (httpSvc: IHttpService): IRequestInstance
}
export type UniosPromise<T = unknown> = Promise<T>
export interface UniosAdapter {
  (config: UniosRequestConfig): UniosPromise<IFetchResponse>
}
export interface UniosRequestConfig {
  url: string
  method?: FetchMethod
  baseURL?: string
  params?: IFetchParams
  data?: IFetchData
  headers?: IFetchHeaders
  timeout?: number
  signal?: AbortSignal
  withCredentials?: boolean // true
  // `adapter` 允许自定义处理请求，这使测试更加容易。
  // 返回一个 promise 并提供一个有效的响应 （参见 lib/adapters/README.md）。
  // TODO: adapter?: UniosAdapter
  // `responseType` 表示浏览器将要响应的数据类型
  // 选项包括: 'arraybuffer', 'document', 'json', 'text', 'stream'
  // 浏览器专属：'blob'
  responseType?: 'json'
  chainProxy?: RequestChainProxy
}

export interface UniosInstance {
  service: IHttpService
  request<T>(config: UniosRequestConfig): UniosPromise<T>
  get<T = unknown>(url: string, config?: UniosRequestConfig): UniosPromise<T>
  post<T = unknown>(url: string, data?: any, config?: UniosRequestConfig): UniosPromise<T>
}

export interface UniosConfig extends IHttpServiceInit {
  timeout?: number
}

export interface UniosStatic extends UniosInstance {
  <T>(config: UniosRequestConfig): UniosPromise<T>
  create(config?: UniosConfig, cls?: typeof HttpService): UniosInstance
}

declare const Unios: UniosStatic

export { Unios as default }
