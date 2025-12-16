// Helper para usar el modal de confirmación
// Uso: this.$confirm.show({ title, message, type, onConfirm, onCancel })

import ConfirmModal from '@/components/ConfirmModal.vue'

export default {
  install(Vue) {
    // Crear un contenedor para el modal
    const modalContainer = document.createElement('div')
    document.body.appendChild(modalContainer)

    // Crear una instancia de Vue para el modal
    const ModalComponent = Vue.extend({
      components: {
        ConfirmModal
      },
      data() {
        return {
          show: false,
          title: '',
          message: '',
          details: '',
          type: 'warning',
          confirmText: 'Confirmar',
          cancelText: 'Cancelar',
          onConfirm: null,
          onCancel: null
        }
      },
      methods: {
        handleConfirm() {
          if (this.onConfirm) {
            this.onConfirm()
          }
          this.show = false
        },
        handleCancel() {
          if (this.onCancel) {
            this.onCancel()
          }
          this.show = false
        },
        open(options) {
          this.title = options.title || 'Confirmar acción'
          this.message = options.message || '¿Estás seguro?'
          this.details = options.details || ''
          this.type = options.type || 'warning'
          this.confirmText = options.confirmText || 'Confirmar'
          this.cancelText = options.cancelText || 'Cancelar'
          this.onConfirm = options.onConfirm || (() => {})
          this.onCancel = options.onCancel || (() => {})
          this.show = true
        }
      },
      template: `
        <ConfirmModal
          :show.sync="show"
          :title="title"
          :message="message"
          :details="details"
          :type="type"
          :confirm-text="confirmText"
          :cancel-text="cancelText"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        />
      `
    })

    const modalInstance = new ModalComponent()
    modalInstance.$mount(modalContainer)

    Vue.prototype.$confirm = {
      show(options) {
        modalInstance.open(options)
      }
    }
  }
}

