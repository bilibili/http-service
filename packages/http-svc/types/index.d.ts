import { FetchBaseURL, IHttpService, BuiltInMiddleware, BuiltInMiddlewareName, IHttpServiceInit, IHttpSvcMiddleware, IFetchConfig, IAssembleDispatcher, IMiddlewareHandler } from './exports'
import { HttpSvcCache } from './middlewares/cache'
import { HttpSvcRetry } from './middlewares/retry'
import { HttpSvcSprayMiddleware } from './middlewares/spray'
import { HttpSvcXsrf } from './middlewares/xsrf'

declare class HttpService implements IHttpService {
    fetch: IHttpSvcMiddleware | undefined;
    assembleCtrl: any;
    configCtrl: any;
    requestCtrl: any;
    baseURL: FetchBaseURL;
    /**
     * 初始化
     * @param initConfig 初始配置，参考interface
     */
    constructor(initConfig?: IHttpServiceInit | IHttpSvcMiddleware[]);
    register(middlewares: IHttpSvcMiddleware[]): void;
    request(config: IFetchConfig): Promise<any>;
    disable(middlewareName: BuiltInMiddlewareName | string): IAssembleDispatcher;
    with(middleware: IHttpSvcMiddleware | IMiddlewareHandler | BuiltInMiddlewareName | string, payload?: any): IAssembleDispatcher;
    setFetch(fetch: IHttpSvcMiddleware): void;
    create(config?: IHttpServiceInit): IHttpService;
}

declare const BUILT_IN_MIDDLEWARE: Record<BuiltInMiddleware, BuiltInMiddlewareName>;

export {
    HttpService,
    BUILT_IN_MIDDLEWARE,
}
export {
    HttpSvcCache,
    HttpSvcRetry,
    HttpSvcSprayMiddleware,
    HttpSvcXsrf
}
