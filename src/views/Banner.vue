<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="container">
        <strong>Banner 1 (1920 x 508) px</strong> <br><br>

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

        </div>
      </div> <br><br>

      <div class="container">
        <strong>Banner 2 (1920 x 508) px</strong> <br><br>

        <div>

          <figure >
            <img :src="banner.img2" style="max-height: 400px;">
          </figure> <br>


          <label>

            <span class="button">
              <span class="icon">
                <i class="fas fa-upload"></i>
              </span>
              <span>Cambiar imágen</span>
            </span>

            <input type="file" @change="onFileChange2" style="display: none;">

          </label>&nbsp;

          <button v-if="!sending2" class="button is-primary" @click="save2">Guardar</button>
          <button v-if="sending2" disabled class="button is-primary">Guardar</button>

        </div>
      </div> <br><br>

      <div class="container">
        <strong>Banner 3 (1920 x 508) px</strong> <br><br>

        <div>

          <figure >
            <img :src="banner.img3" style="max-height: 400px;">
          </figure> <br>


          <label>

            <span class="button">
              <span class="icon">
                <i class="fas fa-upload"></i>
              </span>
              <span>Cambiar imágen</span>
            </span>

            <input type="file" @change="onFileChange3" style="display: none;">

          </label>&nbsp;

          <button v-if="!sending3" class="button is-primary" @click="save3">Guardar</button>
          <button v-if="sending3" disabled class="button is-primary">Guardar</button>

        </div>
      </div> <br><br>

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
      sending2: false,
      sending3: false,

      title: null,
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

    async onFileChange2(e) {

      this.file2 = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (e) => {
        this.banner.img2 = e.target.result

      }

      reader.readAsDataURL(this.file2)
    },

    async onFileChange3(e) {

      this.file3 = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (e) => {
        this.banner.img3 = e.target.result

      }

      reader.readAsDataURL(this.file3)
    },


    async save() {
      this.sending = true

      const img = await lib.upload(this.file, this.file.name, 'banner')
      console.log({ img })

      const { data } = await api.promos.POST({ id: this.banner.id, img, pos: 1 })
      this.sending = false
    },

    async save2() {
      this.sending2 = true

      const img = await lib.upload(this.file2, this.file2.name, 'banner')
      console.log({ img })

      const { data } = await api.promos.POST({ id: this.banner.id, img, pos: 2 })
      this.sending2 = false
    },

    async save3() {
      this.sending3 = true

      const img = await lib.upload(this.file3, this.file3.name, 'banner')
      console.log({ img })

      const { data } = await api.promos.POST({ id: this.banner.id, img, pos: 3 })
      this.sending3 = false
    },
  }
};
</script>
