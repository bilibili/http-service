/**
 * ================================================== cache ==================================================
 */
import { HttpService, BUILT_IN_MIDDLEWARE, HttpSvcCache } from '../'
import { HttpSvcTestFetch } from './base'
const cacheStore = {
  state: {},
  get(key) {
    return this.state[key]
  },
  set(key, value, extra) {
    // 这里extra 我定义为多少毫秒后过期
    if (typeof extra === 'number') {
      setTimeout(() => {
        this.remove(key)
      }, extra)
    }
    this.state[key] = value
  },
  remove(key) {
    delete this.state[key]
  }
}

const cacheHttpSvc = new HttpService({
  fetch: new HttpSvcTestFetch({ code: 0 }),
  middlewares: [new HttpSvcCache(cacheStore)]
})

const cacheKey = 'test'
const cacheData = { code: 1 }

test('测试缓存 set', async () => {
  const res = await cacheHttpSvc
    .with(BUILT_IN_MIDDLEWARE.CACHE, {
      key: cacheKey,
      extra: 2000
    })
    .with(BUILT_IN_MIDDLEWARE.FETCH, cacheData)
    .request({
      url: '//api'
    })

  // 测试 fetch payload
  expect(res.code).toEqual(cacheData.code)
  // 测试缓存对象是否正常
  expect(cacheStore.get(cacheKey)).toEqual(cacheData)
  // 首次请求测试store缓存是否正常
  expect(cacheStore.get(cacheKey).code).toEqual(res.code)
})

test('测试缓存 get immediately', async () => {
  const res = await cacheHttpSvc
    .with(BUILT_IN_MIDDLEWARE.CACHE, {
      key: cacheKey
    })
    .with(BUILT_IN_MIDDLEWARE.FETCH, { code: 2 })
    .request({
      url: '//api'
    })

  // 首次二测试store缓存是否正常
  expect(res.code).toEqual(cacheData.code)
})

test('测试缓存 get key miss', async () => {
  const res = await cacheHttpSvc
    .with(BUILT_IN_MIDDLEWARE.CACHE, {
      key: cacheKey + '2'
    })
    .with(BUILT_IN_MIDDLEWARE.FETCH, { code: 2 })
    .request({
      url: '//api'
    })

  // 测试不同缓存key的匹配逻辑
  expect(res.code).toEqual(2)
})

test('测试缓存 get 3s later', async () => {
  await new Promise((r) => {
    setTimeout(() => {
      r(true)
    }, 3000)
  })
  const res = await cacheHttpSvc
    .with(BUILT_IN_MIDDLEWARE.CACHE, {
      key: cacheKey
    })
    .with(BUILT_IN_MIDDLEWARE.FETCH, { code: 2 })
    .request({
      url: '//api'
    })

  // 首次二测试store缓存是否正常
  expect(res.code).toEqual(2)
})
