<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>Nuevo Cierre de mes</strong>
        </div>
      </div>
      <br>
      <div class="container">
        <button class="button is-link" @click="closed">Iniciar Cierre</button>

        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Puntos Personales</th>
              <th>Puntos Grupales</th>
              <th>Rango</th>
              <th>Bono Residual</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(node, i) in tree" v-if="node.rank != 'none'">
              <th>{{ i + 1 }}</th>
              <td>
                {{ node.name }}
              </td>
              <td>
                {{ node.points }}
              </td>
              <td>
                {{ node._total }}
              </td>
              <td>
                {{ node.rank }}
              </td>
              <td>
                {{ node.residual_bonus }}
              </td>
            </tr>
          </tbody>
        </table>

        <button class="button" @click="save">Guardar</button>

      </div>
      <br>
      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>Cierres</strong>
        </div>
      </div>
      <br>
      <div class="container">

        <div v-for="closed in closeds">

          <strong>{{ closed.date | date }}</strong>
          <br>
          <br>
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Puntos Personales</th>
                <th>Puntos Grupales</th>
                <th>Rango</th>
                <th>Bono Residual</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, i) in closed.users">
                <th>{{ i + 1 }}</th>
                <td>
                  {{ user.name }}
                </td>
                <td>
                  {{ user.points }}
                </td>
                <td>
                  {{ user.total }}
                </td>
                <td>
                  {{ user.rank }}
                </td>
                <td>
                  {{ user.residual_bonus }}
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
import lib    from '@/lib'

export default {
  components: { Layout },
  data() {
    return{
      loading: true,
      tree: [],
      closeds: [],
    }
  },
  created() {
    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)
    this.GET()
  },
  filters: {
    date(val) {
      return new Date(val).toLocaleDateString()
    },
  },
  methods: {
    async GET() {

      this.loading = true

      // GET data
      const { data } = await api.closeds.GET(); console.log({ data })

      this.loading = false

      // success
      this.closeds = data.closeds.reverse()
    },

    async closed() {
      const { data } = await api.closeds.POST({ action: 'new' }); console.log({ data })

      this.tree = data.tree
    },

    async save() {
      confirm('Esta por guardar el cierre, este proceso no se puede revertir')

      const { data } = await api.closeds.POST({ action: 'save', data: {tree: this.tree } }); console.log({ data })

      location.reload()
    },
  }
};
</script>
