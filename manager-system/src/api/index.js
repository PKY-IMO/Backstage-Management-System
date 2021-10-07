/**
 * api管理
 */

import request from './../utils/request'
export default {
  login (params) {
    return request({
      url: '/users/login',
      method: 'post',
      data: params
    })
  },
  noticeCount (params) {
    return request({
      url:'/leave/count',
      method: 'get',
      data: {},
      mock: true
    })
  },
  menuList (params) {
    return request({
      url:'/menu/list',
      method: 'get',
      data: {},
      mock: true
    })
  },
  getUserList (params) {
    return request({
      url:'/users/list',
      method: 'get',
      data: params,
      mock: true
    })
  },
  deleteUser (params) {
    return request({
      url:'/users/delete',
      method: 'post',
      data: params,
      mock: true
    })
  },
  getDeptList () {
    return request({
      url:'/dept/list',
      method: 'get',
      data: {},
      mock: true
    })
  },
  getRoleList () {
    return request({
      url:'/roles/list',
      method: 'get',
      data: {},
      mock: true
    })
  },
  operateUser (params) {
    return request({
      url:'/users/operate',
      method: 'post',
      data: params,
      mock: true
    })
  }
}