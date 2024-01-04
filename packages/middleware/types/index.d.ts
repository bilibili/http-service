import type { IHttpSvcMiddleware, IMiddlewareHandler, IHttpSvcMiddlewareInitConfig, IMiddlewareHandlerConfig } from './middleware';
export declare abstract class HttpSvcMiddleware<T = unknown> implements IHttpSvcMiddleware<T> {
    static handler: IMiddlewareHandler;
    static mergeConfig: (config?: IMiddlewareHandlerConfig, payload?: any) => IMiddlewareHandlerConfig;
    abstract name: string;
    handler: IMiddlewareHandler<T>;
    constructor(handlerOrConfig?: IMiddlewareHandler | IHttpSvcMiddlewareInitConfig);
}
