import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import request from './utils/request'
import storage from './utils/storage'
import api from './api'
import store from './store'

console.log('环境变量', import.meta.env)

const app = createApp(App)

// 自定义指令 directive 
app.directive('has', {
  beforeMount: (el, binding) => {
    // 获取按钮权限
    let userAction = storage.getItem('actionList')
    let value = binding.value
    // 判断列表中是否有对应的权限标识
    let hasPermission = userAction.includes(value)
    if (!hasPermission) {
      el.style = 'display:none'
      setTimeout(() => {
        el.parentNode.removeChild(el)
      })
    }
  }
})

app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api

app.use(router).use(store).use(ElementPlus, { size: 'small' }).mount('#app')
