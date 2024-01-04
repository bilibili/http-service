/**
 * ================================================== xsrf ==================================================
 */
import { HttpService, BUILT_IN_MIDDLEWARE, HttpSvcXsrf } from '..'
import { HttpSvcTestFetch } from './base'

const httpSvc = new HttpService({
  fetch: new HttpSvcTestFetch({ code: 0 }),
  middlewares: [new HttpSvcXsrf({ token: 'bili_jct' })]
})

test('测试xsrf 全局注册不使用-无影响', async () => {
  const testCsrf = 'abcdtest'
  const config = await httpSvc.with('DEBUG', true).request({
    url: '//api.bilibili.com',
    method: 'GET',
    params: {},
    headers: {
      cookie: 'bili_jct=' + testCsrf
    }
  })

  expect(config.request.params.csrf).toBeUndefined()
})
test('测试xsrf get上加params', async () => {
  const testCsrf = 'abcdtest'
  const config = await httpSvc
    .with('DEBUG', true)
    .with(BUILT_IN_MIDDLEWARE.XSRF, { params: 'csrf' })
    .request({
      url: '//api.bilibili.com',
      method: 'GET',
      headers: {
        cookie: 'bili_jct=' + testCsrf
      }
    })

  expect(config.request.params).toHaveProperty('csrf')
  expect(config.request.params.csrf).toEqual(testCsrf)
})
test('测试xsrf post 不加）', async () => {
  const testCsrf = 'abcdtest'
  const config = await httpSvc.with('DEBUG', true).request({
    url: '//api.bilibili.com',
    method: 'POST',
    data: {},
    headers: {
      cookie: 'bili_jct=' + testCsrf
    }
  })

  expect(config.request.data.csrf).toBeUndefined()
})
test('测试xsrf post 加data', async () => {
  const testCsrf = 'abcdtest'
  const config = await httpSvc
    .with('DEBUG', true)
    .with(BUILT_IN_MIDDLEWARE.XSRF, { data: 'csrf' })
    .request({
      url: '//api.bilibili.com',
      method: 'POST',
      data: {},
      headers: {
        cookie: 'bili_jct=' + testCsrf
      }
    })

  expect(config.request.data.csrf).toBeUndefined()
})
test('测试xsrf post headers', async () => {
  const testCsrf = 'abcdtest'
  const headersKey = 'X-XSRF-TOKEN'
  const config = await httpSvc
    .with('DEBUG', true)
    .with(BUILT_IN_MIDDLEWARE.XSRF, { headers: headersKey })
    .disable(BUILT_IN_MIDDLEWARE.BODY)
    .request({
      url: '//api.bilibili.com',
      method: 'POST',
      data: {},
      headers: {
        cookie: 'bili_jct=' + testCsrf
      }
    })

  expect(config.request.headers[headersKey]).toEqual(testCsrf)
})
