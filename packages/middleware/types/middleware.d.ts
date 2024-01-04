import { IHttpSvcContext } from './context'
export interface IMiddlewareHandlerConfig<T = any> {
  disabled?: boolean
  payload?: T
  [propName: string]: any
}
export interface IMiddlewareHandler<T = any> {
  (ctx: IHttpSvcContext, next: () => Promise<unknown>, config?: IMiddlewareHandlerConfig<T>): any
}
export interface IHttpSvcMiddleware<T = any> {
  name: string
  handler: IMiddlewareHandler<T>
}
export interface IHttpSvcMiddlewareInitConfig {
  handler?: IMiddlewareHandler
  payload?: any
}
