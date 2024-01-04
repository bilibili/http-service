/**
 * ================================================== retry ==================================================
 */
import { HttpService, BUILT_IN_MIDDLEWARE } from '..'
import { HttpSvcTestErrorFetch } from './base'

test('测试重试', async () => {
  const times = 2
  const config = await new HttpService({
    fetch: new HttpSvcTestErrorFetch(404, '', times)
  })
    .with('DEBUG', true)
    .with(BUILT_IN_MIDDLEWARE.RETRY, { times })
    .request({ url: '//test', method: 'get' })

  expect(config.retry).toEqual(2)
})
