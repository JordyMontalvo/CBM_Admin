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
                <td>
                  <span v-if="!product.edit">{{ product.price }}</span>

                  <div v-if="product.edit">
                    BÁSICO:   <input class="input" type="number" style="max-width: 80px;"
                                     v-model.number="product._price[0]"> <br>
                    ESTÁNDAR: <input class="input" type="number" style="max-width: 80px;"
                                     v-model.number="product._price[1]"> <br>
                    PREMIUM:  <input class="input" type="number" style="max-width: 80px;"
                                     v-model.number="product._price[2]"> <br>
                    ESTRELLA: <input class="input" type="number" style="max-width: 80px;"
                                     v-model.number="product._price[3]">
                  </div>
                </td>
                <td>
                  <span v-if="!product.edit">{{ product.aff_price }}</span>

                  <div v-if="product.edit">

                    En Afiliación <input type="checkbox" v-model="product.aff_price_check">

                    <div v-if="product.aff_price_check">
                      BÁSICO:   <input class="input" type="number" style="max-width: 80px;"
                                       v-model.number="product._aff_price[0]"> <br>
                      ESTÁNDAR: <input class="input" type="number" style="max-width: 80px;"
                                       v-model.number="product._aff_price[1]"> <br>
                      PREMIUM:  <input class="input" type="number" style="max-width: 80px;"
                                       v-model.number="product._aff_price[2]"> <br>
                      ESTRELLA: <input class="input" type="number" style="max-width: 80px;"
                                       v-model.number="product._aff_price[3]">
                    </div>

                  </div>

                </td>
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

      <div class="notification" style="margin-bottom: 0;">
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
                <!-- <th>id</th> -->
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
      new_product: {
        price: [],
        aff_price: [],
      },
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
                      _price:     [0, 0, 0, 0],
                      _aff_price: [0, 0, 0, 0],
                      aff_price_check: p.aff_price ? true : false,
                    }))
    },

    edit(product) { /*; console.log('edit: ', product)*/
      product.edit = true

      if(!product._name)  product._name = product.name
      if(!product._type)  product._type = product.type

      if(!product._price[0]) product._price[0] = product.price[0]
      if(!product._price[1]) product._price[1] = product.price[1]
      if(!product._price[2]) product._price[2] = product.price[2]
      if(!product._price[3]) product._price[3] = product.price[3]

      if(product.aff_price_check) {
        if(!product._aff_price[0]) product._aff_price[0] = product.aff_price[0]
        if(!product._aff_price[1]) product._aff_price[1] = product.aff_price[1]
        if(!product._aff_price[2]) product._aff_price[2] = product.aff_price[2]
        if(!product._aff_price[3]) product._aff_price[3] = product.aff_price[3]
      }
    },
    async save(product) {

      await api.products.POST({
        action: 'edit',
        id: product.id,
        data: {
          _name: product._name,
          _type: product._type,
          _price: product._price,
          aff_price_check: product.aff_price_check,
          _aff_price:      product._aff_price
        }
      })

      product.name = product._name
      product.type = product._type
      product.price = product._price

      if(product.aff_price_check)
        product.aff_price = product._aff_price
      else
        product.aff_price = null

      product.edit = false
    },
    cancel(product) {
      product.edit = false
    },

    async add() { /*; console.log('save ...')*/

      const { name, type, price, aff_price_check, aff_price } = this.new_product
      console.log({ name, type, price, aff_price_check, aff_price })

      await api.products.POST({
        action: 'add',
        data: {
          name,
          type,
          price,
          aff_price_check,
          aff_price,
        }
      })

      location.reload()
    }
  }
};
</script>
