/**
 * ================================================== xsrf ==================================================
 */
import { HttpService } from '../'
import { HttpSvcTestFetch } from './base'

test('测试init ctx parse逻辑', async () => {
  const url = '//api.bilibili.com'
  const a = '1'
  const ctx = await new HttpService({
    fetch: new HttpSvcTestFetch({ code: 0 })
  })
    .with('DEBUG', true)
    .request({
      url: `${url}?a=${a}`,
      method: 'GET'
    })

  expect(ctx.request.params.a).toBe(a)
})
