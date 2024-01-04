/**
 * ================================================== spray ==================================================
 */
import { HttpService, HttpSvcSprayMiddleware } from '../'
import { HttpSvcTestFetch } from './base'
test('测试spray中间件 对request添加params', async () => {
  const testParams = {
    test: 1
  }
  const config = await new HttpService({
    fetch: new HttpSvcTestFetch({ code: 0 })
  })
    .with('DEBUG', true)
    .with(
      new HttpSvcSprayMiddleware(async function (ctx, next) {
        ctx.request!.params = testParams
        return await next()
      })
    )
    .request({ url: '//test', method: 'get' })
  expect(config.request.params).toEqual(testParams)
  expect(config.request.url).toContain('test=1')
})
