/**
 * spray:（用作装饰的）小树枝，小花枝; （戴在身上的）一簇花
 */
import { HttpSvcMiddleware } from '@http-svc/middleware'
import { IMiddlewareHandler, BuiltInMiddlewareName } from 'types/exports'
import { getBuiltInMiddlewareName } from '../shared'

export const spray: IMiddlewareHandler = async (ctx, next) => {
  await next()
}

export class HttpSvcSprayMiddleware<T = any> extends HttpSvcMiddleware {
  static handler = spray
  name: BuiltInMiddlewareName = getBuiltInMiddlewareName('SPRAY')
  constructor(handler: IMiddlewareHandler, payload?: T) {
    super()
    // 不需要黑白名单逻辑
    this.handler = async (ctx, next) => {
      return await handler(ctx, next, { payload })
    }
  }
}
