<template>
  <div class="app">
    <div v-if="!isAccountLoaded" class="loading-screen">
      <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-text">Cargando sesión...</p>
      </div>
    </div>
    
    <div v-else>
    <nav class="navbar-modern">
      <div class="navbar-container">
        <div class="navbar-brand-modern">
          <a class="navbar-logo" href="/">
            <img src="@/assets/logo.svg" alt="CBM Admin">
            <span class="logo-text">CBM Admin</span>
          </a>
          <a class="navbar-burger-modern" :class="{'is-active': open}" @click="open = !open">
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>
        <div class="navbar-menu-modern" :class="{'is-active': open}">
          <!-- Primera fila -->
          <div class="navbar-menu-row">
            <a class="navbar-item-modern" href="/dashboard">
              <i class="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </a>
            <div class="navbar-item-modern has-dropdown-modern">
              <a class="navbar-link-modern" @click.prevent="openSidebar('usuarios')">
                <i class="fas fa-users"></i>
                <span>Usuarios</span>
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </a>
            </div>
            <div class="navbar-item-modern has-dropdown-modern">
              <a class="navbar-link-modern" @click.prevent="openSidebar('afiliacion')">
                <i class="fas fa-handshake"></i>
                <span>Afiliación</span>
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </a>
            </div>
            <div class="navbar-item-modern has-dropdown-modern">
              <a class="navbar-link-modern" @click.prevent="openSidebar('activacion')">
                <i class="fas fa-key"></i>
                <span>Activación</span>
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </a>
            </div>
            <div class="navbar-item-modern has-dropdown-modern" v-if="account && account.type == 'admin'">
              <a class="navbar-link-modern" @click.prevent="openSidebar('retiro')">
                <i class="fas fa-money-bill-wave"></i>
                <span>Retiro</span>
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </a>
            </div>
            <a class="navbar-item-modern" href="/products">
              <i class="fas fa-box"></i>
              <span>Productos</span>
            </a>
            <a class="navbar-item-modern" href="/kadex">
              <i class="fas fa-warehouse"></i>
              <span>Inventario</span>
            </a>
            <a class="navbar-item-modern" href="/banner" v-if="account && account.type == 'admin'">
              <i class="fas fa-image"></i>
              <span>Banner</span>
            </a>
          </div>

          <!-- Segunda fila -->
          <div class="navbar-menu-row">
            <a class="navbar-item-modern" href="/tree" v-if="account && account.type == 'admin'">
              <i class="fas fa-sitemap"></i>
              <span>Red</span>
            </a>
            <a class="navbar-item-modern" href="/backups" v-if="account && account.type == 'admin'">
              <i class="fas fa-database"></i>
              <span>Backups</span>
            </a>
            <div class="navbar-item-modern has-dropdown-modern" v-if="account && account.type == 'admin'">
              <a class="navbar-link-modern" @click.prevent="openSidebar('cuenta')">
                <i class="fas fa-user-cog"></i>
                <span>Cuenta</span>
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </a>
            </div>
            <div class="navbar-item-modern has-dropdown-modern">
              <a class="navbar-link-modern" @click.prevent="openSidebar('pagos')">
                <i class="fas fa-credit-card"></i>
                <span>Pagos</span>
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </a>
            </div>
            <a class="navbar-item-modern" href="/stock" v-if="account && account.type == 'office'">
              <i class="fas fa-boxes"></i>
              <span>Stock</span>
            </a>
            <div class="navbar-item-modern has-dropdown-modern" v-if="account && account.type == 'admin'">
              <a class="navbar-link-modern" @click.prevent="openSidebar('oficinas')">
                <i class="fas fa-building"></i>
                <span>Oficinas</span>
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </a>
            </div>
            <div class="navbar-item-modern has-dropdown-modern">
              <a class="navbar-link-modern" @click.prevent="openSidebar('compras')">
                <i class="fas fa-shopping-cart"></i>
                <span>Compras</span>
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </a>
            </div>
            <a class="navbar-item-modern" href="/closed" v-if="account && account.type == 'admin'">
              <i class="fas fa-lock"></i>
              <span>Cierres</span>
            </a>
            <a class="navbar-item-modern" href="/transactions" v-if="account && account.type == 'admin'">
              <i class="fas fa-exchange-alt"></i>
              <span>Transacciones</span>
            </a>
            <div class="navbar-end-modern">
              <a class="navbar-item-modern logout-btn" href="/logout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Cerrar sesión</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="office-banner" v-if="account && account.type == 'office'">
      <div class="office-banner-content">
        <i class="fas fa-building"></i>
        <span>Oficina: <strong>{{ account.name }}</strong></span>
      </div>
    </div>

    <div class="main-content" :class="{'sidebar-open': sidebarOpen}">
      <Breadcrumbs :items="breadcrumbItems" />
      <slot/>
    </div>

    <!-- Sidebar desde la derecha -->
    <div class="sidebar-overlay" v-if="sidebarOpen" @click="closeSidebar"></div>
    <div class="sidebar-right" :class="{'is-open': sidebarOpen}">
      <div class="sidebar-header">
        <h3 class="sidebar-title">{{ currentSidebarTitle }}</h3>
        <button class="sidebar-close" @click="closeSidebar">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="sidebar-content">
        <a 
          v-for="item in currentSidebarItems" 
          :key="item.href"
          :href="item.href" 
          class="sidebar-item"
          @click="closeSidebar"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </a>
      </div>
    </div>

    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue'

export default {
  components: {
    Breadcrumbs
  },
  data() {
    return {
      open: false,
      accountLoadingTimeout: false,
      sidebarOpen: false,
      currentSidebarTitle: '',
      currentSidebarItems: [],
      sidebarMenus: {
        usuarios: {
          title: 'Usuarios',
          items: [
            { href: '/users/all', icon: 'fas fa-list', label: 'Todos los Usuarios' },
            { href: '/users/affiliated', icon: 'fas fa-user-check', label: 'Usuarios Afiliados' },
            { href: '/users/activated', icon: 'fas fa-user-shield', label: 'Usuarios Activados' }
          ]
        },
        afiliacion: {
          title: 'Afiliación',
          items: [
            { href: '/affiliations/all', icon: 'fas fa-list', label: 'Todas las Afiliaciones' },
            { href: '/affiliations/pending', icon: 'fas fa-clock', label: 'Afiliaciones Pendientes' }
          ]
        },
        activacion: {
          title: 'Activación',
          items: [
            { href: '/activations/all', icon: 'fas fa-list', label: 'Todas las Activaciones' },
            { href: '/activations/pending', icon: 'fas fa-clock', label: 'Activaciones Pendientes' }
          ]
        },
        retiro: {
          title: 'Retiro',
          items: [
            { href: '/collects/all', icon: 'fas fa-list', label: 'Todos los Retiros' },
            { href: '/collects/pending', icon: 'fas fa-clock', label: 'Retiros Pendientes' }
          ]
        },
        pagos: {
          title: 'Pagos',
          items: [
            { href: '/pay', icon: 'fas fa-money-check', label: 'Pagar' },
            { href: '/wallet', icon: 'fas fa-wallet', label: 'Billetera' }
          ]
        },
        oficinas: {
          title: 'Oficinas',
          items: [
            { href: '/offices', icon: 'fas fa-box', label: 'Productos' },
            { href: '/office-collects/all', icon: 'fas fa-money-bill-wave', label: 'Retiros' }
          ]
        },
        compras: {
          title: 'Compras',
          items: [
            { href: '/operations/plan', icon: 'fas fa-handshake', label: 'Afiliación' },
            { href: '/operations/products', icon: 'fas fa-redo', label: 'Reconsumo' }
          ]
        },
        cuenta: {
          title: 'Cuenta',
          items: [
            { href: '/change-password', icon: 'fas fa-key', label: 'Contraseña' },
          ]
        }
      }
    }
  },
  computed: {
    account() { return this.$store.state.account },
    isAccountLoaded() { 
      // Si account es null, asumir que está cargado después de 2 segundos
      return this.$store.state.account !== null || this.accountLoadingTimeout;
    },
    breadcrumbItems() {
      const route = this.$route
      
      // Mapeo de rutas a breadcrumbs personalizados
      const routeMap = {
        '/dashboard': [
          { label: 'Dashboard', icon: 'fas fa-tachometer-alt', to: '/dashboard' }
        ],
        '/users/all': [
          { label: 'Usuarios', icon: 'fas fa-users', to: '/users/all' }
        ],
        '/users/affiliated': [
          { label: 'Usuarios', icon: 'fas fa-users', to: '/users/all' },
          { label: 'Afiliados', icon: 'fas fa-user-check', to: '/users/affiliated' }
        ],
        '/users/activated': [
          { label: 'Usuarios', icon: 'fas fa-users', to: '/users/all' },
          { label: 'Activados', icon: 'fas fa-user-shield', to: '/users/activated' }
        ],
        '/affiliations/all': [
          { label: 'Afiliaciones', icon: 'fas fa-handshake', to: '/affiliations/all' }
        ],
        '/affiliations/pending': [
          { label: 'Afiliaciones', icon: 'fas fa-handshake', to: '/affiliations/all' },
          { label: 'Pendientes', icon: 'fas fa-clock', to: '/affiliations/pending' }
        ],
        '/activations/all': [
          { label: 'Activaciones', icon: 'fas fa-key', to: '/activations/all' }
        ],
        '/activations/pending': [
          { label: 'Activaciones', icon: 'fas fa-key', to: '/activations/all' },
          { label: 'Pendientes', icon: 'fas fa-clock', to: '/activations/pending' }
        ],
        '/collects/all': [
          { label: 'Retiros', icon: 'fas fa-money-bill-wave', to: '/collects/all' }
        ],
        '/collects/pending': [
          { label: 'Retiros', icon: 'fas fa-money-bill-wave', to: '/collects/all' },
          { label: 'Pendientes', icon: 'fas fa-clock', to: '/collects/pending' }
        ],
        '/products': [
          { label: 'Productos', icon: 'fas fa-box', to: '/products' }
        ],
        '/kadex': [
          { label: 'Inventario', icon: 'fas fa-warehouse', to: '/kadex' }
        ],
        '/banner': [
          { label: 'Banner', icon: 'fas fa-image', to: '/banner' }
        ],
        '/tree': [
          { label: 'Red', icon: 'fas fa-sitemap', to: '/tree' }
        ],
        '/backups': [
          { label: 'Backups', icon: 'fas fa-database', to: '/backups' }
        ],
        '/pay': [
          { label: 'Pagos', icon: 'fas fa-credit-card', to: '/pay' },
          { label: 'Pagar', icon: 'fas fa-money-check', to: '/pay' }
        ],
        '/wallet': [
          { label: 'Pagos', icon: 'fas fa-credit-card', to: '/pay' },
          { label: 'Billetera', icon: 'fas fa-wallet', to: '/wallet' }
        ],
        '/stock': [
          { label: 'Stock', icon: 'fas fa-boxes', to: '/stock' }
        ],
        '/offices': [
          { label: 'Oficinas', icon: 'fas fa-building', to: '/offices' },
          { label: 'Productos', icon: 'fas fa-box', to: '/offices' }
        ],
        '/office-collects/all': [
          { label: 'Oficinas', icon: 'fas fa-building', to: '/offices' },
          { label: 'Retiros', icon: 'fas fa-money-bill-wave', to: '/office-collects/all' }
        ],
        '/operations/plan': [
          { label: 'Compras', icon: 'fas fa-shopping-cart', to: '/operations/plan' },
          { label: 'Afiliación', icon: 'fas fa-handshake', to: '/operations/plan' }
        ],
        '/operations/products': [
          { label: 'Compras', icon: 'fas fa-shopping-cart', to: '/operations/products' },
          { label: 'Reconsumo', icon: 'fas fa-redo', to: '/operations/products' }
        ],
        '/closed': [
          { label: 'Cierres', icon: 'fas fa-lock', to: '/closed' }
        ],
        '/transactions': [
          { label: 'Transacciones', icon: 'fas fa-exchange-alt', to: '/transactions' }
        ]
      }

      // Obtener breadcrumbs del mapeo o generar automáticamente
      const path = this.$route.path
      if (routeMap[path]) {
        return routeMap[path]
      }

      // Generar breadcrumbs automáticamente desde la ruta
      const pathParts = path.split('/').filter(p => p)
      const breadcrumbs = [
        { label: 'Dashboard', icon: 'fas fa-tachometer-alt', to: '/dashboard' }
      ]

      // Mapeo de nombres amigables
      const nameMap = {
        'users': { label: 'Usuarios', icon: 'fas fa-users' },
        'affiliations': { label: 'Afiliaciones', icon: 'fas fa-handshake' },
        'activations': { label: 'Activaciones', icon: 'fas fa-key' },
        'collects': { label: 'Retiros', icon: 'fas fa-money-bill-wave' },
        'products': { label: 'Productos', icon: 'fas fa-box' },
        'kadex': { label: 'Inventario', icon: 'fas fa-warehouse' },
        'banner': { label: 'Banner', icon: 'fas fa-image' },
        'tree': { label: 'Red', icon: 'fas fa-sitemap' },
        'backups': { label: 'Backups', icon: 'fas fa-database' },
        'pay': { label: 'Pagar', icon: 'fas fa-money-check' },
        'wallet': { label: 'Billetera', icon: 'fas fa-wallet' },
        'stock': { label: 'Stock', icon: 'fas fa-boxes' },
        'offices': { label: 'Oficinas', icon: 'fas fa-building' },
        'office-collects': { label: 'Retiros de Oficina', icon: 'fas fa-money-bill-wave' },
        'operations': { label: 'Compras', icon: 'fas fa-shopping-cart' },
        'closed': { label: 'Cierres', icon: 'fas fa-lock' },
        'transactions': { label: 'Transacciones', icon: 'fas fa-exchange-alt' },
        'all': { label: 'Todos', icon: 'fas fa-list' },
        'pending': { label: 'Pendientes', icon: 'fas fa-clock' },
        'affiliated': { label: 'Afiliados', icon: 'fas fa-user-check' },
        'activated': { label: 'Activados', icon: 'fas fa-user-shield' },
        'plan': { label: 'Afiliación', icon: 'fas fa-handshake' },
        'products': { label: 'Reconsumo', icon: 'fas fa-redo' }
      }

      let currentPath = ''
      pathParts.forEach((part, index) => {
        currentPath += '/' + part
        const isLast = index === pathParts.length - 1
        const nameInfo = nameMap[part] || { label: part.charAt(0).toUpperCase() + part.slice(1), icon: 'fas fa-circle' }
        
        breadcrumbs.push({
          label: nameInfo.label,
          icon: nameInfo.icon,
          to: isLast ? null : currentPath
        })
      })

      return breadcrumbs
    }
  },
  mounted() {
    // Timeout para evitar carga infinita
    setTimeout(() => {
      this.accountLoadingTimeout = true;
    }, 2000);
  },
  methods: {
    openSidebar(menuKey) {
      const menu = this.sidebarMenus[menuKey];
      if (menu) {
        // Filtrar items según permisos
        let items = menu.items;
        if (menuKey === 'retiro' || menuKey === 'oficinas') {
          items = items.filter(item => {
            if (item.href === '/offices' || item.href === '/office-collects/all') {
              return this.account && this.account.type === 'admin';
            }
            return this.account && this.account.type === 'admin';
          });
        }
        if (menuKey === 'cuenta') {
          items = items.filter(() => this.account && this.account.type === 'admin');
        }
        
        this.currentSidebarTitle = menu.title;
        this.currentSidebarItems = items;
        this.sidebarOpen = true;
        document.body.style.overflow = 'hidden';
      }
    },
    closeSidebar() {
      this.sidebarOpen = false;
      document.body.style.overflow = '';
    }
  },
  beforeDestroy() {
    document.body.style.overflow = '';
  },
};
</script>

<style lang="stylus" scoped>
.app
  min-height 100vh
  background linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)

.loading-screen
  display flex
  align-items center
  justify-content center
  min-height 100vh
  background linear-gradient(135deg, #667eea 0%, #764ba2 100%)

.loading-content
  text-align center
  color white

.spinner
  width 50px
  height 50px
  border 4px solid rgba(255, 255, 255, 0.3)
  border-top-color white
  border-radius 50%
  animation spin 1s linear infinite
  margin 0 auto 20px

@keyframes spin
  to
    transform rotate(360deg)

.loading-text
  font-size 18px
  font-weight 500
  color white

.navbar-modern
  background linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important
  box-shadow 0 4px 20px rgba(0, 0, 0, 0.1)
  position sticky
  top 0
  z-index 1000
  padding 0
  width 100%

.navbar-container
  max-width 100%
  margin 0 auto
  padding 0 20px
  display flex
  flex-direction column
  width 100%

.navbar-brand-modern
  display flex
  align-items center
  justify-content flex-start
  padding 8px 0
  border-bottom 1px solid rgba(255, 255, 255, 0.2)
  margin-bottom 0
  position relative

.navbar-logo
  display flex
  align-items center
  gap 12px
  text-decoration none
  color #ffffff !important
  font-size 18px
  font-weight 700
  transition transform 0.3s ease

  &:hover
    transform scale(1.05)

  img
    height 35px
    width auto

.logo-text
  font-size 20px
  letter-spacing 0.5px
  color #ffffff !important
  font-weight 700

.navbar-burger-modern
  display none
  flex-direction column
  cursor pointer
  padding 8px
  gap 5px
  position absolute
  right 20px
  top 50%
  transform translateY(-50%)

  span
    width 25px
    height 3px
    background white
    border-radius 3px
    transition all 0.3s ease

  &.is-active
    span:nth-child(1)
      transform rotate(45deg) translate(8px, 8px)
    span:nth-child(2)
      opacity 0
    span:nth-child(3)
      transform rotate(-45deg) translate(7px, -7px)

.navbar-menu-modern
  display flex
  flex-direction column
  gap 3px
  padding 4px 0
  justify-content center
  align-items center

.navbar-menu-row
  display flex
  align-items center
  justify-content center
  gap 4px
  flex-wrap wrap

.navbar-item-modern
  display flex
  align-items center
  gap 6px
  padding 10px 14px
  color #ffffff !important
  text-decoration none
  border-radius 6px
  transition all 0.2s ease
  font-weight 600
  font-size 14px
  position relative
  white-space nowrap
  flex-shrink 0
  min-height 40px

  i
    font-size 15px
    flex-shrink 0
    color #ffffff !important

  span
    display inline-block
    white-space nowrap
    color #ffffff !important
    font-weight 600

  &:hover
    background rgba(255, 255, 255, 0.25)
    transform translateY(-1px)

  &.logout-btn
    background rgba(255, 255, 255, 0.2)
    margin-left auto
    padding 10px 18px

    &:hover
      background rgba(255, 255, 255, 0.3)

.has-dropdown-modern
  position relative

.navbar-link-modern
  display flex
  align-items center
  gap 6px
  cursor pointer
  padding 10px 14px
  border-radius 6px
  transition all 0.2s ease
  min-height 40px
  width 100%
  color #ffffff !important

  .dropdown-icon
    font-size 11px
    margin-left 2px
    transition transform 0.3s ease
    flex-shrink 0
    color #ffffff !important

  span
    display inline-block
    white-space nowrap
    color #ffffff !important
    font-weight 600

  i:not(.dropdown-icon)
    flex-shrink 0
    color #ffffff !important
    font-size 15px

  &:hover
    background rgba(255, 255, 255, 0.25)

  &:hover .dropdown-icon
    transform translateX(3px)

.navbar-end-modern
  margin-left auto
  display flex
  align-items center
  flex-shrink 0

  .logout-btn
    margin-left auto

.office-banner
  background linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
  color white
  padding 15px 20px
  box-shadow 0 2px 10px rgba(0, 0, 0, 0.1)

.office-banner-content
  max-width 1200px
  margin 0 auto
  display flex
  align-items center
  gap 10px
  font-size 16px

  i
    font-size 20px

.main-content
  padding 20px
  width 100%
  max-width 100%
  margin 0 auto
  box-sizing border-box
  transition margin-right 0.3s ease

  &.sidebar-open
    margin-right 0

// Sidebar desde la derecha
.sidebar-overlay
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background rgba(0, 0, 0, 0.5)
  z-index 2000
  animation fadeIn 0.3s ease

@keyframes fadeIn
  from
    opacity 0
  to
    opacity 1

.sidebar-right
  position fixed
  top 0
  right -400px
  width 380px
  height 100vh
  background white
  box-shadow -4px 0 20px rgba(0, 0, 0, 0.15)
  z-index 2001
  transition right 0.3s cubic-bezier(0.4, 0, 0.2, 1)
  display flex
  flex-direction column
  overflow hidden

  &.is-open
    right 0

.sidebar-header
  background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  color white
  padding 20px 24px
  display flex
  align-items center
  justify-content space-between
  box-shadow 0 2px 10px rgba(0, 0, 0, 0.1)

.sidebar-title
  margin 0
  font-size 20px
  font-weight 700
  color white

.sidebar-close
  background transparent
  border none
  color white
  font-size 24px
  cursor pointer
  padding 5px
  width 35px
  height 35px
  display flex
  align-items center
  justify-content center
  border-radius 50%
  transition all 0.2s ease

  &:hover
    background rgba(255, 255, 255, 0.2)
    transform rotate(90deg)

  i
    font-size 20px

.sidebar-content
  flex 1
  overflow-y auto
  padding 20px 0

  &::-webkit-scrollbar
    width 6px

  &::-webkit-scrollbar-track
    background #f5f5f5

  &::-webkit-scrollbar-thumb
    background #ccc
    border-radius 3px

    &:hover
      background #999

.sidebar-item
  display flex
  align-items center
  gap 16px
  padding 16px 24px
  color #333
  text-decoration none
  transition all 0.2s ease
  font-size 15px
  font-weight 500
  border-left 3px solid transparent

  i
    color #667eea
    font-size 18px
    width 24px
    text-align center

  &:hover
    background linear-gradient(90deg, rgba(102, 126, 234, 0.08) 0%, transparent 100%)
    border-left-color #667eea
    padding-left 28px
    color #667eea

  &:active
    background rgba(102, 126, 234, 0.1)

@media (max-width: 1200px)
  .navbar-menu-row
    gap 3px

  .navbar-item-modern
    padding 8px 12px
    font-size 12px

    i
      font-size 13px

  .navbar-link-modern
    padding 8px 12px

@media (max-width: 1024px)
  .navbar-burger-modern
    display flex

  .navbar-brand-modern
    padding 10px 0

  .navbar-menu-modern
    display none
    position absolute
    top 100%
    left 0
    right 0
    background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
    flex-direction column
    padding 15px 20px
    box-shadow 0 4px 20px rgba(0, 0, 0, 0.2)
    gap 8px
    max-height calc(100vh - 70px)
    overflow-y auto

    &.is-active
      display flex

    .navbar-menu-row
      flex-direction column
      width 100%
      gap 8px

    .navbar-item-modern
      width 100%
      justify-content flex-start
      padding 12px 16px
      font-size 14px

    .navbar-end-modern
      margin-left 0
      width 100%

  .sidebar-right
    width 100%
    right -100%

    &.is-open
      right 0
</style>
