<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="notification" style="margin-bottom: 0;">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
          <strong>{{ title }}</strong>
          <button class="button is-primary" @click="showCreateModal = true">
            <span class="icon">
              <i class="fas fa-plus"></i>
            </span>
            <span>Nueva Oficina</span>
          </button>
        </div>
      </div>

      <div class="container">

        <div class="tabs">
          <ul>
            <li v-for="office of offices" 
                :class="{ 'is-active': selected_office && selected_office.id === office.id }"
                @click="selected_office = office">
              <a>
                <span v-if="!office.active" style="opacity: 0.5; text-decoration: line-through;">{{ office.name }}</span>
                <span v-else>{{ office.name }}</span>
                <span class="tag" :class="office.active ? 'is-success' : 'is-danger'" style="margin-left: 8px;">
                  {{ office.active ? 'Activa' : 'Inactiva' }}
                </span>
                <button 
                  v-if="selected_office && selected_office.id === office.id"
                  class="button is-small" 
                  :class="office.active ? 'is-warning' : 'is-success'"
                  @click.stop="toggleActive(office)"
                  style="margin-left: 8px;">
                  <span class="icon is-small">
                    <i :class="office.active ? 'fas fa-ban' : 'fas fa-check'"></i>
                  </span>
                  <span>{{ office.active ? 'Desactivar' : 'Activar' }}</span>
                </button>
              </a>
            </li>
          </ul>
        </div>

        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field">
              <p class="control has-icons-left">
                <input class="input" type="text" @change="update" v-model="selected_office.email">
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <input class="input" type="text" @change="update" v-model="selected_office.password">
                <span class="icon is-small is-left">
                  <i class="fa-solid fa-key"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <input class="input" type="text" @change="update" v-model="selected_office.name">
                <span class="icon is-small is-left">
                  <i class="fa-solid fa-user"></i>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-body">
            <!-- <div class="field">
              <p class="control has-icons-left">
                <input class="input" type="text" @change="update" v-model="selected_office.name">
                <span class="icon is-small is-left">
                  <i class="fa-solid fa-user"></i>
                </span>
              </p>
            </div> -->
            <div class="field">
              <p class="control has-icons-left">
                <input class="input" type="text" @change="update" v-model="selected_office.address">
                <span class="icon is-small is-left">
                  <i class="fa-solid fa-location-dot"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <textarea class="input" @change="update" v-model="selected_office.accounts"></textarea>
                <span class="icon is-small is-left">
                  <i class="fa-solid fa-piggy-bank"></i>
                </span>
              </p>
            </div>
          </div>
        </div>


        <div class="columns">
          <div class="column">

            <table class="table">
              <tbody>
                <tr v-for="(product, i) in selected_office.products">
                  <th>{{ i + 1 }}</th>
                  <td>{{ product.name }}</td>
                  <td>{{ product.total }}</td>
                </tr>
              </tbody>
            </table>

          </div>
          <div class="column">
            <div class="notification" style="margin-bottom: 0;">
              <div class="container">

                <table class="table">
                  <tbody>
                    <tr v-for="(product, i) in selected_office.new_products">
                      <th>{{ i + 1 }}</th>
                      <td>{{ product.name }}</td>
                      <td>
                        <input type="number" style="width: 60px;" v-model="product.total">
                      </td>
                    </tr>
                  </tbody>
                </table>

                <button class="button is-primary" @click="recharge">Recargar</button>

              </div>
            </div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(recharge, i) of selected_office.recharges" @click="open(i)">
              <td>{{ recharge.date | date }}</td>
              <td v-show="recharge.show">
                <div v-for="product in recharge.products" v-if="product.total">
                  {{ product.total }} {{ product.name }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>

    </section>

    <!-- Modal para crear nueva oficina -->
    <div class="modal" :class="{ 'is-active': showCreateModal }">
      <div class="modal-background" @click="showCreateModal = false"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Crear Nueva Oficina</p>
          <button class="delete" @click="showCreateModal = false"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">ID de Oficina</label>
            <div class="control has-icons-left">
              <input 
                class="input" 
                type="text" 
                v-model="newOffice.id" 
                placeholder="Ej: oficina-1"
                required>
              <span class="icon is-small is-left">
                <i class="fas fa-id-card"></i>
              </span>
            </div>
            <p class="help">ID único para identificar la oficina</p>
          </div>

          <div class="field">
            <label class="label">Nombre</label>
            <div class="control has-icons-left">
              <input 
                class="input" 
                type="text" 
                v-model="newOffice.name" 
                placeholder="Nombre de la oficina"
                required>
              <span class="icon is-small is-left">
                <i class="fas fa-building"></i>
              </span>
            </div>
          </div>

          <div class="field">
            <label class="label">Email</label>
            <div class="control has-icons-left">
              <input 
                class="input" 
                type="email" 
                v-model="newOffice.email" 
                placeholder="email@ejemplo.com"
                required>
              <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
          </div>

          <div class="field">
            <label class="label">Contraseña</label>
            <div class="control has-icons-left">
              <input 
                class="input" 
                type="password" 
                v-model="newOffice.password" 
                placeholder="Contraseña"
                required>
              <span class="icon is-small is-left">
                <i class="fas fa-key"></i>
              </span>
            </div>
          </div>

          <div class="field">
            <label class="label">Dirección</label>
            <div class="control has-icons-left">
              <input 
                class="input" 
                type="text" 
                v-model="newOffice.address" 
                placeholder="Dirección de la oficina">
              <span class="icon is-small is-left">
                <i class="fas fa-location-dot"></i>
              </span>
            </div>
          </div>

          <div class="field">
            <label class="label">Cuentas</label>
            <div class="control has-icons-left">
              <textarea 
                class="textarea" 
                v-model="newOffice.accounts" 
                placeholder="Información de cuentas bancarias"></textarea>
              <span class="icon is-small is-left">
                <i class="fas fa-piggy-bank"></i>
              </span>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="checkbox">
                <input type="checkbox" v-model="newOffice.active">
                Oficina activa
              </label>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="createOffice" :disabled="creating">
            <span v-if="creating">Creando...</span>
            <span v-else>Crear Oficina</span>
          </button>
          <button class="button" @click="showCreateModal = false">Cancelar</button>
        </footer>
      </div>
    </div>

  </Layout>
</template>

<script>
import Layout from '@/views/Layout'
import api from '@/api'

export default {
  components: { Layout },
  data() {
    return{
      // tree,
      // l,
      // id,
      loading: null,
      title: 'Oficinas',
      offices: [],
      selected_office : null,
      showCreateModal: false,
      creating: false,
      newOffice: {
        id: '',
        name: '',
        email: '',
        password: '',
        address: '',
        accounts: '',
        active: true,
      },
      allProducts: [],
    }
  },

  filters: {
    date(val) {
      return new Date(val).toLocaleDateString()
    },
  },

  async created() {

    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)

    this.loading = true

    // Obtener productos para inicializar nuevas oficinas
    try {
      const productsResponse = await api.products.GET();
      this.allProducts = productsResponse.data.products || [];
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }

    // GET data
    const { data } = await api.offices.GET(); console.log({ data })

    this.loading = false

    // error
    // if(data.error && data.msg == 'invalid filter') this.$router.push('collects/all')


    data.offices = data.offices.map(office => {

      office.new_products = []

      office.products.forEach(p => {
        office.new_products.push({
          id: p.id,
          name: p.name,
          total: 0,
        })
      })

      office.recharges.forEach(r => {
        r.show = false
      })

      // Asegurar que active existe
      if (office.active === undefined) {
        office.active = true;
      }

      return office
    })

    this.offices = data.offices

    if (this.offices.length > 0) {
      this.selected_office = this.offices[0]
    }
  },

  methods: {
    async recharge() {
      console.log('recharge')

      const id       = this.selected_office.id
      const products = this.selected_office.new_products

      products.forEach(p => {
        p.total = parseInt(p.total)
      })

      console.log({id, products})

      this.$confirm.show({
        title: 'Recargar Productos',
        message: '¿Seguro que desea hacer la recarga de productos?',
        type: 'warning',
        confirmText: 'Recargar',
        onConfirm: async () => {
          await this.performRecharge(id, products);
        }
      });
    },
    async performRecharge(id, products) {
      this.selected_office.products.forEach((p, i) => {
        p.total += products[i].total
      })

      const { data } = await api.offices.POST({ id, products }); 
      console.log({ data })
      
      if (data.error) {
        this.$toast.error('Error', data.msg || 'Error al recargar productos');
      } else {
        this.$toast.success('Éxito', 'Productos recargados correctamente');
      }

    },

    async update() {
      console.log('update ...')

      const office = this.selected_office

      try {
        const { data } = await api.offices.POST({ id: office.id, office });
        console.log({ data });
        
        if (data.error) {
          this.$toast.error('Error', data.msg || 'Error al actualizar la oficina');
        } else {
          this.$toast.success('Éxito', 'Oficina actualizada correctamente');
        }
      } catch (error) {
        console.error('Error al actualizar oficina:', error);
        this.$toast.error('Error', 'Error al actualizar la oficina');
      }
    },

    open(i) {
      console.log(i)
      this.selected_office.recharges[i].show = !this.selected_office.recharges[i].show
    },

    async createOffice() {
      if (!this.newOffice.id || !this.newOffice.name || !this.newOffice.email || !this.newOffice.password) {
        this.$toast.error('Error', 'Por favor complete todos los campos requeridos');
        return;
      }

      this.creating = true;

      try {
        const { data } = await api.offices.CREATE(this.newOffice);
        
        if (data.error) {
          this.$toast.error('Error', data.msg || 'Error al crear la oficina');
        } else {
          this.$toast.success('Éxito', 'Oficina creada correctamente');
          this.showCreateModal = false;
          
          // Resetear formulario
          this.newOffice = {
            id: '',
            name: '',
            email: '',
            password: '',
            address: '',
            accounts: '',
            active: true,
          };

          // Recargar lista de oficinas
          await this.reloadOffices();
        }
      } catch (error) {
        console.error('Error al crear oficina:', error);
        this.$toast.error('Error', 'Error al crear la oficina');
      } finally {
        this.creating = false;
      }
    },

    async toggleActive(office) {
      const action = office.active ? 'desactivar' : 'activar';
      
      this.$confirm.show({
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} Oficina`,
        message: `¿Seguro que desea ${action} la oficina "${office.name}"?`,
        type: office.active ? 'warning' : 'info',
        confirmText: action.charAt(0).toUpperCase() + action.slice(1),
        onConfirm: async () => {
          try {
            const { data } = await api.offices.TOGGLE_ACTIVE(office.id);
            
            if (data.error) {
              this.$toast.error('Error', data.msg || `Error al ${action} la oficina`);
            } else {
              this.$toast.success('Éxito', data.msg || `Oficina ${action}da correctamente`);
              
              // Actualizar estado local
              office.active = !office.active;
              
              // Recargar lista de oficinas para asegurar sincronización
              await this.reloadOffices();
            }
          } catch (error) {
            console.error(`Error al ${action} oficina:`, error);
            this.$toast.error('Error', `Error al ${action} la oficina`);
          }
        }
      });
    },

    async reloadOffices() {
      this.loading = true;
      
      try {
        const { data } = await api.offices.GET();
        
        data.offices = data.offices.map(office => {
          office.new_products = [];

          office.products.forEach(p => {
            office.new_products.push({
              id: p.id,
              name: p.name,
              total: 0,
            });
          });

          office.recharges.forEach(r => {
            r.show = false;
          });

          if (office.active === undefined) {
            office.active = true;
          }

          return office;
        });

        this.offices = data.offices;

        // Mantener la oficina seleccionada si existe
        if (this.selected_office) {
          const updatedOffice = this.offices.find(o => o.id === this.selected_office.id);
          if (updatedOffice) {
            this.selected_office = updatedOffice;
          } else if (this.offices.length > 0) {
            this.selected_office = this.offices[0];
          }
        } else if (this.offices.length > 0) {
          this.selected_office = this.offices[0];
        }
      } catch (error) {
        console.error('Error al recargar oficinas:', error);
        this.$toast.error('Error', 'Error al recargar la lista de oficinas');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
