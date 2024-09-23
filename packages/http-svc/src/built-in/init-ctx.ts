import { IMiddlewareHandler, BuiltInMiddlewareName } from 'types/exports'
import { HttpSvcMiddleware } from '@http-svc/middleware'
import { getBuiltInMiddlewareName, parseUrl } from '../shared'

const initCtx: IMiddlewareHandler = async function (ctx, next) {
  if (!ctx.request) return next()
  const { baseURL, headers, params, data, credentials = 'include' } = ctx.config
  let url = ctx.config.url
  // 使用upper过的
  const method = ctx.request.method

  const { url: originUrl, params: originParams } = parseUrl(url)
  // 初始化url 和params
  if (originParams) {
    url = ctx.request.url = originUrl
    ctx.request.params = {
      ...originParams,
      ...(params || {})
    }
  } else {
    ctx.request.url = url
    ctx.request.params = {
      ...(params || {})
    }
  }

  if (baseURL && /^(https?:)?\/\//.test(url) === false) {
    ctx.request.url = `${baseURL}${url}`
  }

  ctx.request.headers = {
    ...(headers || {})
  }
  if (data) {
    if (typeof data === 'object') {
      if (typeof FormData !== 'undefined' && data instanceof FormData) {
        const form = new FormData()
        for (const [key, value] of data.entries()) {
          form.append(key, value)
        }
        ctx.request.data = form
      } else if (Object.keys(data)) {
        ctx.request.data = JSON.parse(JSON.stringify(data))
      }
    } else {
      ctx.request.data = data
    }
  }

  ctx.request.credentials = credentials
  return await next()
}

export class HttpSvcInitCtx extends HttpSvcMiddleware {
  static handler = initCtx
  handler = initCtx
  name: BuiltInMiddlewareName = getBuiltInMiddlewareName('INIT_CTX')
}
