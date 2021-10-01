<template>
  <h1>login</h1>
  <el-button @click="goHome">back to home</el-button>
</template>

<script>
export default {
  name: "login",
  mounted() {
    this.$request({
      method: 'get',
      url: '/login',
      data: {
        name: 'jack'
      }
    }).then((res) => {
      console.log(res)
    })
  },
  methods: {
    goHome () {
      this.$router.push('/welcome')
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>
</style>
