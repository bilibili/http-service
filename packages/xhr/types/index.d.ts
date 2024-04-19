import type { IMiddlewareHandler } from '@http-svc/middleware/types/middleware';
import { HttpSvcMiddleware } from '@http-svc/middleware';
interface IPayload {
    onCreated?: (xhr: XMLHttpRequest) => void;
}
export declare const xhr: IMiddlewareHandler<IPayload>;
export declare class HttpSvcXhr extends HttpSvcMiddleware<IPayload> {
    static handler: IMiddlewareHandler<IPayload>;
    name: string;
    constructor();
}
export {};
