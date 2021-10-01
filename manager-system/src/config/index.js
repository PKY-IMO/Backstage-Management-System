/**
 * 环境配置的封装
 */

const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: '/',
    mockApi: ''
  },
  test: {
    baseApi: '//test.futurefe.com/api',
    mockApi: ''
  },
  prod: {
    baseApi: '//futurefe.com/api',
    mockApi: ''
  }
}

export default {
  env: 'dev',
  mock: true,
  ...EnvConfig[env]
}