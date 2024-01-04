import { HttpSvcMiddleware } from '@http-svc/middleware'
import { getBuiltInMiddlewareName } from '../shared'
import type { IHttpSvcContext } from 'types/exports'
import 'cross-fetch/dist/node-polyfill'

/**
 * ================================================== debug httpsvc class ==================================================
 */
// 测试用的fetch
export class HttpSvcTestFetch extends HttpSvcMiddleware {
  handler = async (ctx, next, config) => {
    if (ctx.response) {
      return await next()
    }
    ctx.response = new Response(JSON.stringify(config?.payload || this.body), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    return await next()
  }
  name = getBuiltInMiddlewareName('FETCH')
  constructor(private body: Record<string, any>) {
    super()
  }
}

// 测试错误时的fetch
export class HttpSvcTestErrorFetch extends HttpSvcMiddleware {
  handler = async (ctx, next) => {
    if (ctx.retry === this.successTimes) {
      ctx.response = new Response(JSON.stringify({ code: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      ctx.response = new Response(null, {
        status: this.status,
        statusText: this.statusText
      })
    }
    return await next()
  }
  name = getBuiltInMiddlewareName('FETCH')
  constructor(private status: number = 404, private statusText: string = 'Not Found', private successTimes = 1) {
    super()
  }
}

export const ABORT_MSG = 'Aborted a request'

function time(seconds: number, signal: AbortSignal) {
  return new Promise((resolve, reject) => {
    let id: any = null
    const onAbort = () => {
      clearTimeout(id)
      signal.removeEventListener('abort', onAbort)
      reject(new Error(ABORT_MSG))
    }
    signal.addEventListener('abort', onAbort)
    // 模拟异步操作
    id = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve(200)
    }, seconds * 1000)
  })
}

// 测试超时用的fetch
export class HttpSvcTestTimeoutFetch extends HttpSvcMiddleware {
  handler = async (ctx: IHttpSvcContext, next) => {
    await time(this.seconds, ctx.abortController!.signal)
    ctx.response = new Response(JSON.stringify(this.body), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    return await next()
  }
  name = getBuiltInMiddlewareName('FETCH')
  constructor(private seconds = 5, private body = JSON.stringify({ code: 0, data: true })) {
    super()
  }
}
