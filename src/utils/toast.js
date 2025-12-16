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

// Event bus para toasts
let eventBus = null;

// Plugin para usar en componentes
export default {
  install(Vue) {
    // Crear un event bus
    eventBus = new Vue();
    
    Vue.prototype.$toast = {
      success: (title, message) => {
        eventBus.$emit('toast', {
          type: 'success',
          title,
          message,
          duration: 4000
        })
      },
      error: (title, message) => {
        eventBus.$emit('toast', {
          type: 'error',
          title,
          message,
          duration: 5000
        })
      },
      warning: (title, message) => {
        eventBus.$emit('toast', {
          type: 'warning',
          title,
          message,
          duration: 4000
        })
      },
      info: (title, message) => {
        eventBus.$emit('toast', {
          type: 'info',
          title,
          message,
          duration: 4000
        })
      }
    }
  }
}

// Exportar eventBus para uso en componentes
export { eventBus }

