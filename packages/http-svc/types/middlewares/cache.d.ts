import { IMiddlewareHandler, BuiltInMiddlewareName } from '../exports';
import { HttpSvcMiddleware } from '@http-svc/middleware';
/**
 * 缓存中间件
 * @param ctx
 * @param next
 * @returns
 */
interface ICacheStore {
    get: (key: string, extra?: any) => any;
    set: (key: string, value: any, extra?: any) => void;
}
/**
 * Q：为什么value 只accept 数字和字符串？
 * A：通常情况下，查询参数由数字和字符串构成（事实上数字也会变成queryString），如果是bool逻辑，也可以由数字的0|1来完成
 *
 * 在一次请求中，特征无非来源于：
 * 1. API地址（url）
 * 2. 查询参数（query/params）
 * 3. 身份（mid）
 *
 * 因此，一次查询可以通过上面这些信息组成的string key来区分。
 * 举例，如果和当前登录态有关，那么可以加上一对 mid: xxx 以特征化。
 */
interface IKeyDict {
    [props: string]: number | string;
}
interface ICachePayload {
    key?: IKeyDict | string;
    extra?: any;
    store?: ICacheStore;
}
export declare class HttpSvcCache extends HttpSvcMiddleware<ICachePayload> {
    static handler: IMiddlewareHandler<ICachePayload>;
    name: BuiltInMiddlewareName
    constructor(store: ICacheStore);
}
