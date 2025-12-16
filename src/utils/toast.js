// Helper para mostrar notificaciones toast
export const toast = {
  success(title, message = '') {
    this.$root.$emit('toast', {
      type: 'success',
      title,
      message,
      duration: 4000
    })
  },
  error(title, message = '') {
    this.$root.$emit('toast', {
      type: 'error',
      title,
      message,
      duration: 5000
    })
  },
  warning(title, message = '') {
    this.$root.$emit('toast', {
      type: 'warning',
      title,
      message,
      duration: 4000
    })
  },
  info(title, message = '') {
    this.$root.$emit('toast', {
      type: 'info',
      title,
      message,
      duration: 4000
    })
  }
}

// Plugin para usar en componentes
export default {
  install(Vue) {
    Vue.prototype.$toast = {
      success: (title, message) => {
        Vue.prototype.$root.$emit('toast', {
          type: 'success',
          title,
          message,
          duration: 4000
        })
      },
      error: (title, message) => {
        Vue.prototype.$root.$emit('toast', {
          type: 'error',
          title,
          message,
          duration: 5000
        })
      },
      warning: (title, message) => {
        Vue.prototype.$root.$emit('toast', {
          type: 'warning',
          title,
          message,
          duration: 4000
        })
      },
      info: (title, message) => {
        Vue.prototype.$root.$emit('toast', {
          type: 'info',
          title,
          message,
          duration: 4000
        })
      }
    }
  }
}

