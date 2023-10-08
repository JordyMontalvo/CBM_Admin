<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="container">
        <div class="field">
          <label class="label">CI</label>
          <div class="control has-icons-left">
            <input class="input" type="text" placeholder="Número de CI" v-model="dni">
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </div>
        </div>

        <div class="field">
          <label class="label">Monto</label>
          <div class="control has-icons-left has-icons-right">
            <input class="input" type="text"
              oninput="this.value=this.value.replace(/(?![0-9])./gmi,'')"
              placeholder="Monto en $" v-model="amount">
            <span class="icon is-small is-left">
              <i class="fa-solid fa-money-bill"></i>
            </span>
          </div>
        </div>

        <div class="field">
          <label class="label">Descripción</label>
          <div class="control has-icons-left has-icons-right">
            <input class="input" type="email" placeholder="Descripción del pago" v-model="desc">
            <span class="icon is-small is-left">
              <i class="fa-solid fa-pencil"></i>
            </span>
          </div>
        </div>

        <p v-if="success" class="help is-success">Saldo cargado</p>
        <p v-if="error"   class="help is-danger">DNI no encontrado</p>


        <div class="control">
          <button class="button is-link" @click="save">Enviar Pago</button>
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
      loading: false,
      sending: false,

      dni: null,
      amount: null,
      desc: null,

      success: false,
      error: false,
    }
  },
  created() {
    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)
  },
  methods: {

    async save() {
      const { dni, amount, desc } = this
      console.log('save ...')

      if(!confirm(`Desea enviar USD ${amount} al dni: ${dni}`)) return

      const { data } = await api.pay.POST({ dni, amount, desc }); console.log({ data })

      if(data.error)  this.error   = true
      if(!data.error) this.success = true
    },
  }
};
</script>
