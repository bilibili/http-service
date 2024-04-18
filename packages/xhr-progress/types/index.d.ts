import type { IMiddlewareHandler } from '@http-svc/middleware/types/middleware';
import { HttpSvcMiddleware } from '@http-svc/middleware';
interface IPayload {
    onCreated?: (xhr: XMLHttpRequest) => void;
}
export declare const xhrProgress: IMiddlewareHandler<IPayload>;
export declare class HttpSvcXhrProgress extends HttpSvcMiddleware<IPayload> {
    static handler: IMiddlewareHandler<IPayload>;
    name: string;
    constructor();
}
export {};
