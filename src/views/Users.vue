<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>{{ title }}</strong>
          <input class="input" placeholder="Buscar por nombre" v-model="search" @input="input"> <br><br>

          <small>Total disponible: USD {{ balance }} &nbsp;&nbsp; / &nbsp;&nbsp; Total no disponible: USD {{ virtualBalance }}</small>

        </div>
      </div>

      <div class="container">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Registro</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Código</th>
                <th>Puntos</th>
                <th>
                  Saldo disponible
                  <input type="checkbox" v-model="check" @change="input2">
                </th>
                <th>No Disponible</th>
                <th>Patrocinador</th>
                <th>País</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, i) in users" v-show="user.visible">
                <th>{{ users.length - i }}</th>
                <td>{{ user.date | date }}</td>
                <td style="position: relative;">
                  <span v-if="!user.edit">{{ user.name }} {{ user.lastName }}</span>

                  <input class="input" v-model="user._name"     placeholder="Nombre"   style="max-width: 120px;" v-if="user.edit">
                  <input class="input" v-model="user._lastName" placeholder="Apellido" style="max-width: 120px;" v-if="user.edit"> <br>

                  <a v-if="!user.edit">{{ user.dni }}</a>

                  <input class="input" v-model="user._dni" placeholder="Documento" style="max-width: 120px;" v-if="user.edit">

                  <input class="input" v-model= "user._password" placeholder="Contraseña" style="max-width: 240px;" v-if="user.edit"><br>

                  <div style="position: absolute; top: 8px; right: -8px;">
                    <i
                      class="fa-regular fa-pen-to-square"
                      style="color: #ccc; cursor: pointer; margin-right: 8px;"
                      v-if="!user.edit"
                      @click="edit(user)"></i>
                    <i
                      class="fa-solid fa-check"
                      style="color: #ccc; cursor: pointer; margin-right: 8px;"
                      v-if="user.edit"
                      @click="save(user)"></i>
                    <i
                      class="fa-solid fa-xmark"
                      style="color: #ccc; cursor: pointer; margin-right: 8px;"
                      v-if="user.edit"
                      @click="cancel(user)"></i>
                  </div> <br>

                  <p v-if="user.rank">rango: {{ user.rank }}</p>
                  tel: {{ user.phone }} <br>

                </td>
                <td>
                  <span v-if="user.activated">Activado</span>
                  <span v-else-if="user.affiliated">Afiliado</span>
                  <span v-else>Registrado</span>
                </td>
                <td>{{ user.token }}</td>
                <td>
                  <p v-if="!user.edit">{{ user.points }}</p>

                  <input class="input" v-model="user._points" placeholder="Puntos" style="max-width: 120px;" v-if="user.edit">

                </td>
                <td>
                  <!-- <span v-if="user.balance != 0">
                    {{ user.balance | money }}
                  </span> -->
                  {{ user.balance | money }}
                </td>
                <td>
                  {{ user.virtualbalance | money }} <br>
                  <a v-if="user.virtualbalance > 0" @click="migrate(user)">migrar saldo</a>
                </td>
                <td>
                  <div v-if="user.parent">
                    {{ user.parent.name }} {{ user.parent.lastName }} <br>

                    <a v-if="!user.edit">{{ user.parent.dni }}</a>

                    <input class="input" v-model="user._parent_dni" placeholder="Documento" style="max-width: 120px;" v-if="user.edit"><br>

                    {{ user.parent.phone }}
                  </div>
                </td>
                <td>{{ user.country }}</td>
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

export default {
  components: { Layout },
  data() {
    return{
      users: [],

      loading: true,

      title: null,

      search: null,
      check:  null,

      show: false,
    }
  },
  computed: {
    balance() {

      const ret = this.users.reduce((a, b) => a + Number(b.balance), 0)

      return ret
    },
    virtualBalance() {

      const ret = this.users.reduce((a, b) => a + Number(b.virtualbalance), 0)

      return ret
    },
  },
  filters: {
    date(val) {
      return new Date(val).toLocaleDateString()
      // return new Date(val).toLocaleString()
    },
    money(val) {
      if(val == null) return val
      return `USD ${val.toFixed(2)}`
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.GET(to.params.filter); next()
  },
  created() {
    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)

    this.GET(this.$route.params.filter)
  },
  methods: {
    async GET(filter) {

      this.loading = true

      // GET data
      const { data } = await api.users.GET({ filter }); console.log({ data })

      this.loading = false

      // error
      if(data.error && data.msg == 'invalid filter') this.$router.push('activations/all')

      // success
      this.users = data.users
                    .map(i => ({
                      ...i,
                      sending: false,
                      visible: true,
                      edit: false,
                      _name: '',
                      _lastName: '',
                      _dni: '',
                      _password: '',
                      _parent_dni: '',
                      _points: 0,
                    }))
                    .reverse()

      if(filter == 'all')        this.title = 'Todos los usuarios'
      if(filter == 'affiliated') this.title = 'Usuarios Afiliados'
      if(filter == 'activated')  this.title = 'Usuarios Activados'
    },
    input() {
      if(!this.search) return

      const words = this.search.match(/\b(\w+)\b/g)
      console.log({ words })

      for(let word of words) {
        for(let user of this.users) {
          if(
            user.name.toLowerCase().includes(word.toLowerCase()) ||
            user.lastName.toLowerCase().includes(word.toLowerCase()) ||
            user.country.toLowerCase().includes(word.toLowerCase()) ||
            user.dni.toLowerCase().includes(word.toLowerCase())) {

            user.visible = true
          }
          else {
            user.visible = false
          }
        }
      }

    },
    input2() {

      const check = this.check
      console.log({ check })

      for(let user of this.users) {
        if( !check || (check && user.balance > 0) ) {

          user.visible = true
        }
        else {
          user.visible = false
        }
      }
    },

    async migrate(user) {
      console.log('migrate ..')
      console.log({ user })

      if(!confirm("Desea migrar el saldo no disponible?")) return

      user.balance += user.virtualbalance
      user.virtualbalance = 0

      const { data } = await api.users.POST({ action: 'migrate', id: user.id }); console.log({ data })

    },
    edit(user) {
      user.edit = true
      if(!user._name)     user._name     = user.name
      if(!user._lastName) user._lastName = user.lastName
      if(!user._dni)      user._dni      = user.dni
      if(!user._points)   user._points   = user.points

      if(!user._parent_dni) user._parent_dni = user.parent.dni
    },
    async save(user) {
      // post new name
      const { data } = await api.users.POST({
        action: 'name',
        id: user.id,
        data: {
          _name:     user._name,
          _lastName: user._lastName,
          _dni:      user._dni,
          _password: user._password,

          _parent_dni: user._parent_dni,
          _points:     user._points,
        }
      })

      user.name     = user._name
      user.lastName = user._lastName
      user.dni      = user._dni
      user.points   = user._points

      user.parent.dni = user._parent_dni

      user.edit = false
    },
    cancel(user) {
      user.edit = false
    },
  }
};
</script>
