<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  created() {
    console.log('App ...')

    const path = this.$router.history.current.path ; console.log({ path })

    if(path != '/login' && path != '/sucursal' && path != '/logout') {
      console.log('validate security token ...')

      const token = localStorage.getItem('token')

      if(token != 'xTzntsznsih1jrD9nj') {
        console.log('invalid security token ...')

        this.$router.push('/logout')
      }
    }
  },
};
</script>

<style lang="stylus">

  .load
    display block
    height 16px
    width 16px
    border-radius 50%
    border solid 1.5px rgba(#aaa3a3, .5)
    border-right-color transparent
    border-bottom-color transparent
    animation 1s linear infinite rotate
    margin auto

  @keyframes rotate {
    from {
      transform rotate(0deg)
    }
    to {
      transform rotate(360deg)
    }
  }

  .row
    display flex
    .el
      flex 1
      text-align center
      margin 8px 0

</style>
