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

        <div class="tabs">
          <ul>
            <li v-for="office of offices" @click="selected_office = office"><a>{{ office.name }}</a></li>
          </ul>
        </div>

        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field">
              <p class="control has-icons-left">
                <input class="input" type="text" @change="update" v-model="selected_office.email">
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <input class="input" type="text" @change="update" v-model="selected_office.password">
                <span class="icon is-small is-left">
                  <i class="fa-solid fa-key"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <input class="input" type="text" @change="update" v-model="selected_office.name">
                <span class="icon is-small is-left">
                  <i class="fa-solid fa-user"></i>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-body">
            <!-- <div class="field">
              <p class="control has-icons-left">
                <input class="input" type="text" @change="update" v-model="selected_office.name">
                <span class="icon is-small is-left">
                  <i class="fa-solid fa-user"></i>
                </span>
              </p>
            </div> -->
            <div class="field">
              <p class="control has-icons-left">
                <input class="input" type="text" @change="update" v-model="selected_office.address">
                <span class="icon is-small is-left">
                  <i class="fa-solid fa-location-dot"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <textarea class="input" @change="update" v-model="selected_office.accounts"></textarea>
                <span class="icon is-small is-left">
                  <i class="fa-solid fa-piggy-bank"></i>
                </span>
              </p>
            </div>
          </div>
        </div>


        <div class="columns">
          <div class="column">

            <table class="table">
              <tbody>
                <tr v-for="(product, i) in selected_office.products">
                  <th>{{ i + 1 }}</th>
                  <td>{{ product.name }}</td>
                  <td>{{ product.total }}</td>
                </tr>
              </tbody>
            </table>

          </div>
          <div class="column">
            <div class="notification" style="margin-bottom: 0;">
              <div class="container">

                <table class="table">
                  <tbody>
                    <tr v-for="(product, i) in selected_office.new_products">
                      <th>{{ i + 1 }}</th>
                      <td>{{ product.name }}</td>
                      <td>
                        <input type="number" style="width: 60px;" v-model="product.total">
                      </td>
                    </tr>
                  </tbody>
                </table>

                <button class="button is-primary" @click="recharge">Recargar</button>

              </div>
            </div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Monto</th>
              <th>Voucher</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="recharge of selected_office.recharges">
              <td>{{ recharge.date | date }}</td>
              <td>
                <div v-for="product in recharge.products" v-if="product.total">
                  {{ product.total }} {{ product.name }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

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
      loading: null,
      title: 'Oficinas',
      offices: [],
      selected_office : null,
    }
  },

  filters: {
    date(val) {
      return new Date(val).toLocaleDateString()
    },
  },

  async created() {

    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)

    this.loading = true

    // // GET data
    const { data } = await api.offices.GET(); console.log({ data })

    this.loading = false

    // error
    // if(data.error && data.msg == 'invalid filter') this.$router.push('collects/all')

    // success
    this.offices = data.offices


    this.offices = this.offices.map(office => {

      office.new_products = []

      office.products.forEach(p => {
        office.new_products.push({
          id: p.id,
          name: p.name,
          total: 0,
        })
      })

      return office
    })


    this.selected_office = this.offices[0]
  },

  methods: {
    async recharge() {
      console.log('recharge')

      const id       = this.selected_office.id
      const products = this.selected_office.new_products

      products.forEach(p => {
        p.total = parseInt(p.total)
      })

      console.log({id, products})

      confirm('Seguro que desea hacer la recarga de productos?')

      this.selected_office.products.forEach((p, i) => {
        p.total += products[i].total
      })

      const { data } = await api.offices.POST({ id, products }); console.log({ data })

    },

    async update() {
      console.log('update ...')

      const office = this.selected_office

      const { data } = await api.offices.POST({ id: office.id, office }); console.log({ data })
    },
  },
};
</script>
