import { IMiddlewareHandler } from '@http-svc/middleware/types/middleware'
import { HttpSvcMiddleware } from '@http-svc/middleware'
export declare const serverFetch: IMiddlewareHandler
export interface IPayload {
  timeout?: number
}
export declare class HttpSvcServerFetch extends HttpSvcMiddleware<IPayload> {
  static handler: IMiddlewareHandler<IPayload>
  handler: IMiddlewareHandler<IPayload>
  name: string
}
