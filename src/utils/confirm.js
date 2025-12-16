// Helper para usar el modal de confirmación
// Uso: this.$confirm.show({ title, message, type, onConfirm, onCancel })

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

        // Crear componente modal dinámicamente
        const ConfirmModal = Vue.extend({
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
          `,
          components: {
            ConfirmModal: () => import('@/components/ConfirmModal.vue')
          },
          data() {
            return {
              show: true,
              title,
              message,
              details,
              type,
              confirmText,
              cancelText
            }
          },
          methods: {
            handleConfirm() {
              onConfirm()
              this.show = false
              this.$destroy()
              document.body.removeChild(this.$el)
            },
            handleCancel() {
              onCancel()
              this.show = false
              this.$destroy()
              document.body.removeChild(this.$el)
            }
          }
        })

        const instance = new ConfirmModal()
        instance.$mount()
        document.body.appendChild(instance.$el)
      }
    }
  }
}

