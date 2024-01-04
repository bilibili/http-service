import { IMiddlewareHandler, BuiltInMiddlewareName } from '../exports';
import { HttpSvcMiddleware } from '@http-svc/middleware';
interface IXsrfPayload {
    token: string // cookie token
    params?: string // 在params中添加的keyname
    data?: string // 在data中添加的keyname
    headers?: string // 在headers中添加的keyname
}
export declare class HttpSvcXsrf extends HttpSvcMiddleware<IXsrfPayload> {
    static handler: IMiddlewareHandler<IXsrfPayload>;
    name: BuiltInMiddlewareName
    constructor();
}
