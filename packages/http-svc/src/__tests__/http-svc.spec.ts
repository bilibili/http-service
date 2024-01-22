/**
 * 这里主要测试http-svc的基本功能，比如API如with，debug等
 */
import { HttpService } from '../'
import { HttpSvcTestFetch } from './base'

/**
 * ================================================== debug ctx ==================================================
 */

test('测试ctx', async () => {
  const config = await new HttpService({
    fetch: new HttpSvcTestFetch({ code: 0 })
  })
    .with('DEBUG', true)
    .request({
      url: '//api.domain.com',
      method: 'GET'
    })
  expect(config).toHaveProperty('config')
  expect(config).toHaveProperty('request')
  expect(config).toHaveProperty('response')
})

/**
 * ================================================== baseURL ==================================================
 */

test('测试baseURL path拼接逻辑', async () => {
  const baseURL = '//test-api.bilibili.com'
  const path = '/test/path'
  const config = await new HttpService({
    fetch: new HttpSvcTestFetch({ code: 0 }),
    baseURL
  })
    .with('DEBUG', true)
    .request({ url: path, method: 'get' })
  expect(config.request.url).toEqual(baseURL + path)
})

test('测试baseURL url中携带了完整的host逻辑', async () => {
  const baseURL = '//test-1.bilibili.com'
  const url = '//test-2.bilibili.com/test/path'
  const config = await new HttpService({
    fetch: new HttpSvcTestFetch({ code: 0 }),
    baseURL
  })
    .with('DEBUG', true)
    .request({ url, method: 'get' })

  expect(config.request.url).toEqual(url)
})

/**
 * ================================================== normal node get ==================================================
 */
// test('测试普通get', async () => {
//     const res = await new HttpService().request({
//         url: '//api.bilibili.com', method: 'GET'})
//     expect(res).toHaveBeenCalledWith(config);
// })

/**
 * ================================================== API:with order ==================================================
 */

const GLOBAL_NAME = 'GLOBAL'
const orderHttpSvc = new HttpService({
  fetch: new HttpSvcTestFetch({ code: 0 }),
  middlewares: [
    {
      name: GLOBAL_NAME,
      handler: async (ctx, next) => {
        await next()
        ctx.response!.data.data = GLOBAL_NAME
      }
    },
    {
      name: 'WBI_ENCODE1',
      handler: async (ctx, next) => {
        if (ctx.request?.params) {
          ctx.request.params.a = 1
        }
        await next()
      }
    }
  ]
})

test('测试with 顺序 1', async () => {
  const res = await orderHttpSvc
    .with(async (ctx, next) => {
      await next()
      ctx.response!.data.data = 'WITH'
    })
    // .with(GLOBAL_NAME)
    .request({
      url: '//api'
    })

  // 首次二测试store缓存是否正常
  expect(res.data).toEqual(GLOBAL_NAME)
})

test('测试with 顺序 2', async () => {
  const ctx = await orderHttpSvc
    .with('DEBUG', true)
    .with({
      name: 'WBI_ENCODE2',
      async handler(ctx, next) {
        if (ctx.request?.params) {
          ctx.request.params.a = 2
        }
        await next()
      }
    })
    .with('WBI_ENCODE1')
    .request({
      url: '//api',
      params: {}
    })

  expect(ctx.request.params.a).toEqual(1)
})
