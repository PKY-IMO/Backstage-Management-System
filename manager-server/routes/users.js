/**
 * 用户管理模块
 */
const router = require('koa-router')()
const User = require('./../models/userSchema')
const util = require('./../utils/util')
const jwt = require('jsonwebtoken')

router.prefix('/users')

router.post('/login', async function (ctx, next) {
  try {
    const { userName, userPwd } = ctx.request.body
    const res = await User.findOne({
      userName,
      userPwd
    })
    if (res) {
      // mongoose操作的结果集docs若想要改变其结构就需要通过改变它的_doc属性
      const data = res._doc
      const token = jwt.sign({
        data: data
      }, 'imooc',  { expiresIn: 30 })
      data.token = token 
      ctx.body = util.success(data)
    } else {
      ctx.body = util.fail('帐号或密码错误')
    }  
  } catch (error) {
    ctx.body = util.fail(error.msg)
  }
})

module.exports = router
