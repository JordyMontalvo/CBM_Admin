<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <strong>Transacciones</strong>
        </div>
      </div>

      <div class="container" style="padding: 20px;">
        
        <!-- Filtros -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
          
          <input 
            class="input" 
            type="text" 
            placeholder="Buscar por usuario, DNI, email..." 
            v-model="search"
            @input="onSearchChange"
            style="max-width: 300px;"
          />

          <select class="input" v-model="filters.type" @change="GET()" style="max-width: 150px;">
            <option value="all">Todos los tipos</option>
            <option value="in">Entrada</option>
            <option value="out">Salida</option>
          </select>

          <select class="input" v-model="filters.virtual" @change="GET()" style="max-width: 150px;">
            <option value="all">Real y Virtual</option>
            <option value="false">Solo Real</option>
            <option value="true">Solo Virtual</option>
          </select>

          <select class="input" v-model="filters.name" @change="GET()" style="max-width: 200px;">
            <option value="">Todas las categorías</option>
            <option value="pay">Pago</option>
            <option value="wallet transfer">Transferencia Billetera</option>
            <option value="collect">Retiro</option>
            <option value="affiliation">Afiliación</option>
            <option value="activation">Activación</option>
            <option value="recharge">Recarga</option>
          </select>

          <button class="button" @click="resetFilters()">Limpiar Filtros</button>
        </div>

        <!-- Resumen -->
        <div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
          <div style="padding: 15px; background-color: #e8f5e9; border-radius: 5px; flex: 1; min-width: 150px;">
            <strong>Total Entradas</strong>
            <p style="font-size: 24px; margin: 5px 0;">${{ totalIn.toFixed(2) }}</p>
          </div>
          <div style="padding: 15px; background-color: #ffebee; border-radius: 5px; flex: 1; min-width: 150px;">
            <strong>Total Salidas</strong>
            <p style="font-size: 24px; margin: 5px 0;">${{ totalOut.toFixed(2) }}</p>
          </div>
          <div style="padding: 15px; background-color: #e3f2fd; border-radius: 5px; flex: 1; min-width: 150px;">
            <strong>Balance</strong>
            <p style="font-size: 24px; margin: 5px 0;">${{ balance.toFixed(2) }}</p>
          </div>
          <div style="padding: 15px; background-color: #f3e5f5; border-radius: 5px; flex: 1; min-width: 150px;">
            <strong>Total Transacciones</strong>
            <p style="font-size: 24px; margin: 5px 0;">{{ total }}</p>
          </div>
        </div>

        <!-- Tabla de transacciones -->
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>DNI</th>
                <th>Tipo</th>
                <th>Categoría</th>
                <th>Valor</th>
                <th>Virtual</th>
                <th>Descripción</th>
                <th>Destino</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(transaction, i) in transactions" :key="transaction.id">
                <th>{{ (page - 1) * limit + i + 1 }}</th>
                <td>{{ transaction.date | date }}</td>
                <td>{{ transaction.userName }}</td>
                <td>{{ transaction.userDni }}</td>
                <td>
                  <span 
                    class="tag" 
                    :class="transaction.type === 'in' ? 'is-success' : 'is-danger'"
                  >
                    {{ transaction.type === 'in' ? 'Entrada' : 'Salida' }}
                  </span>
                </td>
                <td>{{ transaction.name || 'N/A' }}</td>
                <td>
                  <strong :style="{ color: transaction.type === 'in' ? 'green' : 'red' }">
                    {{ transaction.type === 'in' ? '+' : '-' }}${{ transaction.value }}
                  </strong>
                </td>
                <td>
                  <span class="tag" :class="transaction.virtual ? 'is-warning' : 'is-info'">
                    {{ transaction.virtual ? 'Virtual' : 'Real' }}
                  </span>
                </td>
                <td>{{ transaction.desc || '-' }}</td>
                <td>{{ transaction._userName || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
          <div>
            <p>Mostrando {{ (page - 1) * limit + 1 }} - {{ Math.min(page * limit, total) }} de {{ total }} transacciones</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button 
              class="button" 
              @click="prevPage()" 
              :disabled="page === 1"
            >
              Anterior
            </button>
            <span style="padding: 10px;">Página {{ page }} de {{ totalPages }}</span>
            <button 
              class="button" 
              @click="nextPage()" 
              :disabled="page === totalPages"
            >
              Siguiente
            </button>
          </div>
        </div>

      </div>

    </section>

  </Layout>
</template>

<script>
import Layout from '@/views/Layout'
import api    from '@/api'

export default {
  components: { Layout },
  data() {
    return {
      loading: false,
      transactions: [],
      total: 0,
      totalIn: 0,
      totalOut: 0,
      balance: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
      search: '',
      searchTimeout: null,
      filters: {
        type: 'all',
        virtual: 'all',
        name: ''
      }
    }
  },
  filters: {
    date(val) {
      if (!val) return '-'
      return new Date(val).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
  },
  created() {
    const account = JSON.parse(localStorage.getItem('session'))
    this.$store.commit('SET_ACCOUNT', account)
    this.GET()
  },

  methods: {
    async GET() {
      this.loading = true

      try {
        const { data } = await api.transactions.GET({
          page: this.page,
          limit: this.limit,
          search: this.search,
          type: this.filters.type,
          virtual: this.filters.virtual,
          name: this.filters.name
        })

        this.transactions = data.transactions
        this.total = data.total
        this.totalPages = data.totalPages
        this.totalIn = data.totalIn
        this.totalOut = data.totalOut
        this.balance = data.balance
      } catch (error) {
        console.error('Error al obtener transacciones:', error)
      }

      this.loading = false
    },

    onSearchChange() {
      // Debounce para evitar muchas peticiones
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.page = 1 // Resetear a página 1 cuando se busca
        this.GET()
      }, 500)
    },

    resetFilters() {
      this.search = ''
      this.filters.type = 'all'
      this.filters.virtual = 'all'
      this.filters.name = ''
      this.page = 1
      this.GET()
    },

    prevPage() {
      if (this.page > 1) {
        this.page--
        this.GET()
      }
    },

    nextPage() {
      if (this.page < this.totalPages) {
        this.page++
        this.GET()
      }
    }
  }
}
</script>

<style scoped>
.table-container {
  overflow-x: auto;
}

.tag {
  font-size: 12px;
}
</style>

