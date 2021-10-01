<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'app',
  mounted () {
    this.$storage.setItem('name', 'pp')
    console.log(this.$storage.getItem('name'))
    this.$storage.clearAll()
  }
}
</script>


<style>
</style>
