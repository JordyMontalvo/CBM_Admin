<template>
  <div id="app">
    <router-view/>
    <Toast />
  </div>
</template>

<script>
import Toast from './components/Toast.vue'

export default {
  components: {
    Toast
  },
  created() {
    console.log('App ...')

    const path = this.$router.history.current.path ; console.log({ path })

    if(path != '/login' && path != '/sucursal' && path != '/logout') {
      console.log('validate security token ...')

      const token = localStorage.getItem('token')

      if(token != 'xTzntsznsih1jrD9nj') {
        console.log('invalid security token ...')

        this.$router.push('/logout')
      }
    }
  },
};
</script>

<style lang="stylus">
  *
    box-sizing border-box

  body
    margin 0
    padding 0
    font-family -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale

  #app
    min-height 100vh

  .load
    display block
    height 40px
    width 40px
    border-radius 50%
    border solid 3px rgba(102, 126, 234, 0.2)
    border-top-color #667eea
    border-right-color #667eea
    animation 1s linear infinite rotate
    margin 40px auto
    box-shadow 0 4px 15px rgba(102, 126, 234, 0.3)

  @keyframes rotate
    from
      transform rotate(0deg)
    to
      transform rotate(360deg)

  // Contenedor de carga mejorado
  .loading-container
    display flex
    flex-direction column
    align-items center
    justify-content center
    min-height 400px
    padding 40px

    .spinner
      width 50px
      height 50px
      border 4px solid rgba(102, 126, 234, 0.2)
      border-top-color #667eea
      border-radius 50%
      animation 1s linear infinite rotate
      margin-bottom 20px

    p
      color #666
      font-size 16px
      font-weight 500

  .row
    display flex
    .el
      flex 1
      text-align center
      margin 8px 0

  // Mejoras globales para tablas
  .table-container
    background white
    border-radius 12px
    box-shadow 0 2px 10px rgba(0, 0, 0, 0.05)
    overflow-x auto
    overflow-y visible
    margin-bottom 20px
    width 100%
    max-width 100%
    margin-left 0
    margin-right 0
    -webkit-overflow-scrolling touch
    position relative

    &::-webkit-scrollbar
      height 8px

    &::-webkit-scrollbar-track
      background #f1f1f1
      border-radius 4px

    &::-webkit-scrollbar-thumb
      background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
      border-radius 4px

      &:hover
        background linear-gradient(135deg, #5568d3 0%, #653a8f 100%)

  .table
    width 100%
    min-width 100%
    margin 0
    background white
    border-collapse collapse
    table-layout auto

    thead
      background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
      color white
      position sticky
      top 0
      z-index 10

      th
        padding 16px 12px
        font-weight 700
        text-transform uppercase
        font-size 12px
        letter-spacing 0.5px
        border none
        text-align center
        white-space nowrap
        color #ffffff !important
        position relative

        &:first-child
          padding-left 16px

        &:last-child
          padding-right 16px

    tbody
      tr
        transition all 0.2s ease
        border-bottom 1px solid #e8e8e8

        &:hover
          background #f8f9fa
          transform scale(1.001)
          box-shadow 0 2px 8px rgba(0, 0, 0, 0.05)

        &:last-child
          border-bottom none

        &:nth-child(even)
          background #fafafa

        &:nth-child(even):hover
          background #f0f0f0

      td, th
        padding 14px 12px
        vertical-align top
        border none
        font-size 14px
        line-height 1.5
        word-wrap break-word
        max-width 300px

        &:first-child
          padding-left 16px
          font-weight 600
          color #667eea

        &:last-child
          padding-right 16px

      a
        color #667eea
        text-decoration none
        font-weight 500
        transition color 0.2s ease

        &:hover
          color #764ba2
          text-decoration underline

  // Mejoras para notificaciones
  .notification
    border-radius 12px
    box-shadow 0 4px 15px rgba(0, 0, 0, 0.1)
    border none
    padding 20px
    margin-bottom 20px
    background white
    border-left 4px solid #667eea

    &.is-primary
      background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
      color white
      border-left none

    strong
      font-size 18px
      font-weight 700
      color #333
      display block
      margin-bottom 15px

    a
      color #667eea
      text-decoration none
      font-weight 600
      transition all 0.2s ease
      padding 8px 16px
      border-radius 6px
      display inline-block
      background rgba(102, 126, 234, 0.1)

      &:hover
        background rgba(102, 126, 234, 0.2)
        transform translateY(-2px)
        box-shadow 0 4px 12px rgba(102, 126, 234, 0.3)

  // Mejoras para inputs
  .input
    border 2px solid #e0e0e0
    border-radius 8px
    padding 12px 16px
    font-size 14px
    transition all 0.3s ease
    background white
    width 100%
    box-sizing border-box

    &:focus
      border-color #667eea
      box-shadow 0 0 0 4px rgba(102, 126, 234, 0.1)
      outline none
      transform translateY(-1px)

    &::placeholder
      color #999

    &.is-danger
      border-color #f5576c
      background #fff5f5

  // Inputs de fecha mejorados
  .date-input
    border 2px solid #e0e0e0
    border-radius 8px
    padding 10px 14px
    font-size 14px
    transition all 0.3s ease
    background white
    cursor pointer

    &:focus
      border-color #667eea
      box-shadow 0 0 0 4px rgba(102, 126, 234, 0.1)
      outline none

  // Contenedor de filtros de fecha
  .date-filter-container
    display flex
    align-items center
    gap 10px
    flex-wrap wrap
    margin-bottom 10px

  // Botón de limpiar filtros
  .clear-filter-btn
    background #f5576c
    color white
    border none
    border-radius 8px
    padding 10px 14px
    cursor pointer
    transition all 0.3s ease
    display flex
    align-items center
    justify-content center
    width 40px
    height 40px

    &:hover
      background #e63946
      transform scale(1.1)
      box-shadow 0 4px 12px rgba(245, 87, 108, 0.4)

  // Mejoras para botones
  .button
    border-radius 8px
    padding 12px 24px
    font-weight 600
    transition all 0.3s ease
    border none
    cursor pointer
    box-shadow 0 2px 8px rgba(0, 0, 0, 0.1)
    font-size 14px
    display inline-flex
    align-items center
    gap 8px

    &.is-link, &.is-primary
      background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
      color white

      &:hover
        transform translateY(-2px)
        box-shadow 0 4px 15px rgba(102, 126, 234, 0.4)

      &:active
        transform translateY(0)

    &:disabled
      opacity 0.6
      cursor not-allowed
      transform none !important

  // Botones de acción en tablas
  .btn-action
    padding 6px 12px
    border-radius 6px
    font-size 12px
    font-weight 600
    border none
    cursor pointer
    transition all 0.2s ease

    &.btn-approve
      background #4caf50
      color white

      &:hover
        background #45a049
        transform translateY(-1px)

    &.btn-reject
      background #f44336
      color white

      &:hover
        background #da190b
        transform translateY(-1px)

    &.btn-edit
      background #ff9800
      color white

      &:hover
        background #f57c00
        transform translateY(-1px)

  // Mejoras para contenedores
  .container
    max-width 100%
    width 100%
    margin 0 auto
    padding 0 20px
    box-sizing border-box

  .section
    padding 30px 0
    width 100%
    max-width 100%
    box-sizing border-box

  // Mejoras para paginación
  .pagination
    display flex
    align-items center
    justify-content center
    gap 10px
    margin 30px 0
    flex-wrap wrap

  .pagination-button
    padding 10px 20px
    background white
    border 2px solid #e0e0e0
    border-radius 8px
    cursor pointer
    font-weight 600
    transition all 0.3s ease
    color #333

    &:hover:not(:disabled)
      background #667eea
      color white
      border-color #667eea
      transform translateY(-2px)
      box-shadow 0 4px 12px rgba(102, 126, 234, 0.3)

    &:disabled
      opacity 0.5
      cursor not-allowed

  .pagination-info
    padding 10px 20px
    font-weight 600
    color #666

  .pagination-input
    width 80px
    padding 10px
    border 2px solid #e0e0e0
    border-radius 8px
    text-align center
    font-weight 600

    &:focus
      border-color #667eea
      outline none
      box-shadow 0 0 0 4px rgba(102, 126, 234, 0.1)

  // Scroll to top button mejorado
  .scroll-to-top
    position fixed
    bottom 30px
    right 30px
    width 50px
    height 50px
    background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
    color white
    border none
    border-radius 50%
    cursor pointer
    z-index 1000
    box-shadow 0 4px 15px rgba(102, 126, 234, 0.4)
    display flex
    align-items center
    justify-content center
    transition all 0.3s ease

    &:hover
      transform translateY(-5px) scale(1.1)
      box-shadow 0 6px 20px rgba(102, 126, 234, 0.5)

    i
      font-size 20px

  // Mejoras para select
  select
    border 2px solid #e0e0e0
    border-radius 8px
    padding 10px 16px
    font-size 14px
    background white
    cursor pointer
    transition all 0.3s ease
    appearance none
    background-image url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23667eea' d='M6 9L1 4h10z'/%3E%3C/svg%3E")
    background-repeat no-repeat
    background-position right 12px center
    padding-right 40px

    &:focus
      border-color #667eea
      outline none
      box-shadow 0 0 0 4px rgba(102, 126, 234, 0.1)
      transform translateY(-1px)

    &:hover
      border-color #667eea

  // Select de Bulma mejorado
  .select
    select
      width 100%
      height auto
      padding-right 40px

  // Mejoras para checkboxes
  input[type="checkbox"]
    width 20px
    height 20px
    cursor pointer
    accent-color #667eea
    border-radius 4px
    transition all 0.2s ease

    &:hover
      transform scale(1.1)

    &:checked
      background-color #667eea
      border-color #667eea

  // Cards modernos
  .card
    background white
    border-radius 12px
    box-shadow 0 2px 10px rgba(0, 0, 0, 0.05)
    padding 20px
    margin-bottom 20px
    transition all 0.3s ease
    border 1px solid #f0f0f0

    &:hover
      box-shadow 0 4px 20px rgba(0, 0, 0, 0.1)
      transform translateY(-2px)
      border-color #667eea

  // Enlaces mejorados
  a
    color #667eea
    text-decoration none
    transition all 0.2s ease
    font-weight 500

    &:hover
      color #764ba2
      text-decoration underline

  // Mejoras para texto destacado
  strong
    font-weight 700
    color #333

  // Separadores visuales
  hr
    border none
    height 1px
    background linear-gradient(90deg, transparent, #e0e0e0, transparent)
    margin 20px 0

  // Mejoras adicionales para tablas
  .notification
    .container
      max-width 100%
      width 100%
      padding 0

  // Badges de estado mejorados
  .status-badge
    display inline-block
    padding 6px 12px
    border-radius 20px
    font-size 12px
    font-weight 600
    text-transform uppercase
    letter-spacing 0.5px

    &.approved, &.has-text-success
      background linear-gradient(135deg, #4caf50 0%, #45a049 100%)
      color white
      box-shadow 0 2px 8px rgba(76, 175, 80, 0.3)

    &.pending
      background linear-gradient(135deg, #ff9800 0%, #f57c00 100%)
      color white
      box-shadow 0 2px 8px rgba(255, 152, 0, 0.3)

    &.rejected, &.has-text-danger
      background linear-gradient(135deg, #f44336 0%, #da190b 100%)
      color white
      box-shadow 0 2px 8px rgba(244, 67, 54, 0.3)

  // Mejoras para texto de estado
  .has-text-success
    color #4caf50 !important
    font-weight 600

  .has-text-danger
    color #f44336 !important
    font-weight 600

  // Cards de estadísticas
  .stats-card
    background white
    border-radius 12px
    padding 20px
    box-shadow 0 2px 10px rgba(0, 0, 0, 0.05)
    transition all 0.3s ease
    border-left 4px solid #667eea

    &:hover
      transform translateY(-4px)
      box-shadow 0 8px 25px rgba(0, 0, 0, 0.1)

    .stats-icon
      font-size 32px
      color #667eea
      margin-bottom 10px

    .stats-value
      font-size 28px
      font-weight 700
      color #333
      margin 10px 0

    .stats-label
      color #666
      font-size 14px
      text-transform uppercase
      letter-spacing 0.5px

  // Mejoras para small text
  small
    font-size 13px
    color #666
    line-height 1.6

  // Scroll horizontal visible para tablas grandes
  @media (max-width: 768px)
    .table-container
      border-radius 8px

      .table
        font-size 12px

        thead th
          padding 12px 8px
          font-size 11px

        tbody td, tbody th
          padding 10px 8px
          font-size 12px

    .notification
      padding 15px

    .button
      padding 10px 20px
      font-size 13px

</style>
