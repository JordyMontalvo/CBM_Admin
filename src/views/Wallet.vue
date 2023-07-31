<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>Billetera Brillante</strong>
        </div>
      </div>

      <div class="container">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Origen</th>
                <th>valor</th>
                <th>Destino</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(transaction, i) in transactions">
                <th>{{ i + 1 }}</th>
                <td>{{ transaction.name }}</td>
                <td>{{ transaction.value }}</td>
                <td>{{ transaction._name }}</td>
                <td>{{ transaction.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> <br>

    </section>

  </Layout>
</template>

<script>
import Layout from '@/views/Layout'
import api    from '@/api'
import lib    from '@/lib'

export default {
  components: { Layout },
  data() {
    return{
      loading: false,
    }
  },
  created() {
    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)

    this.GET()
  },

  methods: {
    async GET() {

      this.loading = true

      // GET data
      const { data } = await api.wallet.GET(); console.log({ data })

      this.loading = false

      this.transactions = data.transactions
    },
  }
};
</script>
