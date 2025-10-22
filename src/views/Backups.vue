<template>
  <Layout>
    <div style="margin-bottom: 20px;">
      <button class="generate-backup-btn" @click="generateBackup" :disabled="generating">
        <i class="fa-solid fa-plus" v-if="!generating"></i>
        <i class="fa-solid fa-spinner fa-spin" v-if="generating"></i>
        {{ generating ? 'Generando...' : 'Generar Backup Manual' }}
      </button>
      <button class="clean-backups-btn" @click="cleanOldBackups" :disabled="cleaning">
        <i class="fa-solid fa-trash" v-if="!cleaning"></i>
        <i class="fa-solid fa-spinner fa-spin" v-if="cleaning"></i>
        {{ cleaning ? 'Limpiando...' : 'Limpiar Backups Antiguos' }}
      </button>
      <button class="refresh-btn" @click="loadBackups">
        <i class="fa-solid fa-refresh"></i>
        Actualizar
      </button>
    </div>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>Backups Automáticos</strong>
          <p>Backups generados automáticamente cada día a las 2:00 AM. Se eliminan automáticamente después de 7 días.</p>
        </div>
      </div>

      <div class="container" style="margin-top: 20px;">
        <div class="table-container">
          <table class="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Nombre del Archivo</th>
                <th>Tamaño</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="backups.length === 0">
                <td colspan="4" class="has-text-centered">
                  <p class="has-text-grey">No hay backups disponibles</p>
                </td>
              </tr>
              <tr v-for="backup in backups" :key="backup.filename">
                <td>
                  <strong>{{ backup.filename }}</strong>
                </td>
                <td>{{ backup.sizeFormatted }}</td>
                <td>{{ formatDate(backup.created) }}</td>
                <td>
                  <button 
                    class="button is-small is-primary" 
                    @click="downloadBackup(backup)"
                    :disabled="downloading"
                  >
                    <i class="fa-solid fa-download"></i>
                    Descargar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación si es necesaria -->
        <nav class="pagination is-centered" v-if="totalPages > 1">
          <a class="pagination-previous" @click="previousPage" :disabled="currentPage === 1">Anterior</a>
          <a class="pagination-next" @click="nextPage" :disabled="currentPage === totalPages">Siguiente</a>
          <ul class="pagination-list">
            <li v-for="page in visiblePages" :key="page">
              <a 
                class="pagination-link" 
                :class="{ 'is-current': page === currentPage }"
                @click="goToPage(page)"
              >
                {{ page }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from './Layout.vue';

export default {
  name: 'Backups',
  components: {
    Layout
  },
  data() {
    return {
      loading: true,
      backups: [],
      generating: false,
      cleaning: false,
      downloading: false,
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 1
    };
  },
  computed: {
    visiblePages() {
      const pages = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  async created() {
    // Cargar backups inmediatamente, no esperar sesión
    await this.loadBackups();
  },
  methods: {
    async loadBackups() {
      this.loading = true;
      try {
        // Verificar si hay sesión antes de hacer la petición
        const session = localStorage.getItem('session');
        if (!session) {
          console.log('No hay sesión, redirigiendo al login');
          this.$router.push('/login');
          return;
        }

        const response = await fetch(`${process.env.VUE_APP_SERVER}/api/admin/auto-backup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'list'
          })
        });

        const data = await response.json();
        
        if (data.error) {
          alert('Error cargando backups: ' + data.msg);
          return;
        }

        this.backups = data.backups || [];
        this.totalPages = Math.ceil(this.backups.length / this.itemsPerPage);
        
      } catch (error) {
        console.error('Error cargando backups:', error);
        alert('Error de conexión al cargar backups');
      } finally {
        this.loading = false;
      }
    },

    async generateBackup() {
      if (!confirm('¿Desea generar un backup manual ahora?')) {
        return;
      }

      this.generating = true;
      try {
        const response = await fetch(`${process.env.VUE_APP_SERVER}/api/admin/auto-backup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'generate'
          })
        });

        const data = await response.json();
        
        if (data.error) {
          alert('Error generando backup: ' + data.msg);
          return;
        }

        alert('✓ Backup generado exitosamente');
        await this.loadBackups();
        
      } catch (error) {
        console.error('Error generando backup:', error);
        alert('Error de conexión al generar backup');
      } finally {
        this.generating = false;
      }
    },

    async cleanOldBackups() {
      if (!confirm('¿Desea limpiar los backups antiguos (más de 7 días)?')) {
        return;
      }

      this.cleaning = true;
      try {
        const response = await fetch(`${process.env.VUE_APP_SERVER}/api/admin/auto-backup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'clean'
          })
        });

        const data = await response.json();
        
        if (data.error) {
          alert('Error limpiando backups: ' + data.msg);
          return;
        }

        alert('✓ Limpieza completada');
        await this.loadBackups();
        
      } catch (error) {
        console.error('Error limpiando backups:', error);
        alert('Error de conexión al limpiar backups');
      } finally {
        this.cleaning = false;
      }
    },

    async downloadBackup(backup) {
      this.downloading = true;
      try {
        const response = await fetch(`${process.env.VUE_APP_SERVER}/api/admin/auto-backup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'download',
            filename: backup.filename
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Error descargando backup');
        }

        // Verificar si es un archivo ZIP
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/zip')) {
          // Crear blob y descargar
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.style.display = 'none';
          
          a.download = backup.filename;
          document.body.appendChild(a);
          a.click();
          
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }, 1000);
          
          alert('✓ Backup descargado exitosamente');
        } else {
          const responseText = await response.text();
          throw new Error('El servidor no devolvió un archivo ZIP válido: ' + responseText.substring(0, 200));
        }
        
      } catch (error) {
        console.error('Error descargando backup:', error);
        alert('Error al descargar el backup: ' + error.message);
      } finally {
        this.downloading = false;
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    goToPage(page) {
      this.currentPage = page;
    }
  }
};
</script>

<style scoped>
.generate-backup-btn {
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  margin-right: 10px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.generate-backup-btn:hover:not(:disabled) {
  background: #218838;
}

.generate-backup-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.clean-backups-btn {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  margin-right: 10px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.clean-backups-btn:hover:not(:disabled) {
  background: #c82333;
}

.clean-backups-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.refresh-btn {
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.refresh-btn:hover {
  background: #0056b3;
}

.table-container {
  overflow-x: auto;
}

.load {
  display: block;
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
