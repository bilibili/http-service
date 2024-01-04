import { IMiddlewareHandler, BuiltInMiddlewareName } from 'types/exports'
import { HttpSvcMiddleware } from '@http-svc/middleware'
import { getBuiltInMiddlewareName } from '../shared'

interface ILogPayload {
  span: any
}
const log: IMiddlewareHandler<ILogPayload> = async function (ctx, next, config) {
  return await next()
}

export class HttpSvcLog extends HttpSvcMiddleware<ILogPayload> {
  static handler = log
  name: BuiltInMiddlewareName = getBuiltInMiddlewareName('LOG')
  constructor() {
    super(log)
  }
}
