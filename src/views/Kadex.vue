<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>Inventario</strong>
        </div>
      </div>

      <div class="container">
        <br>
        <div class="select">
          <select v-model="product" @change="change">
            <option v-for="p in products" :value="p">{{ p.name }}</option>
          </select>
        </div>&nbsp;&nbsp;&nbsp;<a @click="download">Descargar Reporte</a>
        <br>
        <br>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>FECHA</th>
                <th>CODIGO</th>
                <th style="width: 320px;">PRODUCTO</th>
                <th>MOTIVO</th>
                <th>INGRESO CANTIDAD</th>
                <th>EGRESO CANTIDAD</th>
                <th>PRECIO UNITARIO</th>
                <th>TOTAL</th>
                <th>SALDO UNIDADES</th>
                <th>SUCURSAL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, i) in table">
                <td>{{ field.date | date }}</td>
                <td>{{ field.id }}</td>
                <td>{{ field.name }}</td>
                <td>{{ field.reason }}</td>
                <td>{{ field.total_in }}</td>
                <td>{{ field.total_out }}</td>
                <td>{{ field.price }}</td>
                <td>{{ field.total_price }}</td>
                <td>{{ field.balance }}</td>
                <td>{{ field.office }}</td>
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

      product: null,
      recharges: null,
      affiliations: null,
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
              office: recharge.office_id,
            })
          }
        }
      }

      for(let affiliation of this.affiliations) {
        if(affiliation.products) {
          for(let product of affiliation.products) {
            if(product.id == this.product.id && product.total) {
              ret.push({
                type: 'out',
                date: affiliation.date,
                id: product.id,
                name: product.name,
                total: product.total,
                affiliation: true,
                price: product.price,
                office: affiliation.office,
              })
            }
          }
        }
      }

      for(let activation of this.activations) {
        for(let product of activation.products) {
          if(product.id == this.product.id && product.total) {
            ret.push({
              type: 'out',
              date: activation.date,
              id: product.id,
              name: product.name,
              total: product.total,
              activation: true,
              price: product.price,
              office: activation.office,
            })
          }
        }
      }

      ret.sort(function(a,b) {
        return new Date(a.date) - new Date(b.date)
      })

      for(let r of ret) {
        r.reason    = r.type == 'in'  ? 'RECARGA' : (r.affiliation ? 'AFILIACIÓN' : 'RECOMPRA')
        r.total_in  = r.type == 'in'  ? r.total : 0
        r.total_out = r.type == 'out' ? r.total : 0
        r.price     = r.price ? r.price : 0
        r.total_price = r.type == 'out' ? r.total * r.price : 0
      }

      for(let [i, r] of ret.entries()) {

        let a = i == 0 ? 0 : ret[i-1].balance

        r.balance = a + r.total_in - r.total_out
      }

      return ret
    },
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
      const { data } = await api.kadex.GET(); console.log({ data })

      this.loading = false

      this.products    = data.products
      this.recharges   = data.recharges
      this.affiliations = data.affiliations
      this.activations = data.activations

      this.product = data.products[0]
    },

    change() {
      console.log('change ...')
    },

    download() {
      let filename= `Inventario-${this.product.name}.xlsx`
      let data_xls = []

      this.table.forEach(t => {
        data_xls.push({
          'FECHA': new Date(t.date).toLocaleDateString(),
          'CODIGO': t.id,
          'PRODUCTO': t.name,
          'MOTIVO': t.reason,
          'INGRESO CANTIDAD': t.total_in,
          'EGRESO CANTIDAD': t.total_out,
          'PRECIO UNITARIO': t.price,
          'TOTAL': t.total_price,
          'SALDO UNIDADES': t.balance,
          'SUCURSAL': t.office,
        })
      })

      var ws = XLSX.utils.json_to_sheet(data_xls)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Inventario")
      XLSX.writeFile(wb,filename)
    },
  }
};
</script>
