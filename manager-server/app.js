const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// 调用方法
const router = require('koa-router')()


const users = require('./routes/users')
const log4js = require('./utils/log4j')

// error handler
onerror(app)

// 连接数据库
require('./config/db')

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  await next()
  log4js.info(`params:${ctx.request.query || ctx.request.body}`)
})

router.prefix('/api')

// routes
router.use(users.routes(), users.allowedMethods())

// app 加载全局路由
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`)
  console.error('server error', err, ctx)
});

module.exports = app
