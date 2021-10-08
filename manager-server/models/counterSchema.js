/**
 * 维护用户ID自增表
 */
const mongoose = require('mongoose')
const userShema = mongoose.Schema({
  _id: String,
  sequence_value: Number
})


module.exports = mongoose.model("counter", userShema, "counters")// model名称， 表名称
