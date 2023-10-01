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
            <tr v-for="(node, i) in tree.filter(e => e.rank != 'none')">
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

        Activos simple: {{ tree.filter(e => e._activated).length }} <br>
        Activos full:   {{ tree.filter(e => e.activated).length }} <br><br>

        Afiliaciones: {{ affiliations.length }} <br>
        Compras: {{ activations.length }} <br>
        <br>

        <button v-if="!saving" class="button" @click="save">Guardar</button>
        <button v-if=" saving" class="button">Guardando ...</button>

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

          Afiliaciones: {{ closed.affiliations.length }} <br>
          Activaciones: {{ closed.activations.length }} <br>

        </div>
        <br>
        <br>
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
      affiliations: [],
      activations: [],
      closeds: [],

      saving: false,

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
  // computed: {
  // },
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

      this.tree         = data.tree
      this.affiliations = data.affiliations
      this.activations  = data.activations
    },

    async save() {
      if(!confirm('Esta por guardar el cierre, este proceso no se puede revertir')) return
      console.log(this.activations)
      // return

      this.saving = true

      const { data } = await api.closeds.POST({ action: 'save', data: {
        tree: this.tree,
        affiliations: this.affiliations,
        activations: this.activations,
      } })

      this.saving = false

      location.reload()
    },
  }
};
</script>
