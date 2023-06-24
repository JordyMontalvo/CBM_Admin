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
        <table class="table">
          <tbody>
            <tr v-for="(product, i) in office.products">
              <th>{{ i + 1 }}</th>
              <td>{{ product.name }}</td>
              <td>{{ product.total }}</td>
            </tr>
          </tbody>
        </table>
      </div> <br>

      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>Ganancias: {{ office.profit }}</strong>
        </div>
      </div> <br>

      <div class="container">

        <div class="field">
          <label class="label">Retirar</label>
          <div class="control has-icons-left has-icons-right">
            <input class="input" @keydown="reset"
              placeholder="Monto en $" v-model.number="amount">
            <span class="icon is-small is-left">
              <i class="fa-solid fa-money-bill"></i>
            </span>
          </div>
        </div>

        <p v-if="success" class="help is-success">Retiro enviado</p>
        <p v-if="error"   class="help is-danger"> Retiro inválido</p>


        <div class="control">
          <button class="button is-link" @click="collect" :disabled="sending">Enviar Retiro</button>
        </div>

      </div> <br><br>

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
      loading: null,
      title: 'Stock de procuctos',
      office: null,

      amount: null,
      success: false,
      error: false,

      sending: false,
    }
  },
  computed: {
    account() { return this.$store.state.account },
  },
  async created() {

    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)

    this.loading = true

    // // GET data
    const { data } = await api.stock.GET({ id: account.id }); console.log({ data })

    this.loading = false

    // error
    // if(data.error && data.msg == 'invalid filter') this.$router.push('collects/all')

    // success
    this.office = data.office
  },
  methods: {
    reset() {
      console.log('reset ...')
      this.error = false
    },
    async collect() {
      console.log('collect ...', this.amount)
      if(!this.amount || this.amount ==0 || this.amount > this.office.profit) {

        this.error = true

        return
      }

      this.sending = true

      const { data } = await api.stock.POST({ id: this.office.id, amount: this.amount }); console.log({ data })

      console.log('valid amount ...')

      this.sending = false

      this.success = true

      this.office.profit = this.office.profit - this.amount

    },
  }
};
</script>
