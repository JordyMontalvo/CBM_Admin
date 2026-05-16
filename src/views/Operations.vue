<template>
  <Layout>
    <i class="load" v-if="loading"></i>

    <section v-if="!loading" class="ops-section">

      <!-- Header fijo -->
      <div class="ops-header">
        <div class="ops-header-inner">
          <div class="ops-title-row">
            <i class="fas fa-shopping-cart ops-icon"></i>
            <strong class="ops-title">{{ title }}</strong>
          </div>

          <!-- Buscador de socio -->
          <div class="ops-dni-bar">
            <div class="ops-dni-input-wrap">
              <i class="fas fa-id-card ops-dni-icon"></i>
              <input
                class="ops-dni-input"
                v-model="dniInput"
                placeholder="DNI del socio (ej: 12345678)"
                type="text"
                @keyup.enter="loadUser"
                :disabled="iframeLoading"
              />
            </div>
            <button
              class="ops-btn-load"
              @click="loadUser"
              :disabled="iframeLoading || !dniInput"
            >
              <i class="fas fa-sign-in-alt"></i>
              {{ iframeLoading ? 'Cargando...' : 'Loguear Socio' }}
            </button>
            <button
              v-if="activeDni"
              class="ops-btn-clear"
              @click="clearUser"
            >
              <i class="fas fa-times"></i>
              Cambiar Socio
            </button>
          </div>

          <!-- Info del socio activo -->
          <div class="ops-user-badge" v-if="activeDni">
            <i class="fas fa-user-check"></i>
            <span>Sesión activa: <strong>DNI {{ activeDni }}</strong></span>
            <span class="ops-badge-path">&nbsp;→&nbsp;{{ path }}</span>
          </div>
        </div>
      </div>

      <!-- Iframe embebido -->
      <div class="ops-iframe-wrap" v-if="iframeSrc">
        <iframe
          :key="iframeKey"
          :src="iframeSrc"
          class="ops-iframe"
          @load="onIframeLoad"
          allow="clipboard-read; clipboard-write"
          title="Sesión del socio"
        ></iframe>
      </div>

      <!-- Estado vacío -->
      <div class="ops-empty" v-if="!iframeSrc">
        <i class="fas fa-user-search ops-empty-icon"></i>
        <h3>Ingresa el DNI del socio</h3>
        <p>El sistema iniciará sesión automáticamente y mostrará su oficina aquí.</p>
      </div>

    </section>
  </Layout>
</template>

<script>
import Layout from '@/views/Layout'

const APP = process.env.VUE_APP_APP

export default {
  components: { Layout },
  data() {
    return {
      APP,
      loading: false,
      dniInput: '',
      activeDni: null,
      iframeSrc: null,
      iframeKey: 0,
      iframeLoading: false,
      title: 'Compras',
    }
  },
  computed: {
    account() { return this.$store.state.account },
    path() {
      if (this.$route.params.filter === 'plan')     return 'affiliation'
      if (this.$route.params.filter === 'products') return 'activation'
      return 'affiliation'
    }
  },
  created() {
    const account = JSON.parse(localStorage.getItem('session'))
    this.$store.commit('SET_ACCOUNT', account)

    // Restaurar sesión del socio si quedó guardada
    const savedDni = sessionStorage.getItem('ops_dni')
    if (savedDni) {
      this.dniInput = savedDni
      this.loadUser()
    }
  },
  methods: {
    loadUser() {
      const dni = (this.dniInput || '').trim()
      if (!dni) return

      this.activeDni = dni
      this.iframeLoading = true
      sessionStorage.setItem('ops_dni', dni)

      // Construir URL con DNI y path para auto-login
      const params = new URLSearchParams({
        path: this.path,
        dni: dni,
      })
      this.iframeSrc = `${APP}/login/central?${params.toString()}`
      this.iframeKey++
    },
    onIframeLoad() {
      this.iframeLoading = false
    },
    clearUser() {
      this.activeDni = null
      this.dniInput = ''
      this.iframeSrc = null
      sessionStorage.removeItem('ops_dni')
    },
  },
}
</script>

<style scoped>
.ops-section {
  min-height: calc(100vh - 80px);
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.ops-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 18px 20px 14px;
  box-shadow: 0 4px 16px rgba(102,126,234,0.18);
}

.ops-header-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ops-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ops-icon {
  color: #fff;
  font-size: 20px;
}

.ops-title {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.ops-dni-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.ops-dni-input-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 340px;
}

.ops-dni-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #764ba2;
  font-size: 15px;
  pointer-events: none;
}

.ops-dni-input {
  width: 100%;
  padding: 10px 14px 10px 36px;
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 8px;
  background: rgba(255,255,255,0.95);
  font-size: 15px;
  color: #333;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.ops-dni-input:focus {
  border-color: #fff;
  background: #fff;
}

.ops-btn-load {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  background: #fff;
  color: #764ba2;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.ops-btn-load:hover:not(:disabled) {
  background: #764ba2;
  color: #fff;
  transform: translateY(-1px);
}

.ops-btn-load:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ops-btn-clear {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(255,255,255,0.15);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.ops-btn-clear:hover {
  background: rgba(255,255,255,0.25);
}

.ops-user-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 6px;
  padding: 7px 14px;
  color: #fff;
  font-size: 14px;
  width: fit-content;
}

.ops-badge-path {
  opacity: 0.8;
  font-size: 13px;
}

.ops-iframe-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 160px);
}

.ops-iframe {
  width: 100%;
  flex: 1;
  min-height: calc(100vh - 160px);
  border: none;
  background: #fff;
}

.ops-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #888;
  gap: 12px;
}

.ops-empty-icon {
  font-size: 56px;
  color: #c3b8e0;
  margin-bottom: 8px;
}

.ops-empty h3 {
  font-size: 22px;
  color: #555;
  margin: 0;
}

.ops-empty p {
  font-size: 15px;
  max-width: 380px;
  margin: 0;
}
</style>
