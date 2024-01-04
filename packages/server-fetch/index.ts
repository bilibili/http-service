import type { IMiddlewareHandler } from '@http-svc/middleware/types/middleware'
import type { IFetchResponse } from '@http-svc/middleware/types/context'
import { HttpSvcMiddleware } from '@http-svc/middleware'
import fetch, { BodyInit } from 'node-fetch'

let nodeFetch = fetch
if (typeof fetch === 'object' && fetch.default) {
  nodeFetch = fetch.default
}

// 降级timeout处理
function doTimeout<T = unknown>(promise: Promise<T>, timeout: number): Promise<T> {
  return new Promise((resolve, reject) => {
    let flag = false
    setTimeout(() => {
      if (flag) return
      flag = true
      reject(new Error('The request is aborted by user.'))
    }, timeout)
    promise
      .then((res) => {
        if (flag) return
        flag = true
        resolve(res)
      })
      .catch((err) => {
        if (flag) return
        flag = true
        reject(err)
      })
  })
}
export const serverFetch: IMiddlewareHandler = async (ctx, next) => {
  if (!ctx.request) return await next()
  if (ctx.response) return await next()
  const { method, headers, data } = ctx.request
  let url = ctx.request.url
  if (url.startsWith('//')) {
    url = `http:${url}`
  }
  const promise = nodeFetch(url, {
    method,
    body: data as BodyInit,
    headers,
    signal: ctx.abortController?.signal
  })

  let response: IFetchResponse | null = null

  if (typeof AbortController === 'undefined') {
    const timeout = ctx.config.timeout ?? 350
    response = await doTimeout<IFetchResponse>(promise, timeout)
  } else {
    response = await promise
  }

  Object.defineProperty(response, 'data', {
    writable: true,
    enumerable: true
  })
  ctx.response = response as IFetchResponse

  return await next()
}

export class HttpSvcServerFetch extends HttpSvcMiddleware {
  static handler = serverFetch
  handler = serverFetch
  name = 'SERVER_FETCH'
}
