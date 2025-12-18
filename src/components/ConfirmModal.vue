<template>
  <transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="handleCancel">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-icon" :class="`modal-icon-${type}`">
            <i :class="getIcon(type)"></i>
          </div>
          <h3 class="modal-title">{{ title }}</h3>
          <button class="modal-close" @click="handleCancel">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-message">{{ message }}</p>
          <div v-if="details" class="modal-details">
            {{ details }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-cancel" @click="handleCancel">
            {{ cancelText }}
          </button>
          <button class="modal-btn modal-btn-confirm" :class="`modal-btn-${type}`" @click="handleConfirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirmar acción'
    },
    message: {
      type: String,
      required: true
    },
    details: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'warning', // warning, danger, info
      validator: (value) => ['warning', 'danger', 'info'].includes(value)
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    cancelText: {
      type: String,
      default: 'Cancelar'
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm')
      this.$emit('update:show', false)
      document.body.style.overflow = ''
    },
    handleCancel() {
      this.$emit('cancel')
      this.$emit('update:show', false)
      document.body.style.overflow = ''
    },
    getIcon(type) {
      const icons = {
        warning: 'fas fa-exclamation-triangle',
        danger: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
      }
      return icons[type] || icons.warning
    }
  },
  beforeDestroy() {
    document.body.style.overflow = ''
  }
}
</script>

<style lang="stylus" scoped>
.modal-overlay
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background rgba(0, 0, 0, 0.6)
  display flex
  align-items center
  justify-content center
  z-index 10000
  padding 20px
  animation fadeIn 0.2s ease

@keyframes fadeIn
  from
    opacity 0
  to
    opacity 1

.modal-container
  background white
  border-radius 16px
  box-shadow 0 20px 60px rgba(0, 0, 0, 0.3)
  max-width 500px
  width 100%
  max-height 90vh
  overflow hidden
  display flex
  flex-direction column
  animation slideUp 0.3s ease-out

@keyframes slideUp
  from
    transform translateY(50px)
    opacity 0
  to
    transform translateY(0)
    opacity 1

.modal-header
  padding 24px
  display flex
  align-items center
  gap 16px
  border-bottom 1px solid #f0f0f0
  position relative

.modal-icon
  width 48px
  height 48px
  border-radius 50%
  display flex
  align-items center
  justify-content center
  font-size 24px
  flex-shrink 0

.modal-icon-warning
  background linear-gradient(135deg, #ff9800 0%, #f57c00 100%)
  color white

.modal-icon-danger
  background linear-gradient(135deg, #f44336 0%, #da190b 100%)
  color white

.modal-icon-info
  background linear-gradient(135deg, #2196f3 0%, #1976d2 100%)
  color white

.modal-title
  flex 1
  margin 0
  font-size 20px
  font-weight 700
  color #333

.modal-close
  background transparent
  border none
  color #999
  cursor pointer
  padding 8px
  font-size 20px
  transition all 0.2s ease
  border-radius 50%
  width 36px
  height 36px
  display flex
  align-items center
  justify-content center

  &:hover
    background rgba(0, 0, 0, 0.05)
    color #333

.modal-body
  padding 24px
  flex 1
  overflow-y auto

.modal-message
  font-size 16px
  color #666
  line-height 1.6
  margin 0 0 12px 0

.modal-details
  background #f8f9fa
  padding 12px
  border-radius 8px
  font-size 14px
  color #666
  margin-top 12px
  border-left 3px solid #667eea

.modal-footer
  padding 20px 24px
  border-top 1px solid #f0f0f0
  display flex
  gap 12px
  justify-content flex-end

.modal-btn
  padding 12px 24px
  border-radius 8px
  font-weight 600
  font-size 14px
  cursor pointer
  transition all 0.2s ease
  border none
  min-width 100px

.modal-btn-cancel
  background #f5f5f5
  color #666

  &:hover
    background #e0e0e0
    transform translateY(-1px)

.modal-btn-confirm
  background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  color white

  &:hover
    transform translateY(-2px)
    box-shadow 0 4px 12px rgba(102, 126, 234, 0.4)

.modal-btn-warning
  background linear-gradient(135deg, #ff9800 0%, #f57c00 100%)

.modal-btn-danger
  background linear-gradient(135deg, #f44336 0%, #da190b 100%)

.modal-enter-active, .modal-leave-active
  transition all 0.3s ease

.modal-enter, .modal-leave-to
  opacity 0

  .modal-container
    transform translateY(50px)

@media (max-width: 768px)
  .modal-container
    max-width 100%
    margin 20px

  .modal-header
    padding 20px

  .modal-body
    padding 20px

  .modal-footer
    flex-direction column-reverse
    padding 16px 20px

    .modal-btn
      width 100%
</style>




