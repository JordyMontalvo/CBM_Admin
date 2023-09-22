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
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <!-- <th>id</th> -->
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precios Compra</th>
                <th>Precios Afiliación</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, i) in products">
                <th>{{ i + 1 }}</th>
                <!-- <td>{{ product.id }}</td> -->
                <td>
                  <span v-if="!product.edit">{{ product.name }}</span>

                  <input class="input" placeholder="Nombre" style="max-width: 220px;"
                         v-model="product._name" v-if="product.edit">
                </td>
                <td>
                  <span v-if="!product.edit">{{ product.type }}</span>

                  <input class="input" placeholder="Categoría" style="max-width: 220px;"
                         v-model="product._type" v-if="product.edit">
                </td>
                <td>{{ product.price }}</td>
                <td>{{ product.aff_price }}</td>
                <td>
                  <i
                    class="fa-regular fa-pen-to-square"
                    style="color: #ccc; cursor: pointer; margin-right: 8px;"
                    v-if="!product.edit"
                    @click="edit(product)"></i>
                  <i
                    class="fa-solid fa-check"
                    style="color: #ccc; cursor: pointer; margin-right: 8px;"
                    v-if="product.edit"
                    @click="save(product)"></i>
                  <i
                    class="fa-solid fa-xmark"
                    style="color: #ccc; cursor: pointer; margin-right: 8px;"
                    v-if="product.edit"
                    @click="cancel(product)"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> <br>

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
    }
  },
  filters: {
    date(val) {
      return new Date(val).toLocaleDateString()
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
      const { data } = await api.products.GET(); console.log({ data })

      this.loading = false

      this.products = data.products


      this.products = data.products
                    .map(p => ({
                      ...p,
                      sending: false,
                      edit: false,
                      _name: '',
                      _type: '',
                    }))
    },

    edit(product) { ; console.log('edit: ', product)
      product.edit = true

      if(!product._name) product._name = product.name
      if(!product._type) product._type = product.type
    },
    async save(product) {

      await api.products.POST({
        action: 'edit',
        id: product.id,
        data: {
          _name: product._name,
          _type: product._type,
        }
      })

      product.name = product._name
      product.type = product._type

      product.edit = false
    },
    cancel(product) {
      product.edit = false
    },
  }
};
</script>
