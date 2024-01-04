/**
 * ================================================== timeout ==================================================
 */
import { HttpService } from '..'
import { HttpSvcTestTimeoutFetch, ABORT_MSG } from './base'

// debug时注释以加速test，正式构建时请恢复
test('测试超时', async () => {
  try {
    await new HttpService({
      fetch: new HttpSvcTestTimeoutFetch()
    }).request({
      url: '//api',
      timeout: 3000
    })
  } catch (error: any) {
    expect(error?.message).toEqual(ABORT_MSG)
  }
})
