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
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Oficina</th>
                <th>Plan</th>
                <th>Total</th>
                <th>Productos</th>
                <th>Voucher</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(affiliation, i) in affiliations" v-show="affiliation.visible">
                <th>{{ i + 1 }}</th>
                <td>{{ affiliation.date | date }}</td>
                <td>
                  {{ affiliation.name }} {{ affiliation.lastName }} <br>
                  <a>{{ affiliation.dni }}</a> <br>
                  {{ affiliation.phone }}
                </td>
                <td>{{ affiliation.office }}</td>
                <td>
                  {{ affiliation.plan.name }} <br>
                  ${{ affiliation.plan.amount }}
                  <a :href=" `${INVOICE_ROOT}?id=${affiliation.id}` " target="_blank" style="color: gray;" v-if="affiliation.status == 'approved'">boleta</a>
                </td>
                <td>
                  $ {{ affiliation.price }}
                  <small v-if="affiliation.remaining != null"> <br>
                    <span v-if="affiliation.amounts">
                    saldo:    ${{ affiliation.amounts[0] }} <br>
                    </span>
                    ganancia: ${{ affiliation.plan.pay }} <br>
                    cobrar:   ${{ affiliation.remaining }}
                  </small>

                  <div v-if="affiliation.amounts && affiliation.remaining == null">
                    <small>no disponible: ${{ affiliation.amounts[0] }}</small> <br>
                    <small>disponible:    ${{ affiliation.amounts[1] }}</small> <br>
                    <small>cobrar:        ${{ affiliation.amounts[2] }}</small> <br>
                  </div>

                </td>
                <td  v-if="!affiliation.products">
                    Productos:
                    <div v-for="group in affiliation.plan.products">
                      <div v-for="product in group.list" v-if="product.total">
                        {{ product.total }} {{ product.name }}
                      </div>
                    </div>
                </td>
                <td v-if="affiliation.products">
                    Productos:
                    <p v-for="product in affiliation.products" v-if="product.total > 0">
                      {{ product.total }} {{ product.name }}
                    </p>
                </td>
                <td>
                  <a :href="affiliation.voucher" target="_blank">
                    <img :src="affiliation.voucher" style="max-height: 80px; max-width: 80px">
                  </a>
                </td>
                <td>

                  <span class="has-text-success" v-if="affiliation.status == 'approved'">
                    {{ affiliation.status | status }}
                  </span>
                  <span class="has-text-danger" v-if="affiliation.status == 'rejected'">
                    {{ affiliation.status | status }}
                  </span>

                  <i class="load" v-if="affiliation.sending"></i>

                  <div class="buttons" v-if="affiliation.status == 'pending' && !affiliation.sending && !sending">
                    <button class="button is-primary" @click="approve(affiliation)">Aprobar</button>
                    <button class="button is-danger" @click="reject(affiliation)">Rechazar</button>
                  </div>

                  <br>
                  <label style="cursor: pointer;">

                    <small style="color: gray;">entregado: </small>

                    <i class="fa-regular fa-square"
                       style="color: gray;"
                      v-if="!affiliation.delivered"
                      @click="check(affiliation)"></i>

                    <i class="fa-regular fa-square-check"
                       style="color: gray;"
                      v-if="affiliation.delivered"
                      @click="uncheck(affiliation)"></i>
                  </label>


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
      affiliations: [],

      loading: true,
      sending: false,

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
    branch(val) {
      if(val == -1) return 'Automático'
      if(val == 0) return '1'
      if(val == 1) return '2'
      if(val == 2) return '3'
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
      const { data } = await api.affiliations.GET({ filter, account: this.account.id }); console.log({ data })

      this.loading = false

      // error
      if(data.error && data.msg == 'invalid filter') this.$router.push('affiliations/all')

      // success
      this.affiliations = data.affiliations
                           .map(i => ({ ...i, sending: false, visible: true }))
                           .reverse()

      this.affiliations.forEach((affiliation) => {
        const office = this.accounts.find(x => x.id == affiliation.office)
        affiliation.office = office ? office.name : ''
      })

      if(filter == 'all')     this.title = 'Todas las Afiliaciones'
      if(filter == 'pending') this.title = 'Afiliaciones Pendientes'

    },
    async approve(affiliation) {

      if(!confirm("Desea aprovar la afiliación?")) return

      this.sending = true
      affiliation.sending = true

      let { data } = await api.affiliations.POST({ action: 'approve', id: affiliation.id })
      console.log({ data })

      affiliation.sending = false
      this.sending = false

      // error
      if(data.error && data.msg == 'already approved')  return affiliation.status = 'approved'
      if(data.error && data.msg == 'already rejected')  return affiliation.status = 'rejected'
      if(data.error && data.msg == 'token unavailable') return alert('No hay tokens disponibles')


      // data = await api.affiliations.POST({ action: 'approve2', id: affiliation.id })
      // console.log({ data })

      // data = await api.affiliations.POST({ action: 'approve3', id: affiliation.id })
      // console.log({ data })



      // success
      affiliation.status = 'approved'

    },
    async reject(affiliation) {

      if(!confirm("Desea rechazar la afiliación?")) return
      
      this.sending = true
      affiliation.sending = true

      const { data } = await api.affiliations.POST({ action: 'reject', id: affiliation.id })
      console.log({ data })

      affiliation.sending = false
      this.sending = false

      // error
      if(data.error && data.msg == 'already approved') return affiliation.status = 'approved'
      if(data.error && data.msg == 'already rejected') return affiliation.status = 'rejected'

      // success
      affiliation.status = 'rejected'

    },
    input() {
      console.log('input ...')
      // for(let affiliation of this.affiliations) {

      //   const date = this.$options.filters.date(affiliation.date)
      //   console.log({ date })

      //   if (date.includes(this.search)) {
      //     affiliation.visible = true
      //   }
      //   else {
      //     affiliation.visible = false
      //   }
      // }
      if(!this.search) return

      const words = this.search.match(/\b(\w+)\b/g)
      console.log({ words })

      for(let word of words) {
        for(let affiliation of this.affiliations) {
          if(
            affiliation.name.toLowerCase().includes(word.toLowerCase()) ||
            affiliation.lastName.toLowerCase().includes(word.toLowerCase()) ||
            // user.country.toLowerCase().includes(word.toLowerCase()) ||
            affiliation.dni.toLowerCase().includes(word.toLowerCase())) {

            affiliation.visible = true
          }
          else {
            affiliation.visible = false
          }
        }
      }
    },

    async check(affiliation){
      // console.log('check', { affiliation })
      affiliation.delivered = true

      const { data } = await api.affiliations.POST({ action: 'check', id: affiliation.id })
    },
    async uncheck(affiliation){
      // console.log('uncheck', { affiliation })
      affiliation.delivered = false

      const { data } = await api.affiliations.POST({ action: 'uncheck', id: affiliation.id })
    },
  }
};
</script>
