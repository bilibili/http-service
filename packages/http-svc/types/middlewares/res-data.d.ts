import { IMiddlewareHandler, BuiltInMiddlewareName } from '../exports';
import { HttpSvcMiddleware } from '@http-svc/middleware';
interface IResDataPayload {
    type: 'json' | 'text' | 'arrayBuffer' | 'blob' | 'formData'
}
export declare class HttpSvcResData extends HttpSvcMiddleware<IResDataPayload> {
    static handler: IMiddlewareHandler<IResDataPayload>;
    name: BuiltInMiddlewareName
    constructor();
}
