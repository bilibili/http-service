import { IMiddlewareHandler, BuiltInMiddlewareName } from '../exports';
import { HttpSvcMiddleware } from '@http-svc/middleware';
export interface IBodyPayload {
    stringify?: boolean
}
export declare class HttpSvcBody extends HttpSvcMiddleware<IBodyPayload> {
    static handler: IMiddlewareHandler<IBodyPayload>;
    name: BuiltInMiddlewareName
    constructor();
}
