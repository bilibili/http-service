/**
 * ================================================== error ==================================================
 */
import { HttpService } from '..'
import { HttpSvcTestErrorFetch } from './base'
test('测试错误抛出', async () => {
  try {
    await new HttpService({
      fetch: new HttpSvcTestErrorFetch(405)
    }).request({
      url: '//api.bilibili.com',
      method: 'GET'
    })
  } catch (error: any) {
    expect(error.code).toEqual(405)
  }
})
