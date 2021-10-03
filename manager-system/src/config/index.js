/**
 * 环境配置的封装
 */

const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: '/api',
    mockApi: 'https://www.fastmock.site/mock/67a7d36f636e3591f639cb523f104b05/api'
  },
  test: {
    baseApi: '//test.futurefe.com/api',
    mockApi: 'https://www.fastmock.site/mock/67a7d36f636e3591f639cb523f104b05/api'
  },
  prod: {
    baseApi: '//futurefe.com/api',
    mockApi: ''
  }
}

export default {
  env: 'dev',
  mock: false,
  namespace: 'manager',
  ...EnvConfig[env]
}