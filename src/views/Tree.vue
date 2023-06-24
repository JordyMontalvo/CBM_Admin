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

        <div class="tree">
          <div class="row" v-for="row in tree">
            <div class="el" v-for="el in row">
              <div v-if="el">
                <i class="fas fa-user-tie"></i> <br>
                <small>{{ el.name }}</small> <br>
                <small><small>{{ el.id.substring(0, 5) }}</small></small>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>

  </Layout>
</template>

<script>
import Layout from '@/views/Layout'
import api from '@/api'

export default {
  components: { Layout },
  data() {
    return{
      // tree,
      // l,
      // id,
      loading: true,
      title: 'Red',
      tree: null,
    }
  },
  async created() {

    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)

    this.loading = true

    // GET data
    const { data } = await api.Tree.GET(); console.log({ data })

    this.loading = false

    // error
    // if(data.error && data.msg == 'invalid filter') this.$router.push('collects/all')

    // success
    this.tree = data.tree
  },
};
</script>
