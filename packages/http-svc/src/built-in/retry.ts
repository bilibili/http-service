import { HttpSvcMiddleware } from '@http-svc/middleware'
import { IMiddlewareHandler } from 'types/exports'
import { IRetryPayload } from 'types/middlewares/retry'
import { createError, getBuiltInMiddlewareName } from '../shared'

/**
 * 重试中间件
 * @param ctx
 * @param next
 * @returns
 */

/**
 * 重试中间件
 * @param ctx
 * @param next
 * @returns
 */

export const retry: IMiddlewareHandler<IRetryPayload> = async (ctx, next, config) => {
  const requestFn = ctx.request?.function
  const { times, condition, onRetry } = config?.payload || { times: 0 }
  // 是否已经重试完毕（次数用尽）
  const isDone = () => {
    return !times || ctx.retry === times
  }
  // 进行重试的方法
  const doRetry = async (extra?: any) => {
    if (!requestFn) {
      throw createError(ctx, 'Missing request function')
    }
    if (isDone() && !config?.payload?.runtimeShortCircuit) {
      throw createError(ctx)
    }
    ctx.retry = ctx.retry ? ctx.retry + 1 : 1

    try {
      if (onRetry) {
        const newConfig = await onRetry(ctx.config, extra)
        if (newConfig) {
          ctx.config = newConfig
        }
      }
      if (ctx.response) delete ctx.response
      await requestFn(ctx)
    } catch (error: any) {
      throw createError(ctx, error.message)
    }
  }
  try {
    await next()
  } catch (error: any) {
    // 请求本身的错误
    if (isDone()) {
      throw createError(ctx, error?.message)
    }
    await doRetry()
    return
  }

  // 有条件函数，则调用函数，和上面不能放在一起
  if (condition) {
    // 如果命中条件
    const isMeetTheCondition = await condition(ctx.response!)
    // 命中就执行重试
    if (isMeetTheCondition) {
      await doRetry(isMeetTheCondition)
      return
    }
  }
  // 无响应或者响应不ok
  if (!ctx.response || !ctx.response.ok) {
    await doRetry()
  }
}

export class HttpSvcRetry extends HttpSvcMiddleware<IRetryPayload> {
  static handler = retry
  name = getBuiltInMiddlewareName('RETRY')
  handler = retry
}
