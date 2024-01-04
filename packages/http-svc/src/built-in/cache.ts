import { HttpSvcMiddleware } from '@http-svc/middleware'
import { IMiddlewareHandler } from 'types/exports'
import { ICachePayload, ICacheStore, IKeyDict } from 'types/middlewares/cache'
import { getBuiltInMiddlewareName } from '../shared'
/**
 * 缓存中间件
 * @param ctx
 * @param next
 * @returns
 */

// 通过dict 获取string key
const getKeyByKeyDict = (url: string, dict: IKeyDict): string => {
  return Object.keys(dict)
    .sort()
    .reduce((k, c) => {
      k += `_${c}:${dict[c]}`
      return k
    }, `api:${url}`)
}

// 缓存handler
export const cache: IMiddlewareHandler<ICachePayload> = async (ctx, next, config) => {
  // 兜底
  if (!ctx.request || ctx.request.method !== 'GET') return await next()
  // 如果没有载荷直接跳过
  if (!config?.payload) return await next()
  const { store, extra } = config.payload
  let key = config.payload.key
  // 如果没有缓存的key以及store，则缺少缓存能力的必要条件
  if (!key || !store) return await next()
  // 如果是字典，则将字典的值排序后得到一个字符串key
  if (typeof key !== 'string') key = getKeyByKeyDict(ctx.request.url, key)
  // 获取缓存数据，extra由调用方传入，自行与传入的store进行交互（如过期逻辑等）
  const data = store.get(key, extra)
  // 如果为非空数据，则直接使用这个数据生成response
  if (data) {
    ctx.response = new Response(JSON.stringify(data), {
      status: 200,
      statusText: `Cache:${key}`
    })
    await next()
    // 如果本轮读的是缓存，那就无需二次存储了
  } else {
    await next()
    // 如果本轮没有走缓存，那么可以执行设置缓存，设置逻辑由调用方自行控制
    if (ctx.response?.data) {
      store.set(key, ctx.response.data, extra)
    }
  }
}

export class HttpSvcCache extends HttpSvcMiddleware<ICachePayload> {
  static handler = cache
  name = getBuiltInMiddlewareName('CACHE')
  constructor(store: ICacheStore) {
    super({
      handler: cache,
      payload: {
        store
      }
    })
  }
}
