<template>
  <Layout>

    <section>

      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>{{ title }}</strong>
        </div>
      </div>

      <div class="container"> <br>


        <div class="control">
          <div class="select">
            <select v-model="mode" @change="change">
              <option value="day">Hoy</option>
              <option value="month">Mes</option>
            </select>
          </div>
        </div> <br>

        <i class="load" v-if="loading"></i>

        <strong>Afiliaciones: {{ affiliations_count }}</strong> <br>

        <p v-for="plan in plans">
          {{ plan.name }} - {{ plan.count }}
        </p> <br>

        <strong>Productos:</strong> <br>

        <p v-for="product in products_affiliation">
          {{ product.name }} - {{ product.count }}
        </p> <br><br>


        <strong>Activaciones: {{ activations_count }}</strong> <br>

        Total: S/.{{ activations_amount }} <br><br>

        <strong>Productos:</strong> <br>

        <p v-for="product in products_activation">
          {{ product.name }} - {{ product.count }}
        </p> <br><br>



        <strong>Retiros: {{ collects_count }}</strong> <br>

        Total: S/.{{ collects_total }} <br><br><br><br>


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
      loading: false,

      title: 'Reportes',

      mode: 'day', //month

      affiliations: null,
      affiliations_count: null,

      activations: null,
      activations_count: null,
      activations_amount: null,

      plans: [],
      products_affiliation: [],
      products_activation: [],

      collects: null,
      collects_count: null,
      collects_total: null,
    }
  },
  created() {
    this.load()
  },
  methods: {
    change() {
      this.load()
    },
    async load() {
      this.loading = true

      const mode = this.mode

      const { data } = await api.reports.GET({ filter: mode }); console.log({ data })

      this.affiliations       = data.affiliations
      this.affiliations_count = data.affiliations_count

      this.activations       = data.activations
      this.activations_count = data.activations_count

      this.collects       = data.collects
      this.collects_count = data.collects_count

      // console.log('1')
      let products = []
      let plans = []

      for (const affiliation of this.affiliations) {

        for(const product of affiliation.plan.products) {

          const p = products.find(x => x.name == product)
          console.log({ p })

          if (!p) {
            products.push({
              name: product,
              count: 1,
            })
          } else {
            p.count += 1
          }
        }


        const j = plans.find(x => x.name == affiliation.plan.name)

        if (!j) {
          plans.push({
            name: affiliation.plan.name,
            count: 1,
          })
        } else {
          j.count += 1
        }

      }
      // console.log('2')
      this.plans = plans

      this.products_affiliation = products


      products = []
      let amount = 0

      for (const activation of this.activations) {

        const p = activation.products

        amount += activation.price

        for(let product of p) {
          if (product.quantity) {
            const id   = product.id
            const name = product.name

            const i = products.find(x => x.id == id)

            if (!i) {
              products.push({
                id: product.id,
                name: product.name,
                count: 1,
              })
            } else {
              i.count += product.quantity
              i.name   = product.name
            }
          }
        }
      }
      // console.log('3')
      this.products_activation = products
      this.activations_amount = amount

      let total = 0

      for (const collect of this.collects) {
        total += collect.amount
      }
      // console.log('4')
      this.collects_total = total

      this.loading = false
    },
  }
};

// console.log({ affiliation })
// const fixed    = affiliation.plan.products.fixed.list
// const variable = affiliation.plan.products.variable.list

// let product

// for(product of fixed) {
//   if (product.count) {
//     const id   = product.id
//     const name = product.name

//     const i = products.find(x => x.id == id)

//     if (!i) {
//       products.push({
//         id: product.id,
//         name: product.name,
//         count: 1,
//       })
//     } else {
//       i.count += product.count
//       i.name   = product.name
//     }
//   }
// }
// console.log(':)')
// if(variable) {
//   for(product of variable) {
//     if (product.count) {
//       const id   = product.id
//       const name = product.name


//       const i = products.find(x => x.id == id)

//       if (!i) {
//         products.push({
//           id: product.id,
//           name: product.name,
//           count: 1,
//         })
//       } else {
//         i.count += product.count
//         i.name   = product.name
//       }
//     }
//   }
// }

// let prod = affiliation.plan.products
// console.log({ products })

</script>

