import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '@/components/Home.vue'

const routes = [
  {
    name: 'home',
    path: '/',
    meta: {
      title: '首页'
    },
    redirect: '/welcome',
    component: Home,
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎使用系统'
        },
        component: () => import('@/views/Welcome.vue')
      },
      {
        name: 'user',
        path: 'user',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/views/User.vue'),
      }
    ]
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router