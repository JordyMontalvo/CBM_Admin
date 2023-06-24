<template></template>

<script>

export default {
  created() {
    localStorage.removeItem('session')
    this.$router.push('/login')
  },
};
</script>
