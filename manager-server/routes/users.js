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
    /**
     * 返回数据库指定字段，有三种方式
     * 1. 'userId userName userEmail state role deptId roleList'
     * 2. {userId:1,_id:0}
     * 3. select('userId')
     */
    const res = await User.findOne({
      userName,
      userPwd
    }, 'userId userName userEmail state role deptId roleList')
    if (res) {
      /**
       * 登录时用获取到的数据生成token 头部.负载.签名
       */
      // mongoose操作的结果集docs若想要改变其结构就需要通过改变它的_doc属性
      const data = res._doc
      const token = jwt.sign({
        data: data
      }, 'imooc',  { expiresIn: '1h' }) // 数字类型代表秒，字符串类型就是具体时间
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
