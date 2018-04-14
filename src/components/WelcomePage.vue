<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
  export default {
    name: 'WelcomePage',
    data () {
      return {
        msg: 'Welcome, click on the links to lazy-load vue-components.'
      }
    }
  }
</script>

<style scoped lang="less">
</style>