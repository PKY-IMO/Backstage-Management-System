<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse?'fold':'unfold']">
      <!-- 系统logo -->
      <div class="logo">
        <img src="@/assets/logo.png" alt="">
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        background-color="#001529"
        :default-active="activeMenu"
        text-color="#fff"
        :collapse="isCollapse"
        router
        class="nav-menu"
      >
        <tree-menu :userMenu="userMenu"></tree-menu>
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse?'fold':'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle"><i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i></div>
          <div class="bread">
            <bread-crumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge :is-dot="noticeCount>0?true:false" class="notice">
            <i class="el-icon-bell"></i>
          </el-badge>
          <el-dropdown class="user-drop" @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">{{ userInfo.userEmail }}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from './TreeMenu.vue'
import BreadCrumb from './BreadCrumb.vue'
export default {
  name: "home",
  components: {
    TreeMenu,
    BreadCrumb
  },
  data() {
    return {
      isCollapse: false,
      userInfo: this.$store.state.userInfo,
      noticeCount: 0,
      userMenu: [],
      activeMenu: location.hash.slice(1)
    }
  },
  mounted () {
    this.getNoticeCount()
    this.getMenuList()
  },
  methods: {
    toggle () {
      this.isCollapse = !this.isCollapse
    },
    handleLogout (key) {
      if (key !== 'logout') return
      this.$store.commit('saveUserInfo', '')
      this.userInfo = null
      this.$router.push('/login')
    },
    async getNoticeCount () {
      try {
        const count = await this.$api.noticeCount()
        this.noticeCount = count
      } catch (error) {
        console.error(error)
      }
    },
    async getMenuList () {
      try {
        const list = await this.$api.getMenuList({menuState:1})
        this.userMenu = list
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    transition: width 0.5s;
    z-index: 9;
    .logo {
      height: 50px;
      display: flex;
      align-items: center;
      text-align: center;
      font-size: 18px;
      img {
        margin: 0 16px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    &.fold {
      width: 64px;
    }
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left{
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 16px;
          font-size: 18px;
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 16px;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
    }
    &.fold {
      margin-left: 64px;
    }
    &.unfold {
      margin-left: 200px;
    }
  }
}
</style>
