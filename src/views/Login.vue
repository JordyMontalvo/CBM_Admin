<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-container">
          <img src="@/assets/logo.svg" alt="CBM Admin" class="login-logo">
        </div>
        <h1 class="login-title">Bienvenido</h1>
        <p class="login-subtitle">Inicia sesión en tu cuenta</p>
      </div>

      <form @submit.prevent="submit" class="login-form">
        <div class="form-group">
          <label class="form-label">
            <i class="fas fa-user"></i>
            <span>Usuario</span>
          </label>
          <div class="input-wrapper" :class="{'error': error.email}">
            <i class="input-icon fas fa-user"></i>
            <input 
              class="form-input" 
              type="text" 
              placeholder="Ingresa tu usuario"
              v-model="email"
              @keydown="reset('email')"
              @focus="reset('email')"
            >
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <i class="fas fa-lock"></i>
            <span>Contraseña</span>
          </label>
          <div class="input-wrapper" :class="{'error': error.password}">
            <i class="input-icon fas fa-lock"></i>
            <input 
              class="form-input" 
              type="password" 
              placeholder="Ingresa tu contraseña"
              v-model="password"
              @keydown="reset('password')"
              @focus="reset('password')"
            >
          </div>
        </div>

        <div class="alert-message" v-if="alert">
          <i class="fas fa-exclamation-circle"></i>
          <span>{{ alert | alert }}</span>
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="!loading">Iniciar Sesión</span>
          <span v-else class="button-loading">
            <i class="fas fa-spinner fa-spin"></i>
            Iniciando...
          </span>
        </button>
      </form>

      <div class="login-footer">
        <p class="footer-text">Sistema de Administración CBM</p>
      </div>
    </div>
  </div>
</template>

<script>
import Layout from '@/views/Layout'
import api    from '@/api'

export default {
  components: { Layout },
  data() {
    return{
      email:    null,
      password: null,
      error: {
        email:    false,
        password: false,
      },
      alert:   null,
      loading: false,
    }
  },
  computed: {
    accounts() { return this.$store.state.accounts },
  },
  filters: {
    alert(msg) {
      if (msg == 'invalid email')   return 'Usuario incorrecto'
      if (msg == 'invalid password') return 'Contraseña incorrecta'
      if (msg == 'invalid account') return 'Cuenta incorrecta'
    },
  },
  methods: {
    async submit() {
      this.loading = true
      this.alert = null

      const { email, password } = this

      // valid fields
      if(!email)    { 
        this.loading = false
        return this.error.email = true 
      }
      if(!password) { 
        this.loading = false
        return this.error.password = true 
      }

      const account = this.accounts.find(x => x.email == email && x.password == password)

      // error
      if(!account) {
        this.loading = false
        return this.alert = 'invalid account'
      }

      // login
      localStorage.setItem('session', JSON.stringify(account))

      // token
      localStorage.setItem('token', 'xTzntsznsih1jrD9nj')

      // routing
      this.$router.push('/affiliations/all')
      this.loading = false

    },
    reset(name) {
      this.alert = null

      if(name == 'email')    this.error.email    = false
      if(name == 'password') this.error.password = false
    },
  }
};
</script>

<style lang="stylus" scoped>
.login-container
  min-height 100vh
  display flex
  align-items center
  justify-content center
  background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  padding 20px
  position relative
  overflow hidden

  &::before
    content ''
    position absolute
    top -50%
    right -50%
    width 200%
    height 200%
    background radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
    background-size 50px 50px
    animation float 20s infinite linear
    opacity 0.3

@keyframes float
  0%
    transform translate(0, 0)
  100%
    transform translate(-50px, -50px)

.login-card
  background white
  border-radius 20px
  box-shadow 0 20px 60px rgba(0, 0, 0, 0.3)
  width 100%
  max-width 450px
  padding 40px
  position relative
  z-index 1
  animation slideUp 0.5s ease-out

@keyframes slideUp
  from
    opacity 0
    transform translateY(30px)
  to
    opacity 1
    transform translateY(0)

.login-header
  text-align center
  margin-bottom 40px

.logo-container
  margin-bottom 20px

.login-logo
  height 80px
  width auto
  margin 0 auto

.login-title
  font-size 32px
  font-weight 700
  color #333
  margin 0 0 10px 0
  background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  -webkit-background-clip text
  -webkit-text-fill-color transparent
  background-clip text

.login-subtitle
  color #666
  font-size 16px
  margin 0

.login-form
  margin-bottom 30px

.form-group
  margin-bottom 25px

.form-label
  display flex
  align-items center
  gap 8px
  color #333
  font-weight 600
  font-size 14px
  margin-bottom 10px

  i
    color #667eea
    font-size 14px

.input-wrapper
  position relative
  display flex
  align-items center
  border 2px solid #e0e0e0
  border-radius 12px
  transition all 0.3s ease
  background #f8f9fa

  &:focus-within
    border-color #667eea
    background white
    box-shadow 0 0 0 4px rgba(102, 126, 234, 0.1)

  &.error
    border-color #f5576c
    background #fff5f5

    &:focus-within
      box-shadow 0 0 0 4px rgba(245, 87, 108, 0.1)

.input-icon
  position absolute
  left 18px
  color #999
  font-size 16px
  z-index 1
  transition color 0.3s ease

.input-wrapper:focus-within .input-icon
  color #667eea

.form-input
  width 100%
  padding 15px 20px 15px 50px
  border none
  background transparent
  font-size 15px
  color #333
  outline none
  transition all 0.3s ease

  &::placeholder
    color #999

  &:focus
    color #333

.alert-message
  display flex
  align-items center
  gap 10px
  padding 12px 16px
  background #fff5f5
  border 1px solid #f5576c
  border-radius 8px
  color #f5576c
  font-size 14px
  margin-bottom 20px
  animation shake 0.5s ease

  i
    font-size 16px

@keyframes shake
  0%, 100%
    transform translateX(0)
  25%
    transform translateX(-10px)
  75%
    transform translateX(10px)

.login-button
  width 100%
  padding 16px
  background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  color white
  border none
  border-radius 12px
  font-size 16px
  font-weight 600
  cursor pointer
  transition all 0.3s ease
  box-shadow 0 4px 15px rgba(102, 126, 234, 0.4)
  position relative
  overflow hidden

  &::before
    content ''
    position absolute
    top 50%
    left 50%
    width 0
    height 0
    border-radius 50%
    background rgba(255, 255, 255, 0.3)
    transform translate(-50%, -50%)
    transition width 0.6s, height 0.6s

  &:hover:not(:disabled)
    transform translateY(-2px)
    box-shadow 0 6px 20px rgba(102, 126, 234, 0.5)

    &::before
      width 300px
      height 300px

  &:active:not(:disabled)
    transform translateY(0)

  &:disabled
    opacity 0.7
    cursor not-allowed
    transform none

.button-loading
  display flex
  align-items center
  justify-content center
  gap 10px

  i
    font-size 16px

.login-footer
  text-align center
  padding-top 20px
  border-top 1px solid #e0e0e0

.footer-text
  color #999
  font-size 13px
  margin 0

@media (max-width: 480px)
  .login-card
    padding 30px 20px

  .login-title
    font-size 26px

  .login-logo
    height 60px
</style>
