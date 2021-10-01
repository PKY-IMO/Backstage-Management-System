import {createRouter, createWebHashHistory} from 'vue-router'
import Home from './../components/Home.vue'
import Login from './../components/Login.vue'
import Welcome from './../components/Welcome.vue'

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
          title: '欢迎页'
        },
        component: Welcome
      },
      {
        name: 'login',
        path: '/login',
        meta: {
          title: '注册'
        },
        component: Login
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router