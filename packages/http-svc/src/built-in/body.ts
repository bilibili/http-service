import { HttpSvcMiddleware } from '@http-svc/middleware'
import { IMiddlewareHandler, BuiltInMiddlewareName, IHttpSvcContext } from 'types/exports'
import { IBodyPayload } from 'types/middlewares/body'
import { getBuiltInMiddlewareName, buildURL, getContentType, setContentType } from '../shared'

export enum ContentType {
  JSON = 'application/json',
  Form = 'application/x-www-form-urlencoded',
  FormData = 'multipart/form-data'
}

export const isEqualContentType = (target: string, current?: string) => {
  if (!current) return false
  return current.indexOf(target) > -1
}

const jsonBody = (ctx: IHttpSvcContext, data: Record<string, any>, contentType?: string) => {
  if (!ctx.request) return
  ctx.request.data = JSON.stringify(data)
  if (!ctx.request.headers) {
    const headers: Record<string, string> = {}
    setContentType(headers, ContentType.JSON)
    ctx.request.headers = headers
  } else if (!contentType) {
    setContentType(ctx.request.headers, ContentType.JSON)
  }
}

const body: IMiddlewareHandler<IBodyPayload> = async function (ctx, next, config) {
  if (!ctx.request) return next()

  const { params, headers } = ctx.request

  // 处理query到url上
  ctx.request.url = buildURL(ctx.request.url, params || {})

  // 如果是post，需要将body处理好准备请求
  if (ctx.request.data) {
    // 这些对象不处理，只处理Record
    const isContinue = Object.prototype.toString.call(ctx.request.data) !== '[object Object]'
    if (!isContinue) {
      const contentType = getContentType(headers)
      const data = ctx.request.data as Record<string, any>
      if (config?.payload?.stringify) {
        jsonBody(ctx, data, contentType)
        return await next()
      }
      if (isEqualContentType(ContentType.Form, contentType)) {
        ctx.request.data = buildURL('', data).slice(1)
      }
      if (isEqualContentType(ContentType.JSON, contentType || ContentType.JSON)) {
        jsonBody(ctx, data, contentType)
      }
      if (isEqualContentType(ContentType.FormData, contentType)) {
        const keys = Object.keys(data)
        if (keys.length) {
          ctx.request.data = keys.reduce((form, key) => {
            form.append(key, data[key])
            return form
          }, new FormData())
        }
      }
    }
  }
  return await next()
}

export class HttpSvcBody extends HttpSvcMiddleware<IBodyPayload> {
  static handler = body
  name: BuiltInMiddlewareName = getBuiltInMiddlewareName('BODY')
  constructor() {
    super(body)
  }
}
