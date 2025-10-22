<template>
  <div class="app">
    <div v-if="!isAccountLoaded" class="has-text-centered" style="padding: 50px;">
      <i class="load"></i>
      <p>Cargando sesión...</p>
    </div>
    
    <div v-else>
    <nav class="navbar is-spaced">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item"><img src="@/assets/logo.svg"></a>
          <a class="navbar-burger burger" :class="{'is-active': open}" @click="open = !open">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div class="navbar-menu" :class="{'is-active': open}">
          <!-- <a class="navbar-item" href="/users">Usuarios</a> -->
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">Usuarios</a>
            <div class="navbar-dropdown">
              <a class="navbar-item" href="/users/all">Todos</a>
              <a class="navbar-item" href="/users/affiliated">Afiliados</a>
              <a class="navbar-item" href="/users/activated">Activados</a>
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">Afiliación</a>
            <div class="navbar-dropdown">
              <a class="navbar-item" href="/affiliations/all">Todas</a>
              <a class="navbar-item" href="/affiliations/pending">Pendientes</a>
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">Activación</a>
            <div class="navbar-dropdown">
              <a class="navbar-item" href="/activations/all">Todas</a>
              <a class="navbar-item" href="/activations/pending">Pendientes</a>
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable" v-if="account && account.type == 'admin'">
            <a class="navbar-link">Retiro</a>
            <div class="navbar-dropdown">
              <a class="navbar-item" href="/collects/all">Todos</a>
              <a class="navbar-item" href="/collects/pending">Pendientes</a>
            </div>
          </div>

          <a class="navbar-item" href="/products">Productos</a>
          <a class="navbar-item" href="/kadex">Inventario</a>

          <!-- <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">Promociones</a>
            <div class="navbar-dropdown">
              <a class="navbar-item" href="/promotions/all">Todas</a>
              <a class="navbar-item" href="/promotions/pending">Pendientes</a>
            </div>
          </div> -->
          <a class="navbar-item" href="/banner" v-if="account && account.type == 'admin'">Banner</a>
          <a class="navbar-item" href="/tree" v-if="account && account.type == 'admin'">Red</a>
          <a class="navbar-item" href="/backups" v-if="account && account.type == 'admin'">Backups</a>
          
          <!-- <a class="navbar-item" href="/pay">Pagar</a>
          <a class="navbar-item" href="/wallet">Billetera</a> -->
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">Pagos</a>
            <div class="navbar-dropdown">
              <a class="navbar-item" href="/pay">Pagar</a>
              <a class="navbar-item" href="/wallet">Billetera</a>
            </div>
          </div>

          <a class="navbar-item" href="/stock" v-if="account && account.type == 'office'">Stock</a>
          <!-- <a class="navbar-item" href="/offices" v-if="account.type == 'admin'">Oficinas</a>
          <a class="navbar-item" href="/office-collects/all" v-if="account.type == 'admin'">Retiros de Oficina</a> -->

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">Oficinas</a>
            <div class="navbar-dropdown">
              <a class="navbar-item" href="/offices" v-if="account && account.type == 'admin'">Productos</a>
              <a class="navbar-item" href="/office-collects/all" v-if="account && account.type == 'admin'">Retiros</a>
            </div>
          </div>

          <!-- <a class="navbar-item" href="/reports">Reportes</a> -->

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">Compras</a>
            <div class="navbar-dropdown">
              <a class="navbar-item" href="/operations/plan">Afiliación</a>
              <a class="navbar-item" href="/operations/products">Reconsumo</a>
            </div>
          </div>

          <a class="navbar-item" href="/closed" v-if="account && account.type == 'admin'">Cierres</a>
          <a class="navbar-item" href="/transactions" v-if="account && account.type == 'admin'">Transacciones</a>


          <div class="navbar-end">
            <a class="navbar-item" href="/logout">Cerrar sesión</a>
          </div>
        </div>
      </div>
    </nav>

    <div class="notification is-primary" v-if="account && account.type == 'office'">
      Oficina: <strong>{{ account.name }}</strong>
    </div>

    <slot/>

    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      open: false,
      accountLoadingTimeout: false,
    }
  },
  computed: {
    account() { return this.$store.state.account },
    isAccountLoaded() { 
      // Si account es null, asumir que está cargado después de 2 segundos
      return this.$store.state.account !== null || this.accountLoadingTimeout;
    },
  },
  mounted() {
    // Timeout para evitar carga infinita
    setTimeout(() => {
      this.accountLoadingTimeout = true;
    }, 2000);
  },
};
</script>
