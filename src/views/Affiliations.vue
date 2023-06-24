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
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <!-- <th style="display: flex">
                  Fecha <input class="input" style="margin-left: 6px;" placeholder="buscar" v-model="search" @input="input">
                </th> -->
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Oficina</th>
                <th>Plan</th>
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
                  $ {{ affiliation.plan.amount }}
                </td>
                <td style="min-width: 200px;">
                    Productos:
                    <div v-for="group in affiliation.plan.products">
                      <div v-for="product in group.list" v-if="product.total">
                        {{ product.total }} {{ product.name }}
                      </div>
                    </div>
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

export default {
  components: { Layout },
  data() {
    return{
      affiliations: [],

      loading: true,
      sending: false,

      title: null,

      search: null,
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
        affiliation.office = office.name
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
      for(let affiliation of this.affiliations) {

        const date = this.$options.filters.date(affiliation.date)
        console.log({ date })

        if (date.includes(this.search)) {
          affiliation.visible = true
        }
        else {
          affiliation.visible = false
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
