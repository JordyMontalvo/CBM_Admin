<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>{{ title }}</strong>
          <input class="input" placeholder="Buscar por nombre" v-model="search" @input="input">
        </div>
      </div>

      <div class="container">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <!-- <th>
                  <p style="display: flex">
                    Fecha <input class="input" style="margin-left: 6px;" placeholder="buscar" v-model="search" @input="input">
                  </p>
                </th> -->
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Oficina</th>
                <th>Products</th>
                <th>Precio Total</th>
                <th>Puntos</th>
                <th>Voucher</th>
                <th>Saldo</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(activation, i) in activations" v-show="activation.visible">
                <th>{{ i + 1 }}</th>
                <td>{{ activation.date | date }}</td>
                <td>
                  {{ activation.name }} {{ activation.lastName }} <br>
                  <a>{{ activation.username }}</a> <br>
                  {{ activation.phone }}
                </td>
                <td>{{ activation.office }}</td>
                <td>
                  <!-- <div> -->
                    <!-- <table>
                      <tr v-for="product in activation.products" v-if="product.quantity != 0">
                        <td style="padding: 0">{{ product.name }}</td>
                        <td style="padding: 0">&nbsp; {{ product.quantity }}</td>
                      </tr>
                    </table> -->
                    <!-- <span style="width: 136px; display: inline-block;">{{ product.name }}</span> &nbsp;
                    <span>{{ product.quantity }}</span> -->
                  <!-- </div> -->

                  <div v-for="product in activation.products" v-if="product.total">
                    {{ product.total }} {{ product.name }}
                  </div>

                </td>
                <td>
                  $ {{ activation.price }} <br>
                  <a :href=" `${INVOICE_ROOT}?id=${activation.id}` " target="_blank" style="color: gray;" v-if="activation.status == 'approved'">boleta</a>
                </td>
                <td>
                  {{ activation.points }}
                  <!-- <input v-model="activation.points" @change="change(activation)" style="width: 50px;"> -->
                </td>
                <td>
                  <a :href="activation.voucher" target="_blank">
                    <img :src="activation.voucher" style="max-height: 80px; max-width: 80px">
                  </a>
                </td>
                <td>
                  <div v-if="activation.amounts">
                    <small>no disponible: S/{{ activation.amounts[0] }}</small> <br>
                    <small>disponible: S/{{ activation.amounts[1] }}</small> <br>
                    <small>cobrar: S/{{ activation.amounts[2] }}</small> <br>
                  </div>
                </td>
                <td>
                  <!-- <span class="has-text-success" v-if="activation.status == 'approved'">
                    {{ activation.status | status }}
                  </span> -->

                  <span class="has-text-success" v-if="activation.status == 'approved'">
                    {{ activation.status | status }}
                  </span>
                  <span class="has-text-danger" v-if="activation.status == 'rejected'">
                    {{ activation.status | status }}
                  </span>

                  <i class="load" v-if="activation.sending"></i>

                  <!-- <div class="buttons" v-if="activation.status == 'pending' && !activation.sending">
                    <button class="button is-primary" @click="approve(activation)">Confirmar</button>
                  </div> -->

                  <div class="buttons" v-if="activation.status == 'pending' && !activation.sending">
                    <button class="button is-primary" @click="approve(activation)">Aprobar</button>
                    <button class="button is-danger" @click="reject(activation)">Rechazar</button>
                  </div>


                  <br>
                  <label style="cursor: pointer;">

                    <small style="color: gray;">entregado: </small>

                    <i class="fa-regular fa-square"
                       style="color: gray;"
                      v-if="!activation.delivered"
                      @click="check(activation)"></i>

                    <i class="fa-regular fa-square-check"
                       style="color: gray;"
                      v-if="activation.delivered"
                      @click="uncheck(activation)"></i>
                  </label>

                </td>
                <td v-if="activation.status == 'approved' && !activation.closed">
                  <i
                    class="fa-solid fa-xmark"
                    style="color: #ccc; cursor: pointer; margin-right: 8px;"
                    @click="revert(activation)"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </section>

  </Layout>
</template>

<script>
import Layout from '@/views/Layout'
import api    from '@/api'

const INVOICE_ROOT = process.env.VUE_APP_INVOICE_ROOT
console.log({ INVOICE_ROOT })

export default {
  components: { Layout },
  data() {
    return{
      activations: [],

      loading: true,

      title: null,

      search: null,
      
      INVOICE_ROOT,
    }
  },
  computed: {
    accounts() { return this.$store.state.accounts },
    account()  { return this.$store.state.account  },
  },
  filters: {
    status(val) {
      if(val == 'approved') return 'Aprobada'
      if(val == 'pending')  return 'Pendiente'
      if(val == 'rejected') return 'Rechazada'
    },
    date(val) {
      return new Date(val).toLocaleDateString()
      // return new Date(val).toLocaleString()
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.GET(to.params.filter); next()
  },
  created() {
    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)

    this.GET(this.$route.params.filter)
  },
  methods: {
    async GET(filter) {

      this.loading = true

      // GET data
      const { data } = await api.activations.GET({ filter, account: this.account.id }); console.log({ data })

      this.loading = false

      // error
      if(data.error && data.msg == 'invalid filter') this.$router.push('activations/all')

      // success
      this.activations = data.activations
                         .map(i => ({ ...i, sending: false, visible: true }))
                         .reverse()

      this.activations.forEach((activation) => {
        const office = this.accounts.find(x => x.id == activation.office)
        activation.office = office.name
      })

      if(filter == 'all')     this.title = 'Todas las Activaciones'
      if(filter == 'pending') this.title = 'Activaciones Pendientes'

    },
    async approve(activation) {

      if(!confirm("Desea confirmar la activación?")) return

      activation.sending = true

      const { data } = await api.activations.POST({ action: 'approve', id: activation.id })
      console.log({ data })

      activation.sending = false

      // error
      if(data.error && data.msg == 'already approved')  return activation.status = 'approved'
      if(data.error && data.msg == 'already rejected')  return affiliation.status = 'rejected'

      // success
      activation.status = 'approved'

    },
    async reject(activation) {

      if(!confirm("Desea rechazar la activación?")) return

      activation.sending = true

      const { data } = await api.activations.POST({ action: 'reject', id: activation.id })
      console.log({ data })

      activation.sending = false

      // error
      if(data.error && data.msg == 'already approved') return activation.status = 'approved'
      if(data.error && data.msg == 'already rejected') return activation.status = 'rejected'

      // success
      activation.status = 'rejected'

    },
    input() {
      console.log('input ...')
      // for(let activation of this.activations) {

      //   const date = this.$options.filters.date(activation.date)
      //   console.log({ date })

      //   if (date.includes(this.search)) {
      //     activation.visible = true
      //   }
      //   else {
      //     activation.visible = false
      //   }
      // }
      if(!this.search) return

      const words = this.search.match(/\b(\w+)\b/g)
      console.log({ words })

      for(let word of words) {
        for(let activation of this.activations) {
          if(
            activation.name.toLowerCase().includes(word.toLowerCase()) ||
            activation.lastName.toLowerCase().includes(word.toLowerCase())
            // user.country.toLowerCase().includes(word.toLowerCase()) ||
            // activation.dni.toLowerCase().includes(word.toLowerCase())
            ) {

            activation.visible = true
          }
          else {
            activation.visible = false
          }
        }
      }
    },

    async check(activation){
      // console.log('check', { activation })
      activation.delivered = true

      const { data } = await api.activations.POST({ action: 'check', id: activation.id })
    },
    async uncheck(activation){
      // console.log('uncheck', { activation })
      activation.delivered = false

      const { data } = await api.activations.POST({ action: 'uncheck', id: activation.id })
    },

    async revert(activation) {
      if(!confirm("Desea revertir la activación?")) return

      console.log('revert ...')

      const { data } = await api.activations.POST({ action: 'revert', id: activation.id })
      location.reload()
    },

    async change(activation) {
      const { data } = await api.activations.POST({ action: 'change', id: activation.id,
                                                                      points: activation.points })

    },
  }
};
</script>
