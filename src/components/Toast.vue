<template>
  <transition-group name="toast" tag="div" class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast', `toast-${toast.type}`]"
    >
      <div class="toast-icon">
        <i :class="getIcon(toast.type)"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">{{ toast.title }}</div>
        <div class="toast-message" v-if="toast.message">{{ toast.message }}</div>
      </div>
      <button class="toast-close" @click="removeToast(toast.id)">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </transition-group>
</template>

<script>
export default {
  name: 'Toast',
  data() {
    return {
      toasts: []
    }
  },
  mounted() {
    // Escuchar eventos globales de toast
    this.$root.$on('toast', this.addToast)
  },
  beforeDestroy() {
    this.$root.$off('toast', this.addToast)
  },
  methods: {
    addToast(toast) {
      const id = Date.now() + Math.random()
      const newToast = {
        id,
        type: toast.type || 'info',
        title: toast.title,
        message: toast.message,
        duration: toast.duration || 4000
      }
      
      this.toasts.push(newToast)
      
      // Auto-remover después de la duración
      setTimeout(() => {
        this.removeToast(id)
      }, newToast.duration)
    },
    removeToast(id) {
      this.toasts = this.toasts.filter(toast => toast.id !== id)
    },
    getIcon(type) {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      }
      return icons[type] || icons.info
    }
  }
}
</script>

<style lang="stylus" scoped>
.toast-container
  position fixed
  top 20px
  right 20px
  z-index 10000
  display flex
  flex-direction column
  gap 12px
  max-width 400px
  pointer-events none

.toast
  display flex
  align-items flex-start
  gap 12px
  padding 16px 20px
  background white
  border-radius 12px
  box-shadow 0 8px 25px rgba(0, 0, 0, 0.15)
  min-width 300px
  max-width 400px
  pointer-events auto
  border-left 4px solid #667eea
  animation slideInRight 0.3s ease-out

@keyframes slideInRight
  from
    transform translateX(400px)
    opacity 0
  to
    transform translateX(0)
    opacity 1

.toast-success
  border-left-color #4caf50
  background linear-gradient(135deg, #ffffff 0%, #f1f8f4 100%)

.toast-error
  border-left-color #f44336
  background linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)

.toast-warning
  border-left-color #ff9800
  background linear-gradient(135deg, #ffffff 0%, #fff8f0 100%)

.toast-info
  border-left-color #2196f3
  background linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)

.toast-icon
  font-size 24px
  flex-shrink 0
  margin-top 2px

.toast-success .toast-icon
  color #4caf50

.toast-error .toast-icon
  color #f44336

.toast-warning .toast-icon
  color #ff9800

.toast-info .toast-icon
  color #2196f3

.toast-content
  flex 1
  min-width 0

.toast-title
  font-weight 700
  font-size 15px
  color #333
  margin-bottom 4px

.toast-message
  font-size 13px
  color #666
  line-height 1.4

.toast-close
  background transparent
  border none
  color #999
  cursor pointer
  padding 4px
  font-size 14px
  transition all 0.2s ease
  flex-shrink 0
  width 24px
  height 24px
  display flex
  align-items center
  justify-content center
  border-radius 4px

  &:hover
    background rgba(0, 0, 0, 0.05)
    color #333

.toast-enter-active, .toast-leave-active
  transition all 0.3s ease

.toast-enter
  transform translateX(400px)
  opacity 0

.toast-leave-to
  transform translateX(400px)
  opacity 0

@media (max-width: 768px)
  .toast-container
    right 10px
    left 10px
    max-width none

  .toast
    min-width auto
    max-width none
</style>

