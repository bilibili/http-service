/**
 * ================================================== xsrf ==================================================
 */
import { HttpService, BUILT_IN_MIDDLEWARE, HttpSvcXsrf } from '..'
import { HttpSvcTestFetch } from './base'

const httpSvc = new HttpService({
  fetch: new HttpSvcTestFetch({ code: 0 }),
  middlewares: [new HttpSvcXsrf({ token: 'bili_xsrf_token' })]
})

test('测试xsrf 全局注册不使用-无影响', async () => {
  const testXsrf = 'abcdtest'
  const config = await httpSvc.with('DEBUG', true).request({
    url: '//api.bilibili.com',
    method: 'GET',
    params: {},
    headers: {
      cookie: 'bili_xsrf_token=' + testXsrf
    }
  })

  expect(config.request.params.xsrf).toBeUndefined()
})
test('测试xsrf get上加params', async () => {
  const testXsrf = 'abcdtest'
  const config = await httpSvc
    .with('DEBUG', true)
    .with(BUILT_IN_MIDDLEWARE.XSRF, { params: 'xsrf' })
    .request({
      url: '//api.bilibili.com',
      method: 'GET',
      headers: {
        cookie: 'bili_xsrf_token=' + testXsrf
      }
    })

  expect(config.request.params).toHaveProperty('xsrf')
  expect(config.request.params.xsrf).toEqual(testXsrf)
})
test('测试xsrf post 不加）', async () => {
  const testXsrf = 'abcdtest'
  const config = await httpSvc.with('DEBUG', true).request({
    url: '//api.bilibili.com',
    method: 'POST',
    data: {},
    headers: {
      cookie: 'bili_xsrf_token=' + testXsrf
    }
  })

  expect(config.request.data.xsrf).toBeUndefined()
})
test('测试xsrf post 加data', async () => {
  const testXsrf = 'abcdtest'
  const config = await httpSvc
    .with('DEBUG', true)
    .with(BUILT_IN_MIDDLEWARE.XSRF, { data: 'xsrf' })
    .request({
      url: '//api.bilibili.com',
      method: 'POST',
      data: {},
      headers: {
        cookie: 'bili_xsrf_token=' + testXsrf
      }
    })

  expect(config.request.data.xsrf).toBeUndefined()
})
test('测试xsrf post headers', async () => {
  const testXsrf = 'abcdtest'
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
        cookie: 'bili_xsrf_token=' + testXsrf
      }
    })

  expect(config.request.headers[headersKey]).toEqual(testXsrf)
})
