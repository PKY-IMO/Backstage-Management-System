<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎使用</div>
      <div class="title">软件开发后台管理系统</div>
      <div class="desc">- Vue3.0+ElementPlus+Node+Mongo &copy;1.0</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<script>
export default {
  name: "welcome",
  data() {
    return {

    }
  }
}
</script>

<style lang="scss"> 
  .welcome {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    .content {
      position: relative;
      bottom: 40px;
      .sub-title {
        font-size: 30px;
        line-height: 42px;
        color: #333;
      }
      .title {
        font-size: 40px;
        line-height: 62px;
        color: #409eff;
      }
      .desc {
        text-align: right;
        font-size: 14px;
        color: #999;
      }
    }
    .img {
      margin-left: 80px;
      background-image: url(./../assets/images/welcome.png);
      width: 371px;
      height: 438px;
    }
  }
</style>
