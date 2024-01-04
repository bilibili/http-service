import { IMiddlewareHandler, IFetchConfig, IFetchResponse, BuiltInMiddlewareName } from '../exports';
import { HttpSvcMiddleware } from '@http-svc/middleware';
/**
 * 重试条件判断函数，其中第二个是用于获取response的body，因为body不能二次read，在此步骤进行读取后，将一并对response.data赋值
 */
export interface IRetryCondition {
    (res: IFetchResponse): Promise<any>;
}
/**
 * 重试发起前的回调，作用是，如果重试时可以携带上次请求的部分额外参数，可以通过此回调操作请求config
 */
export interface IRetryCallback {
    (config: IFetchConfig, extra: any): IFetchConfig | Promise<IFetchConfig>;
}
/**
 * 重试载荷
 */
export interface IRetryPayload {
    times?: number;
    condition?: IRetryCondition;
    onRetry?: IRetryCallback;
    runtimeShortCircuit?: boolean;
}
/**
 * 重试中间件
 * @param ctx
 * @param next
 * @returns
 */
export declare class HttpSvcRetry extends HttpSvcMiddleware<IRetryPayload> {
    static handler: IMiddlewareHandler<IRetryPayload>;
    name: BuiltInMiddlewareName;
    handler: IMiddlewareHandler<IRetryPayload>;
}
