<template></template>

<script>

export default {
  created() {
    const account = JSON.parse(localStorage.getItem('session'))

    localStorage.removeItem('session')

    if(account.type == 'admin')  this.$router.push('/login')
    if(account.type == 'office') this.$router.push('/sucursal')
  },
};
</script>
