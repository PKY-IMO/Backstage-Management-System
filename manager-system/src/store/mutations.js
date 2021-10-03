/**
 * Mutations 业务层数据提交
 */

import storage from './../utils/storage'

export default {
  //state 是Vuex的状态管理state对象：将Vuex上存储并保存在localstorage
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo;
    storage.setItem('userInfo', userInfo)
  }
}