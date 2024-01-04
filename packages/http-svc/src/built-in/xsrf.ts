import { HttpSvcMiddleware } from '@http-svc/middleware'
import { IMiddlewareHandler, BuiltInMiddlewareName } from 'types/exports'
import { IXsrfPayload } from 'types/middlewares/xsrf'
import { getBuiltInMiddlewareName, isNode, isRecordObj, isFormData, isObject, getCookie, setObjectValue } from '../shared'

const xsrf: IMiddlewareHandler<IXsrfPayload> = async function (ctx, next, config) {
  if (!ctx.request) return next()
  const payload: IXsrfPayload = config?.payload || { token: 'xsrf_token' }
  const { token, params, data, headers } = payload
  let xsrfValue: string | undefined
  if (params || data || headers) {
    try {
      if (!isNode) {
        xsrfValue = getCookie(token, { decode: false })
      } else {
        xsrfValue = getCookie(token, { template: ctx.request.headers?.['cookie'] || ctx.request.headers?.['Cookie'] || '_', decode: false })
      }
    } catch (error) {
      if (!isNode) {
        console.warn(error)
      }
    }
  }
  if (xsrfValue) {
    if (params) {
      setObjectValue(ctx.request, ['params', params], xsrfValue, true)
    }
    if (data) {
      if (typeof ctx.request.data === 'undefined') {
        setObjectValue(ctx.request, ['data', data], xsrfValue, true)
      } else if (isObject(ctx.request.data)) {
        if (isRecordObj(ctx.request.data)) {
          setObjectValue(ctx.request, ['data', data], xsrfValue, true)
        } else if (isFormData(ctx.request.data)) {
          ;(ctx.request.data as FormData).append(data, xsrfValue)
        }
      }
    }
    if (headers) {
      setObjectValue(ctx.request, ['headers', headers], xsrfValue, true)
    }
  }
  return await next()
}

export class HttpSvcXsrf extends HttpSvcMiddleware<IXsrfPayload> {
  static handler = xsrf
  name: BuiltInMiddlewareName = getBuiltInMiddlewareName('XSRF')
  constructor(payload?: IXsrfPayload) {
    super({
      handler: xsrf,
      payload
    })
  }
}
