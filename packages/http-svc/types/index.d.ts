import { IHttpService, BuiltInMiddleware, BuiltInMiddlewareName } from './exports'
import { HttpSvcCache } from './middlewares/cache'
import { HttpSvcRetry } from './middlewares/retry'
import { HttpSvcSprayMiddleware } from './middlewares/spray'
import { HttpSvcXsrf } from './middlewares/xsrf'

declare const HttpService: IHttpService
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
