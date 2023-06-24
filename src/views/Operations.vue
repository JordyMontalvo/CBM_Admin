<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>{{ title }}</strong>
        </div>
      </div>

      <div class="container">
        <iframe :src= " APP + '/login/central?path=' + path " style="width: 100%; height: 100vh;"></iframe>
      </div>
    </section>

  </Layout>
</template>

<script>
import Layout from '@/views/Layout'
import api from '@/api'

const APP = process.env.VUE_APP_APP

export default {
  components: { Layout },
  data() {
    return{
      // tree,
      // l,
      // id,
      APP,
      loading: false,
      title: 'Comprar plan',
      // office: null,
    }
  },
  computed: {
    account() { return this.$store.state.account },
    path() {
      if(this.$route.params.filter == 'plan')     return 'affiliation'
      if(this.$route.params.filter == 'products') return 'activation'
    }
  },
  async created() {

    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)

    // const op = this.$route.params.filter
    // console.log({ op })

    // this.loading = true

    // // GET data
    // const { data } = await api.stock.GET({ id: account.id }); console.log({ data })

    // this.loading = false

    // error
    // if(data.error && data.msg == 'invalid filter') this.$router.push('collects/all')

    // success
    // this.office = data.office
  },
};
</script>
