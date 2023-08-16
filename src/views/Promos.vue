<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="notification" style="margin-bottom: 0; display: flex;">
        <div class="container">
          <strong>Promoción de Activación</strong> <br><br>

          <div style=" display: flex; align-items: flex-end;">
            
            <figure style="width: 160px;">
              <img :src="promo.img" style="vertical-align: top;">
            </figure> &nbsp;&nbsp;&nbsp;&nbsp;


            <label>
      
              <span class="button">
                <span class="icon">
                  <i class="fas fa-upload"></i>
                </span>
                <span>Cambiar imágen</span>
              </span>

              <input type="file" @change="onFileChange" style="display: none;">

            </label> &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;


            <div class="field">
              <input id="switchRoundedDefault" type="checkbox" name="switchRoundedDefault" class="switch is-rounded" :checked="promo.active" @change="change" v-model="promo.active">
              <label for="switchRoundedDefault">Activar</label>
            </div>
          
          </div>
        </div>
        <div class="container">
          <strong>Promoción de Afiliación</strong> <br><br>

          <div style=" display: flex; align-items: flex-end;">
            
            <figure style="width: 160px;">
              <img :src="promoA.img" style="vertical-align: top;">
            </figure> &nbsp;&nbsp;&nbsp;&nbsp;


            <label>
      
              <span class="button">
                <span class="icon">
                  <i class="fas fa-upload"></i>
                </span>
                <span>Cambiar imágen</span>
              </span>

              <input type="file" @change="onFileChangeA" style="display: none;">

            </label> &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;


            <div class="field">
              <input id="switchA" type="checkbox" name="switchA" class="switch is-rounded" :checked="promoA.active" @change="changeA" v-model="promoA.active">
              <label for="switchA">Activar</label>
            </div>
          
          </div>
        </div>
      </div> <br><br>


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
                <th style="display: flex">
                  Fecha <input class="input" style="margin-left: 6px;" placeholder="buscar" v-model="search" @input="input">
                </th>
                <th>Usuario</th>
                <th>Voucher</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(promo, i) in promos" v-show="promo.visible">
                <th>{{ i + 1 }}</th>
                <td>{{ promo.date | date }}</td>
                <td>
                  {{ promo.name }} {{ promo.lastName }} <br>
                  <a>{{ promo.username }}</a> <br>
                  {{ promo.phone }}
                </td>
                <td>
                  <a :href="promo.voucher" target="_blank">
                    <img :src="promo.voucher" style="max-height: 80px; max-width: 80px">
                  </a>
                </td>
                <td>

                  <span class="has-text-success" v-if="promo.status == 'approved'">
                    {{ promo.status | status }}
                  </span>
                  <span class="has-text-danger" v-if="promo.status == 'rejected'">
                    {{ promo.status | status }}
                  </span>

                  <i class="load" v-if="promo.sending"></i>

                  <div class="buttons" v-if="promo.status == 'pending' && !promo.sending && !sending">
                    <button class="button is-primary" @click="approve(promo)">Aprobar</button>
                    <button class="button is-danger" @click="reject(promo)">Rechazar</button>
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
import lib    from '@/lib'

export default {
  components: { Layout },
  data() {
    return{
      promos: [],
      promo:  null,
      promoA: null,

      loading: true,
      sending: false,

      title: null,

      search: null,
    }
  },
  filters: {
    status(val) {
      if(val == 'approved') return 'Aprobada'
      if(val == 'pending')  return 'Pendiente'
      if(val == 'rejected') return 'Rechazada'
    },
    date(val) {
      return new Date(val).toLocaleDateString()
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.GET(to.params.filter); next()
  },
  created() {
    console.log('Promos! ...')
    this.GET(this.$route.params.filter)
  },
  methods: {
    async GET(filter) {

      this.loading = true

      // GET data
      const { data } = await api.promos.GET({ filter }); console.log({ data })

      this.loading = false

      // error
      if(data.error && data.msg == 'invalid filter') this.$router.push('promos/all')

      // success
      this.promos = data.promos
                           .map(i => ({ ...i, sending: false, visible: true }))
                           .reverse()

      if(filter == 'all')     this.title = 'Todas las Promociones'
      if(filter == 'pending') this.title = 'Promociones Pendientes'

      this.promo  = data.prom
      this.promoA = data.promA

    },
    async approve(promo) {

      if(!confirm("Desea aprovar la promoción?")) return

      promo.sending = true

      let { data } = await api.promos.POST({ action: 'approve', id: promo.id })
      console.log({ data })

      promo.sending = false

      // error
      if(data.error && data.msg == 'already approved')  return promo.status = 'approved'
      if(data.error && data.msg == 'already rejected')  return promo.status = 'rejected'

      // success
      promo.status = 'approved'

    },
    async reject(promo) {

      if(!confirm("Desea rechazar la promoción?")) return
      
      promo.sending = true

      const { data } = await api.promos.POST({ action: 'reject', id: promo.id })
      console.log({ data })

      promo.sending = false

      // error
      if(data.error && data.msg == 'already approved') return promo.status = 'approved'
      if(data.error && data.msg == 'already rejected') return promo.status = 'rejected'

      // success
      promo.status = 'rejected'

    },
    input() {
      console.log('input ...')
      for(let promo of this.promos) {

        const date = this.$options.filters.date(promo.date)
        console.log({ date })

        if (date.includes(this.search)) {
          promo.visible = true
        }
        else {
          promo.visible = false
        }
      }
    },

    async onFileChange(e) {

      this.file = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (e) => {
        this.promo.img = e.target.result

      }

      reader.readAsDataURL(this.file)

      const img = await lib.upload(this.file, this.file.name, 'promo')
      console.log({ img })
      
      const { data } = await api.promo.POST({ type: 'activation', action: 'img', data: img })

    },

    async change(e) {

      const active = this.promo.active
      console.log({ active })
      
      const { data } = await api.promo.POST({ type: 'activation', action: 'active', data: active })

    },

    async onFileChangeA(e) {

      this.fileA = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (e) => {
        this.promoA.img = e.target.result

      }

      reader.readAsDataURL(this.fileA)

      const img = await lib.upload(this.fileA, this.fileA.name, 'promo-affiliation')
      console.log({ img })
      
      const { data } = await api.promo.POST({ type: 'affiliation', action: 'img', data: img })

    },

    async changeA(e) {

      const active = this.promoA.active
      console.log({ active })
      
      const { data } = await api.promo.POST({ type: 'affiliation', action: 'active', data: active })
      console.log({ data })
    },
  }
};
</script>
