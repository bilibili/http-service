import { IMiddlewareHandler, BuiltInMiddlewareName } from 'types/exports'
import { HttpSvcMiddleware } from '@http-svc/middleware'
import { getBuiltInMiddlewareName, isNode } from '../shared'

// AbortController Polyfill for Node.JS based on EventEmitter for Node v14.6.x and below.

// Are you using Node 14.7.0 or above? You don't need this! Node has AbortController and AbortSignal as builtin globals.
// In Node versions >=14.7.0 and <15.4.0 you can access the experimental implementation using --experimental-abortcontroller.
const timeout: IMiddlewareHandler = async function (ctx, next) {
  let ms = ctx.config.timeout
  if (typeof ctx.config.timeout !== 'number') {
    ms = isNode ? 350 : 10000
  }
  if (!ctx.abortController && ms) {
    const abortController = new AbortController()
    ctx.abortController = abortController
    ctx.timeoutId = setTimeout(() => {
      abortController.abort()
    }, ms)
    await next()
    clearTimeout(ctx.timeoutId)
  } else {
    await next()
  }
}

export class HttpSvcTimeout extends HttpSvcMiddleware {
  static handler = timeout
  name: BuiltInMiddlewareName = getBuiltInMiddlewareName('TIMEOUT')
  constructor() {
    super(timeout)
  }
}
