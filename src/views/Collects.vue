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
                <!-- <th>
                  <p style="display: flex">
                    Fecha <input class="input" style="margin-left: 6px;" placeholder="buscar" v-model="search" @input="input">
                  </p>
                </th> -->
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Cuenta</th>
                <th>Monto</th>
                <th>Oficina</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(collect, i) in collects" v-show="collect.visible">
                <th>{{ i + 1 }}</th>
                <td>{{ collect.date | date }}</td>
                <td>
                  {{ collect.name }} {{ collect.lastName }}<br>
                  <a>{{ collect.username }}</a> <br>
                  {{ collect.phone }}
                </td>
                <td>
                  <div v-if="!collect.cash">
                    En efectivo
                  </div>
                  <div v-else>
                    <small>Banco:</small> {{ collect.bank }} <br>
                    <small>Número de cuenta:</small> {{ collect.account }} <br>
                    <!-- <small>Código interbancario:</small> {{ collect.ibk }} -->
                    <small>Tipo de cuenta:</small> {{ collect.account_type }}
                  </div>
                </td>
                <td>
                  $ {{ collect.amount }}
                </td>
                <td>
                  {{ collect.office }}
                </td>
                <td>
                  <span class="has-text-success" v-if="collect.status == 'approved'">
                    {{ collect.status | status }}
                  </span>

                  <i class="load" v-if="collect.sending"></i>

                  <div class="buttons" v-if="collect.status == 'pending' && !collect.sending">
                    <button class="button is-primary" @click="approve(collect)">Confirmar</button>
                  </div>
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
      collects: [],

      loading: true,

      title: null,

      search: null,
    }
  },
  computed: {
    accounts() { return this.$store.state.accounts },
    account()  { return this.$store.state.account  },
  },
  filters: {
    status(value) {
      if(value == 'approved') return 'Aprobada'
      if(value == 'pending')  return 'Pendiente'
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
      const { data } = await api.Collects.GET({ filter, account: this.account.id }); console.log({ data })

      this.loading = false

      // error
      if(data.error && data.msg == 'invalid filter') this.$router.push('collects/all')

      // success
      this.collects = data.collects
                       .map(i => ({ ...i, sending: false, visible: true }))
                       .reverse()


      this.collects.forEach((collect) => {
        const office = this.accounts.find(x => x.id == collect.office)
        collect.office = office.name
      })

      if(filter == 'all')     this.title = 'Todos las Retiros'
      if(filter == 'pending') this.title = 'Retiros Pendientes'

    },
    async approve(collect) {
      console.log('approve: ', collect)
      if(!confirm("Desea confirmar el retiro?")) return

      collect.sending = true

      const { data } = await api.Collects.POST({ action: 'approve', id: collect.id })
      console.log({ data })

      collect.sending = false

      // error
      if(data.error && data.msg == 'already approved')  return collect.status = 'approved'

      // success
      collect.status = 'approved'
    },
    input() {
      console.log('input ...')
      for(let collect of this.collects) {

        const date = this.$options.filters.date(collect.date)
        console.log({ date })

        if (date.includes(this.search)) {
          collect.visible = true
        }
        else {
          collect.visible = false
        }
      }
    },
  }
};
</script>
