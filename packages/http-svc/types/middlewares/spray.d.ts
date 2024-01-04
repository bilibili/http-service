import { IMiddlewareHandler, BuiltInMiddlewareName } from '../exports';
import { HttpSvcMiddleware } from '@http-svc/middleware';

export declare class HttpSvcSprayMiddleware<T = any> extends HttpSvcMiddleware {
    static handler: IMiddlewareHandler<any>;
    name: BuiltInMiddlewareName;
    constructor(handler: IMiddlewareHandler, payload?: T);
}