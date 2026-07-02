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
                <th>Oficina</th>
                <!-- <th>Cuenta</th> -->
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(collect, i) in collects" v-show="collect.visible">
                <th>{{ i + 1 }}</th>
                <td>{{ collect.date | date }}</td>
                <td>
                  {{ collect.office.name }}
                </td>
                <td>
                  $ {{ collect.amount }}
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
      accounts: [],
    }
  },
  computed: {
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

      const data2 = await api.offices.GET()
      this.accounts = data2.data?.offices || []

      // GET data
      const { data } = await api.OfficeCollects.GET({ filter, account: this.account.id }); console.log({ data })

      this.loading = false

      // error
      if(data.error && data.msg == 'invalid filter') this.$router.push('collects/all')

      // success
      this.collects = data.collects
                       .map(i => ({ ...i, sending: false, visible: true }))
                       .reverse()


      this.collects.forEach((collect) => {
        const office = this.accounts.find(x => x.id == collect.office)
        collect.office = office ? office.name : ""
      })

      if(filter == 'all')     this.title = 'Todos las Retiros'
      if(filter == 'pending') this.title = 'Retiros Pendientes'

    },
    async approve(collect) {
      console.log('approve: ', collect)
      this.$confirm.show({
        title: 'Confirmar Retiro',
        message: '¿Desea confirmar este retiro?',
        type: 'info',
        confirmText: 'Confirmar',
        onConfirm: async () => {
          await this.performApprove(collect);
        }
      });
    },
    async performApprove(collect) {
      collect.sending = true

      const { data } = await api.OfficeCollects.POST({ action: 'approve', id: collect.id })
      console.log({ data })

      collect.sending = false

      // error
      if(data.error && data.msg == 'already approved') {
        collect.status = 'approved'
        this.$toast.info('Información', 'El retiro ya estaba aprobado');
        return;
      }

      // success
      collect.status = 'approved'
      this.$toast.success('Éxito', 'Retiro confirmado correctamente');
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
