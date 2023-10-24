<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>Productos</strong>
        </div>
      </div>

      <div class="container">
        <br>
        <div class="select">
          <select v-model="product" @change="change">
            <option v-for="p in products" :value="p">{{ p.name }}</option>
          </select>
        </div>
        <br>
        <br>

        <!-- <p>{{ product }}</p> -->

        <!-- <p>{{ table }}</p> -->
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <!-- <th>#</th> -->
                <th>FECHA</th>
                <th>CODIGO</th>
                <th>PRODUCTO</th>
                <th>CANTIDAD</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, i) in table">
                <!-- <th>0</th> -->
                <td>{{ field.date }}</td>
                <td>{{ field.id }}</td>
                <td>{{ field.name }}</td>
                <td>{{ field.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> <br>

      <!-- <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>Nuevo producto</strong>
        </div>
      </div>

      <div class="container">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precios Compra</th>
                <th>Precios Afiliación</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>0</th>
                <td>
                  <input class="input" placeholder="Nombre" style="max-width: 220px;"
                         v-model="new_product.name">
                </td>
                <td>
                  <input class="input" placeholder="Categoría" style="max-width: 220px;"
                         v-model="new_product.type">
                </td>
                <td>
                  BÁSICO:   <input class="input" type="number" style="max-width: 80px;"
                                   v-model.number="new_product.price[0]"> <br>
                  ESTÁNDAR: <input class="input" type="number" style="max-width: 80px;"
                                   v-model.number="new_product.price[1]"> <br>
                  PREMIUM:  <input class="input" type="number" style="max-width: 80px;"
                                   v-model.number="new_product.price[2]"> <br>
                  ESTRELLA: <input class="input" type="number" style="max-width: 80px;"
                                   v-model.number="new_product.price[3]">
                </td>
                <td>
                  En Afiliación <input type="checkbox" v-model="new_product.aff_price_check">

                  <div v-if="new_product.aff_price_check">
                    BÁSICO:   <input class="input" type="number" style="max-width: 80px;"
                                     v-model.number="new_product.aff_price[0]"> <br>
                    ESTÁNDAR: <input class="input" type="number" style="max-width: 80px;"
                                     v-model.number="new_product.aff_price[1]"> <br>
                    PREMIUM:  <input class="input" type="number" style="max-width: 80px;"
                                     v-model.number="new_product.aff_price[2]"> <br>
                    ESTRELLA: <input class="input" type="number" style="max-width: 80px;"
                                     v-model.number="new_product.aff_price[3]">
                  </div>
                </td>
                <td>
                  <button class="button is-primary" @click="add">Aprobar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> <br> -->

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
      products: [],

      product: null,
      recharges: null,
    }
  },
  computed: {
    table() {

      let ret = []

      for(let recharge of this.recharges) {
        for(let product of recharge.products) {
          if(product.id == this.product.id && product.total) {
            ret.push({
              type: 'in',
              date: recharge.date,
              id: product.id,
              name: product.name,
              total: product.total,
            })
          }
        }
      }

      return ret
    },
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
      const { data } = await api.kadex.GET(); console.log({ data })

      this.loading = false

      this.products = data.products
      this.recharges = data.recharges

      this.product = data.products[0]
    },

    change() {
      console.log('change ...')
    },
  }
};
</script>
