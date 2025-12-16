<template>
  <Layout>
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando estadísticas...</p>
    </div>

    <section v-else>
      <!-- Cards de Estadísticas -->
      <div class="stats-grid">
        <div class="stats-card" style="border-left-color: #667eea;">
          <div class="stats-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stats-content">
            <div class="stats-value">{{ stats.totalUsers || 0 }}</div>
            <div class="stats-label">Total Usuarios</div>
            <div class="stats-change positive" v-if="stats.usersChange">
              <i class="fas fa-arrow-up"></i>
              {{ stats.usersChange }}% este mes
            </div>
          </div>
        </div>

        <div class="stats-card" style="border-left-color: #4caf50;">
          <div class="stats-icon" style="color: #4caf50;">
            <i class="fas fa-handshake"></i>
          </div>
          <div class="stats-content">
            <div class="stats-value">{{ stats.totalAffiliations || 0 }}</div>
            <div class="stats-label">Afiliaciones</div>
            <div class="stats-change positive" v-if="stats.affiliationsChange">
              <i class="fas fa-arrow-up"></i>
              {{ stats.affiliationsChange }}% este mes
            </div>
          </div>
        </div>

        <div class="stats-card" style="border-left-color: #ff9800;">
          <div class="stats-icon" style="color: #ff9800;">
            <i class="fas fa-key"></i>
          </div>
          <div class="stats-content">
            <div class="stats-value">{{ stats.totalActivations || 0 }}</div>
            <div class="stats-label">Activaciones</div>
            <div class="stats-change positive" v-if="stats.activationsChange">
              <i class="fas fa-arrow-up"></i>
              {{ stats.activationsChange }}% este mes
            </div>
          </div>
        </div>

        <div class="stats-card" style="border-left-color: #f44336;">
          <div class="stats-icon" style="color: #f44336;">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stats-content">
            <div class="stats-value">{{ stats.pendingActions || 0 }}</div>
            <div class="stats-label">Pendientes</div>
            <div class="stats-change" v-if="stats.pendingActions > 0">
              Requieren atención
            </div>
          </div>
        </div>

        <div class="stats-card" style="border-left-color: #2196f3;">
          <div class="stats-icon" style="color: #2196f3;">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="stats-content">
            <div class="stats-value">${{ formatMoney(stats.totalRevenue || 0) }}</div>
            <div class="stats-label">Ingresos Totales</div>
            <div class="stats-change positive" v-if="stats.revenueChange">
              <i class="fas fa-arrow-up"></i>
              {{ stats.revenueChange }}% este mes
            </div>
          </div>
        </div>

        <div class="stats-card" style="border-left-color: #9c27b0;">
          <div class="stats-icon" style="color: #9c27b0;">
            <i class="fas fa-box"></i>
          </div>
          <div class="stats-content">
            <div class="stats-value">{{ stats.totalProducts || 0 }}</div>
            <div class="stats-label">Productos</div>
            <div class="stats-change">
              En inventario
            </div>
          </div>
        </div>
      </div>

      <!-- Accesos Rápidos -->
      <div class="quick-access">
        <h2 class="section-title">
          <i class="fas fa-bolt"></i>
          Accesos Rápidos
        </h2>
        <div class="quick-access-grid">
          <a href="/users/all" class="quick-access-item">
            <i class="fas fa-users"></i>
            <span>Usuarios</span>
          </a>
          <a href="/affiliations/all" class="quick-access-item">
            <i class="fas fa-handshake"></i>
            <span>Afiliaciones</span>
          </a>
          <a href="/activations/all" class="quick-access-item">
            <i class="fas fa-key"></i>
            <span>Activaciones</span>
          </a>
          <a href="/products" class="quick-access-item">
            <i class="fas fa-box"></i>
            <span>Productos</span>
          </a>
          <a href="/transactions" class="quick-access-item">
            <i class="fas fa-exchange-alt"></i>
            <span>Transacciones</span>
          </a>
          <a href="/kadex" class="quick-access-item">
            <i class="fas fa-warehouse"></i>
            <span>Inventario</span>
          </a>
        </div>
      </div>

      <!-- Actividad Reciente -->
      <div class="recent-activity">
        <h2 class="section-title">
          <i class="fas fa-history"></i>
          Actividad Reciente
        </h2>
        <div class="activity-list">
          <div v-for="(activity, index) in recentActivity" :key="index" class="activity-item">
            <div class="activity-icon" :class="`activity-${activity.type}`">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
          <div v-if="recentActivity.length === 0" class="no-activity">
            <i class="fas fa-inbox"></i>
            <p>No hay actividad reciente</p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '@/views/Layout'
import api from '@/api'

export default {
  components: { Layout },
  data() {
    return {
      loading: true,
      stats: {
        totalUsers: 0,
        totalAffiliations: 0,
        totalActivations: 0,
        pendingActions: 0,
        totalRevenue: 0,
        totalProducts: 0
      },
      recentActivity: []
    }
  },
  created() {
    const account = JSON.parse(localStorage.getItem('session'))
    this.$store.commit('SET_ACCOUNT', account)
    this.loadDashboard()
  },
  methods: {
    async loadDashboard() {
      this.loading = true
      try {
        // Obtener estadísticas de usuarios
        const usersData = await api.users.GET({ filter: 'all', page: 1, limit: 1 })
        const totalUsers = usersData.data.total || 0
        
        // Obtener estadísticas de afiliaciones
        const affiliationsData = await api.affiliations.GET({ filter: 'all', page: 1, limit: 1 })
        const totalAffiliations = affiliationsData.data.total || 0
        const pendingAffiliations = await api.affiliations.GET({ filter: 'pending', page: 1, limit: 1 })
        const pendingAff = pendingAffiliations.data.total || 0
        
        // Obtener estadísticas de activaciones
        const activationsData = await api.activations.GET({ filter: 'all', page: 1, limit: 1 })
        const totalActivations = activationsData.data.total || 0
        const pendingActivations = await api.activations.GET({ filter: 'pending', page: 1, limit: 1 })
        const pendingAct = pendingActivations.data.total || 0
        
        // Obtener estadísticas de retiros pendientes
        const pendingCollects = await api.Collects.GET({ filter: 'pending' })
        const pendingCol = pendingCollects.data.collects?.length || 0
        
        // Obtener productos
        const productsData = await api.products.GET()
        const totalProducts = productsData.data.products?.length || 0
        
        // Calcular total de pendientes
        const pendingActions = pendingAff + pendingAct + pendingCol
        
        // Calcular ingresos (simplificado - puedes mejorarlo con transacciones)
        const totalRevenue = 0 // Esto se puede calcular desde transacciones
        
        this.stats = {
          totalUsers,
          totalAffiliations,
          totalActivations,
          pendingActions,
          totalRevenue,
          totalProducts,
          usersChange: 0, // Se puede calcular comparando con mes anterior
          affiliationsChange: 0,
          activationsChange: 0,
          revenueChange: 0
        }
        
        // Actividad reciente (simplificado)
        this.recentActivity = [
          { type: 'affiliation', icon: 'fas fa-handshake', title: `${pendingAff} afiliaciones pendientes`, time: 'Revisar ahora' },
          { type: 'activation', icon: 'fas fa-key', title: `${pendingAct} activaciones pendientes`, time: 'Revisar ahora' },
          { type: 'payment', icon: 'fas fa-money-bill-wave', title: `${pendingCol} retiros pendientes`, time: 'Revisar ahora' }
        ]
        
        this.loading = false
        this.$toast.success('Dashboard cargado', 'Estadísticas actualizadas correctamente')
      } catch (error) {
        console.error('Error loading dashboard:', error)
        this.$toast.error('Error', 'No se pudieron cargar las estadísticas')
        this.loading = false
      }
    },
    formatMoney(value) {
      return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value)
    }
  }
}
</script>

<style lang="stylus" scoped>
.stats-grid
  display grid
  grid-template-columns repeat(auto-fit, minmax(280px, 1fr))
  gap 20px
  margin-bottom 30px

.stats-card
  background white
  border-radius 12px
  padding 24px
  box-shadow 0 2px 10px rgba(0, 0, 0, 0.05)
  transition all 0.3s ease
  border-left 4px solid #667eea
  display flex
  align-items center
  gap 20px

  &:hover
    transform translateY(-4px)
    box-shadow 0 8px 25px rgba(0, 0, 0, 0.1)

.stats-icon
  font-size 40px
  color #667eea
  flex-shrink 0

.stats-content
  flex 1

.stats-value
  font-size 32px
  font-weight 700
  color #333
  margin-bottom 4px

.stats-label
  color #666
  font-size 14px
  text-transform uppercase
  letter-spacing 0.5px
  margin-bottom 8px

.stats-change
  font-size 12px
  color #999

  &.positive
    color #4caf50
    font-weight 600

    i
      margin-right 4px

.section-title
  font-size 20px
  font-weight 700
  color #333
  margin-bottom 20px
  display flex
  align-items center
  gap 10px

  i
    color #667eea

.quick-access
  background white
  border-radius 12px
  padding 24px
  box-shadow 0 2px 10px rgba(0, 0, 0, 0.05)
  margin-bottom 30px

.quick-access-grid
  display grid
  grid-template-columns repeat(auto-fit, minmax(150px, 1fr))
  gap 16px

.quick-access-item
  display flex
  flex-direction column
  align-items center
  gap 12px
  padding 20px
  background #f8f9fa
  border-radius 10px
  text-decoration none
  color #333
  transition all 0.3s ease
  border 2px solid transparent

  i
    font-size 32px
    color #667eea

  span
    font-weight 600
    font-size 14px

  &:hover
    background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
    color white
    transform translateY(-4px)
    box-shadow 0 8px 20px rgba(102, 126, 234, 0.3)
    border-color #667eea

    i
      color white

.recent-activity
  background white
  border-radius 12px
  padding 24px
  box-shadow 0 2px 10px rgba(0, 0, 0, 0.05)

.activity-list
  display flex
  flex-direction column
  gap 12px

.activity-item
  display flex
  align-items center
  gap 16px
  padding 16px
  background #f8f9fa
  border-radius 8px
  transition all 0.2s ease

  &:hover
    background #f0f0f0
    transform translateX(4px)

.activity-icon
  width 40px
  height 40px
  border-radius 50%
  display flex
  align-items center
  justify-content center
  font-size 18px
  flex-shrink 0

.activity-affiliation
  background linear-gradient(135deg, #4caf50 0%, #45a049 100%)
  color white

.activity-activation
  background linear-gradient(135deg, #ff9800 0%, #f57c00 100%)
  color white

.activity-payment
  background linear-gradient(135deg, #2196f3 0%, #1976d2 100%)
  color white

.activity-content
  flex 1

.activity-title
  font-weight 600
  color #333
  margin-bottom 4px

.activity-time
  font-size 12px
  color #999

.no-activity
  text-align center
  padding 40px
  color #999

  i
    font-size 48px
    margin-bottom 16px
    opacity 0.5

@media (max-width: 768px)
  .stats-grid
    grid-template-columns 1fr

  .quick-access-grid
    grid-template-columns repeat(2, 1fr)
</style>

