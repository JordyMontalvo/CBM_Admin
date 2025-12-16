// Helper para usar el modal de confirmación
// Uso: this.$confirm.show({ title, message, type, onConfirm, onCancel })

import Vue from 'vue'

// Crear un Event Bus para comunicación
const ConfirmEventBus = new Vue()

export default {
  install(Vue) {
    Vue.prototype.$confirm = {
      show(options) {
        const {
          title = 'Confirmar acción',
          message = '¿Estás seguro?',
          details = '',
          type = 'warning',
          confirmText = 'Confirmar',
          cancelText = 'Cancelar',
          onConfirm = () => {},
          onCancel = () => {}
        } = options

        // Emitir evento para mostrar el modal
        ConfirmEventBus.$emit('show', {
          title,
          message,
          details,
          type,
          confirmText,
          cancelText,
          onConfirm,
          onCancel
        })
      }
    }

    // Hacer el Event Bus disponible globalmente
    Vue.prototype.$confirmBus = ConfirmEventBus
  }
}

export { ConfirmEventBus }

