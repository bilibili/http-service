import { HttpSvcMiddleware } from '@http-svc/middleware'
import { IMiddlewareHandler, BuiltInMiddlewareName } from 'types/exports'
import { IResDataPayload } from 'types/middlewares/res-data'
import { getBuiltInMiddlewareName } from '../shared'
/**
 * 读response 的 data。
 * 一个可以绕过的中间件（在其前对response.data赋值即可绕过）
 * @param ctx
 * @param next
 * @returns
 */
export const resData: IMiddlewareHandler<IResDataPayload> = async function (ctx, next, config) {
  await next()
  if (ctx.response?.ok) {
    if (typeof ctx.response.data === 'undefined') {
      try {
        const responseType = config?.payload?.type || 'json'
        ctx.response.data = await ctx.response[responseType]()
      } catch (error) {
        console.warn(error)
      }
    }
  }
}

export class HttpSvcResData extends HttpSvcMiddleware<IResDataPayload> {
  static handler = resData
  name: BuiltInMiddlewareName = getBuiltInMiddlewareName('RES_DATA')
  constructor() {
    super(resData)
  }
}
