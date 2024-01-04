import { IMiddlewareHandler, BuiltInMiddlewareName } from 'types/exports'
import { HttpSvcMiddleware } from '@http-svc/middleware'
import { getBuiltInMiddlewareName, isNode } from '../shared'
/**
 * 客户端fetch（window.fetch）
 * @param ctx
 * @param next
 * @returns
 */
export const fetch: IMiddlewareHandler = async (ctx, next) => {
  if (isNode) {
    throw new Error('When you are in a Node environment, please use server-side fetch middleware.')
  }
  if (!window.fetch) {
    throw new Error('When you are in a non-modern browser, please manually polyfill fetch.')
  }
  if (!ctx.request) return await next()
  if (ctx.response) return await next()
  const { url, method, headers, credentials } = ctx.request
  const body = ctx.request.data as BodyInit | undefined

  ctx.response = await window.fetch(url, {
    method,
    body,
    headers,
    credentials,
    signal: ctx.abortController?.signal
  })

  return await next()
}

export class HttpSvcFetch extends HttpSvcMiddleware {
  static handler = fetch
  handler = fetch
  name: BuiltInMiddlewareName = getBuiltInMiddlewareName('FETCH')
}
