<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="container">
        <strong>Banner principal (1920 x 508) px</strong> <br><br>

        <div>

          <figure >
            <img :src="banner.img" style="max-height: 400px;">
          </figure> <br>


          <label>

            <span class="button">
              <span class="icon">
                <i class="fas fa-upload"></i>
              </span>
              <span>Cambiar imágen</span>
            </span>

            <input type="file" @change="onFileChange" style="display: none;">

          </label>&nbsp;

          <button v-if="!sending" class="button is-primary" @click="save">Guardar</button>
          <button v-if="sending" disabled class="button is-primary">Guardar</button>

          <!-- <i class="load"></i> -->

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
      banner:  null,

      loading: true,
      sending: false,

      title: null,

      search: null,
    }
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
      const { data } = await api.promos.GET(); console.log({ data })

      this.loading = false

      // success
      this.banner  = data.banner
    },


    async onFileChange(e) {

      this.file = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (e) => {
        this.banner.img = e.target.result

      }

      reader.readAsDataURL(this.file)
    },


    async save() {
      this.sending = true

      const img = await lib.upload(this.file, this.file.name, 'banner')
      console.log({ img })

      const { data } = await api.promos.POST({ id: this.banner.id, img })
      this.sending = false
    },
  }
};
</script>
