import Koa from 'koa'
import Router from 'koa-router'
import bodyParser, { HttpMethodEnum } from 'koa-body'
import cors from '@koa/cors'
const app = new Koa()
const router = new Router()

app.use(
  bodyParser({
    parsedMethods: [HttpMethodEnum.POST, HttpMethodEnum.PUT, HttpMethodEnum.DELETE]
  })
)
app.use(
  cors({
    origin: 'http://localhost',
    credentials: true
  })
)

// 创建 GET 接口
router.get('/get', (ctx) => {
  console.log('get:', ctx.request.url) // 打印请求体
  ctx.body = { message: 'GET 请求成功' }
})
// 创建 GET 接口
router.post('/post', (ctx) => {
  console.log('post:', ctx.request.body) // 打印请求体
  ctx.body = { message: 'POST 请求成功' }
})
// 创建 DELETE 接口
router.delete('/delete', (ctx) => {
  console.log('delete:', ctx.request.body) // 打印请求体
  ctx.body = { message: 'DELETE 请求成功' }
})
// 创建 PUT 接口
router.put('/put', (ctx) => {
  console.log('put:', ctx.request.body) // 打印请求体
  ctx.body = { message: 'PUT 请求成功' }
})

app.use(router.routes()).use(router.allowedMethods())

// 监听 3333 端口
app.listen(3333, () => {
  console.log('Server is running on port 3000')
})
