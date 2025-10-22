<template>
  <Layout>
    <div style="margin-bottom: 20px;">
      <button class="heroku-restart-btn" @click="reiniciarHeroku">Reiniciar App Heroku</button>
      <button class="backup-download-btn" @click="downloadBackup" :disabled="downloadingBackup">
        <i class="fa-solid fa-download" v-if="!downloadingBackup"></i>
        <i class="fa-solid fa-spinner fa-spin" v-if="downloadingBackup"></i>
        {{ downloadingBackup ? 'Generando Backup...' : 'Descargar Backup' }}
      </button>
    </div>
    <i class="load" v-if="loading"></i>

    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>{{ title }}</strong>
          <input
            class="input"
            placeholder="Buscar por nombre"
            v-model="search"
            @input="debouncedInput"
          />
          <br /><br />

          <small
            >Total disponible: USD
            {{ Number(totalBalance || 0).toFixed(2) }} &nbsp;&nbsp; /
            &nbsp;&nbsp; Total no disponible: USD
            {{ Number(totalVirtualBalance || 0).toFixed(2) }}
          </small>
        </div>
      </div>

      <div class="container">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Registro</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Código</th>
                <th>Puntos</th>
                <th>Puntos Afiliación</th>
                <th>
                  Saldo disponible
                  <input type="checkbox" v-model="check" @change="fetchUsers" />
                </th>
                <th>No Disponible</th>
                <th>Patrocinador</th>
                <th>País</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(user, i) in sortedUsers"
                :key="user.id"
                v-show="user.visible"
              >
                <th>{{ totalItems - (currentPage - 1) * itemsPerPage - i }}</th>
                <td>{{ user.date | date }}</td>
                <td style="position: relative">
                  <span v-if="!user.edit"
                    >{{ user.name }} {{ user.lastName }}</span
                  >

                  <span v-if="user.edit">
                    <select v-model="user._rank">
                      <option value="none">{{ translateRank("none") }}</option>
                      <option value="active">
                        {{ translateRank("active") }}
                      </option>
                      <option value="star">{{ translateRank("star") }}</option>
                      <option value="master">
                        {{ translateRank("master") }}
                      </option>
                      <option value="silver">
                        {{ translateRank("silver") }}
                      </option>
                      <option value="gold">{{ translateRank("gold") }}</option>
                      <option value="sapphire">
                        {{ translateRank("sapphire") }}
                      </option>
                      <option value="RUBI">{{ translateRank("RUBI") }}</option>
                      <option value="DIAMANTE">
                        {{ translateRank("DIAMANTE") }}
                      </option>
                      <option value="DOBLE DIAMANTE">
                        {{ translateRank("DOBLE DIAMANTE") }}
                      </option>
                      <option value="TRIPLE DIAMANTE">
                        {{ translateRank("TRIPLE DIAMANTE") }}
                      </option>
                      <option value="DIAMANTE ESTRELLA">
                        {{ translateRank("DIAMANTE ESTRELLA") }}
                      </option>
                    </select>
                  </span>
                  <input
                    class="input"
                    v-model="user._name"
                    placeholder="Nombre"
                    style="max-width: 120px"
                    v-if="user.edit"
                  />
                  <input
                    class="input"
                    v-model="user._lastName"
                    placeholder="Apellido"
                    style="max-width: 120px"
                    v-if="user.edit"
                  />
                  <br />

                  <a v-if="!user.edit">{{ user.dni }}</a>

                  <input
                    class="input"
                    v-model="user._dni"
                    placeholder="Documento"
                    style="max-width: 120px"
                    v-if="user.edit"
                  />

                  <input
                    class="input"
                    v-model="user._password"
                    placeholder="Contraseña"
                    style="max-width: 240px"
                    v-if="user.edit"
                  /><br />

                  <div style="position: absolute; top: 8px; right: -8px">
                    <i
                      class="fa-regular fa-pen-to-square"
                      style="color: #ccc; cursor: pointer; margin-right: 8px"
                      v-if="!user.edit"
                      @click="edit(user)"
                    ></i>
                    <i
                      class="fa-solid fa-check"
                      style="color: #ccc; cursor: pointer; margin-right: 8px"
                      v-if="user.edit"
                      @click="save(user)"
                    ></i>
                    <i
                      class="fa-solid fa-xmark"
                      style="color: #ccc; cursor: pointer; margin-right: 8px"
                      v-if="user.edit"
                      @click="cancel(user)"
                    ></i>
                  </div>
                  <br />

                  <p v-if="user.rank">rango: {{ user.rank | _rank }}</p>
                  tel: {{ user.phone }} <br />
                </td>
                <td>
                  <span v-if="user.activated === true">✓ Activado</span>
                  <span v-else-if="user.affiliated">Afiliado</span>
                  <span v-else>Registrado</span>
                  <br />
                  <button 
                    @click="toggleActive(user)" 
                    :class="user.activated === true ? 'btn-deactivate' : 'btn-activate'"
                    style="margin-top: 5px; padding: 4px 8px; font-size: 0.85em; cursor: pointer; border: none; border-radius: 4px;"
                  >
                    {{ user.activated === true ? 'Desactivar' : 'Activar' }}
                  </button>
                </td>
                <td>{{ user.token }}</td>
                <td>
                  <p v-if="!user.edit">{{ Number(user.points).toFixed(2) }}</p>

                  <input
                    class="input"
                    v-model.number="user._points"
                    type="number"
                    step="any"
                    placeholder="Puntos"
                    style="max-width: 120px"
                    v-if="user.edit"
                    @blur="user._points = Number(user._points).toFixed(2)"
                  />
                </td>
                <td>
                  <p v-if="!user.edit">{{ Number(user.affiliation_points || 0).toFixed(2) }}</p>

                  <input
                    class="input"
                    v-model.number="user._affiliation_points"
                    type="number"
                    step="any"
                    placeholder="Ptos. Afiliación"
                    style="max-width: 120px"
                    v-if="user.edit"
                    @blur="user._affiliation_points = Number(user._affiliation_points).toFixed(2)"
                  />
                </td>
                <td>
                  <!-- <span v-if="user.balance != 0">
                    {{ user.balance | money }}
                  </span> -->
                  {{ user.balance | money }}
                  <br />
                  <div v-if="user.balance > 0" style="margin-top: 5px;">
                    <input 
                      v-model.number="user.transferAmount" 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      :max="user.balance"
                      placeholder="Monto"
                      style="width: 80px; padding: 2px; font-size: 0.85em;"
                    />
                    <button 
                      @click="transferToVirtual(user)" 
                      style="padding: 4px 8px; font-size: 0.85em; cursor: pointer; border: none; border-radius: 4px; background-color: #ff9800; color: white; margin-left: 3px;"
                    >
                      → No Disp.
                    </button>
                  </div>
                </td>
                <td>
                  {{ user.virtualbalance | money }} <br />
                  <a v-if="user.virtualbalance > 0" @click="migrate(user)"
                    >migrar todo</a
                  >
                  <div v-if="user.virtualbalance > 0" style="margin-top: 5px;">
                    <input 
                      v-model.number="user.transferAmountVirtual" 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      :max="user.virtualbalance"
                      placeholder="Monto"
                      style="width: 80px; padding: 2px; font-size: 0.85em;"
                    />
                    <button 
                      @click="transferToAvailable(user)" 
                      style="padding: 4px 8px; font-size: 0.85em; cursor: pointer; border: none; border-radius: 4px; background-color: #4caf50; color: white; margin-left: 3px;"
                    >
                      → Disp.
                    </button>
                  </div>
                </td>
                <td>
                  <div v-if="user.parent">
                    {{ user.parent.name }} {{ user.parent.lastName }} <br />

                    <a v-if="!user.edit">{{ user.parent.dni }}</a>

                    <input
                      class="input"
                      v-model="user._parent_dni"
                      placeholder="Documento"
                      style="max-width: 120px"
                      v-if="user.edit"
                    /><br />

                    {{ user.parent.phone }}
                  </div>
                </td>
                <td>{{ user.country }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="!loading">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="pagination-button"
          >
            Anterior
          </button>
          <span class="pagination-info">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
          <input
            type="number"
            v-model="pageInput"
            @keyup.enter="goToPage"
            min="1"
            :max="totalPages"
            class="pagination-input"
          />
          <button @click="goToPage" class="pagination-button">Ir</button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="pagination-button"
          >
            Siguiente
          </button>
        </div>
      </div>

      <button class="scroll-to-top" v-if="showScrollToTop" @click="scrollToTop">
        <i class="fa-solid fa-arrow-up"></i>
      </button>
    </section>
  </Layout>
</template>

<script>
import Layout from "@/views/Layout";
import api from "@/api";
import { debounce } from "lodash";

export default {
  components: { Layout },
  data() {
    return {
      users: [],

      loading: true,

      title: null,

      search: null,
      check: false,

      show: false,

      currentPage: 1,
      itemsPerPage: 20,
      totalItems: 0,
      totalPages: 0,
      pageInput: 1,
      searchTimeout: null,
      totalBalance: 0,
      totalVirtualBalance: 0,
      showScrollToTop: false,
      downloadingBackup: false,
    };
  },
  computed: {
    sortedUsers() {
      return this.users.sort((a, b) => new Date(b.date) - new Date(a.date)); // Asegúrate de que las fechas estén en un formato correcto
    },
    balance() {
      const ret = this.users.reduce((total, user) => total + user.balance, 0);
      return ret;
    },
    virtualBalance() {
      const ret = this.users.reduce((a, b) => a + Number(b.virtualbalance), 0);

      return ret;
    },
  },
  filters: {
    date(val) {
      return new Date(val).toLocaleDateString();
    },
    money(val) {
      if (val == null || isNaN(val)) return "0.00";
      return `USD ${Number(val).toFixed(2)}`;
    },
    _rank(val) {
      if (val == "none") return "Ninguno";
      if (val == "active") return "ACTIVO";
      if (val == "star") return "MASTER";
      if (val == "master") return "PLATA";
      if (val == "silver") return "PLATINO";
      if (val == "gold") return "ORO";
      if (val == "sapphire") return "ZAFIRO";
      if (val == "RUBI") return "DIAMANTE RUBI";
      if (val == "DIAMANTE") return "DIAMANTE ESTRELLA";
      if (val == "DOBLE DIAMANTE") return "DIAMANTE DOS ESTRELLAS";
      if (val == "TRIPLE DIAMANTE") return "DIAMANTE TRES ESTRELLAS";
      if (val == "DIAMANTE ESTRELLA") return "DIAMANTE CBM";
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.GET(to.params.filter);
    next();
  },
  created() {
    const account = JSON.parse(localStorage.getItem("session"));

    this.$store.commit("SET_ACCOUNT", account);

    this.GET(this.$route.params.filter);

    this.debouncedInput = debounce(this.input, 1500);
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    async fetchUsers() {
      await this.GET(this.$route.params.filter); // Llama a GET para obtener usuarios
    },
    async GET(filter) {
      this.loading = true;

      // GET data
      const { data } = await api.users.GET({
        filter,
        page: this.currentPage,
        limit: this.itemsPerPage,
        search: this.search || undefined,
        totalBalance: this.totalBalance,
        totalVirtualBalance: this.totalVirtualBalance,
        showAvailable: this.check,
      });
      console.log({ data });

      this.loading = false;
      // error
      if (data.error && data.msg == "invalid filter")
        this.$router.push("activations/all");

      // success
      this.users = data.users
        .map((i) => ({
          ...i,
          sending: false,
          visible: true,
          edit: false,
          _name: "",
          _lastName: "",
          _dni: "",
          _password: "",
          _parent_dni: "",
          _points: 0,
          _rank: "",
          _affiliation_points: 0,
          transferAmount: 0,
          transferAmountVirtual: 0,
        }))
        .reverse();

      this.totalItems = data.total;
      this.totalPages = data.totalPages;
      this.totalBalance = data.totalBalance;
      this.totalVirtualBalance = data.totalVirtualBalance;
      this.showAvailable = data.showAvailable;

      if (filter == "all") this.title = "Todos los usuarios";
      if (filter == "affiliated") this.title = "Usuarios Afiliados";
      if (filter == "activated") this.title = "Usuarios Activados";
    },
    async changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.pageInput = page;
        await this.GET(this.$route.params.filter);
      }
    },

    async nextPage() {
      await this.changePage(this.currentPage + 1);
    },

    async previousPage() {
      await this.changePage(this.currentPage - 1);
    },
    async goToPage() {
      const page = Math.max(1, Math.min(parseInt(this.pageInput) || 1, this.totalPages));
      this.currentPage = page;
      this.pageInput = page;
      await this.GET(this.$route.params.filter);
    },
    async input() {
      this.GET(this.$route.params.filter);
    },
    input2() {
      console.log({ check });
    },
    async migrate(user) {
      console.log("migrate ..");
      console.log({ user });

      if (!confirm("Desea migrar el saldo no disponible?")) return;

      user.balance += user.virtualbalance;
      user.virtualbalance = 0;

      const { data } = await api.users.POST({ action: "migrate", id: user.id });
      console.log({ data });
    },
    edit(user) {
      user.edit = true;
      if (!user._name) user._name = user.name;
      if (!user._lastName) user._lastName = user.lastName;
      if (!user._dni) user._dni = user.dni;
      if (!user._points) user._points = user.points;
      if (!user._affiliation_points) user._affiliation_points = user.affiliation_points || 0;

      if (!user._parent_dni) user._parent_dni = user.parent.dni;
      if (!user._rank) user._rank = user.rank;
    },
    async save(user) {
      user._points = Number(user._points); // asegura que sea número (float si aplica)
      user._affiliation_points = Number(user._affiliation_points); // asegura que sea número
      
      // post new name
      const { data } = await api.users.POST({
        action: "name",
        id: user.id,
        data: {
          _name: user._name,
          _lastName: user._lastName,
          _dni: user._dni,
          _password: user._password,
          _parent_dni: user._parent_dni,
          _points: user._points, // ya es número
          _rank: user._rank,
          _affiliation_points: user._affiliation_points, // puntos de afiliación
        },
      });

      user.name = user._name;
      user.lastName = user._lastName;
      user.dni = user._dni;
      user.points = user._points; // ya es número
      user.affiliation_points = user._affiliation_points; // actualizar puntos de afiliación

      user.parent.dni = user._parent_dni;
      user.rank = user._rank;
      user.edit = false;
    },
    cancel(user) {
      user.edit = false;
    },
    handleScroll() {
      this.showScrollToTop = window.scrollY >= document.body.offsetHeight / 2;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    translateRank(val) {
      switch (val) {
        case "none":
          return "Ninguno";
        case "active":
          return "ACTIVO";
        case "star":
          return "MASTER";
        case "master":
          return "PLATA";
        case "silver":
          return "PLATINO";
        case "gold":
          return "ORO";
        case "sapphire":
          return "ZAFIRO";
        case "RUBI":
          return "DIAMANTE RUBI";
        case "DIAMANTE":
          return "DIAMANTE ESTRELLA";
        case "DOBLE DIAMANTE":
          return "DIAMANTE DOS ESTRELLAS";
        case "TRIPLE DIAMANTE":
          return "DIAMANTE TRES ESTRELLAS";
        case "DIAMANTE ESTRELLA":
          return "DIAMANTE CBM";
        default:
          return val; // Devuelve el valor original si no coincide
      }
    },
    async reiniciarHeroku() {
      try {
        const response = await fetch(`${process.env.VUE_APP_SERVER}/api/reiniciar-heroku`, { method: 'POST' });
        const data = await response.json();
        if (data.success) {
          alert('¡App de Heroku reiniciada correctamente!');
        } else {
          alert('Error al reiniciar Heroku: ' + data.error);
        }
      } catch (e) {
        alert('Error de conexión con el backend de reinicio de Heroku');
      }
    },
    async downloadBackup() {
      if (!confirm('¿Desea descargar un backup completo de la base de datos? Esto puede tomar unos minutos.')) {
        return;
      }

      this.downloadingBackup = true;
      
      try {
        console.log('Iniciando descarga de backup...');
        
        const response = await fetch(`${process.env.VUE_APP_SERVER}/api/admin/backup-mongodump-format`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error('Error del servidor: ' + response.status);
        }

        // Verificar si es un archivo ZIP
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/zip')) {
          console.log('Procesando archivo ZIP...');
          
          // Crear blob y descargar
          const blob = await response.blob();
          console.log('Blob creado, tamaño:', blob.size);
          
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.style.display = 'none';
          
          // Obtener nombre del archivo desde headers
          const contentDisposition = response.headers.get('content-disposition');
          let filename = 'cbm-backup.zip';
          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch) {
              filename = filenameMatch[1];
            }
          }
          
          // Intentar usar File System Access API para permitir elegir ubicación
          if ('showSaveFilePicker' in window) {
            try {
              const fileHandle = await window.showSaveFilePicker({
                suggestedName: filename,
                types: [{
                  description: 'Archivos ZIP',
                  accept: {
                    'application/zip': ['.zip']
                  }
                }]
              });
              
              const writable = await fileHandle.createWritable();
              await writable.write(blob);
              await writable.close();
              
              alert('✓ Backup guardado exitosamente en la ubicación seleccionada.');
            } catch (saveError) {
              if (saveError.name !== 'AbortError') {
                console.error('Error guardando archivo:', saveError);
                // Fallback a descarga normal
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                }, 1000);
                alert('✓ Backup descargado exitosamente. El archivo se guardará en tu carpeta de Descargas.');
              }
            }
          } else {
            // Fallback para navegadores que no soportan File System Access API
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }, 1000);
            alert('✓ Backup descargado exitosamente. El archivo se guardará en tu carpeta de Descargas.');
          }
        } else {
          // Si no es un archivo, mostrar error
          const responseText = await response.text();
          console.error('Respuesta inesperada:', responseText);
          throw new Error('El servidor no devolvió un archivo ZIP válido. Respuesta: ' + responseText.substring(0, 200));
        }
        
      } catch (error) {
        console.error('Error descargando backup:', error);
        alert('Error al descargar el backup: ' + error.message);
      } finally {
        this.downloadingBackup = false;
      }
    },
    async toggleActive(user) {
      // Determinar el nuevo estado: si es null o false -> true, si es true -> false
      const currentStatus = user.activated === true;
      const newStatus = !currentStatus;
      
      console.log('=== TOGGLE ACTIVE DEBUG ===');
      console.log('Usuario completo:', user);
      console.log('user.activated (valor original):', user.activated, 'tipo:', typeof user.activated);
      console.log('currentStatus:', currentStatus);
      console.log('newStatus:', newStatus);
      
      const confirmMessage = newStatus 
        ? '¿Desea activar este usuario?' 
        : '¿Desea desactivar este usuario?';
      
      if (!confirm(confirmMessage)) return;

      try {
        const payload = { 
          action: "toggle-active", 
          id: user.id,
          activated: newStatus
        };
        
        console.log('Payload enviado al servidor:', payload);
        console.log('activated enviado:', newStatus, 'tipo:', typeof newStatus);
        
        const { data } = await api.users.POST(payload);
        
        console.log('Respuesta del servidor:', data);
        
        if (data.error) {
          alert('Error: ' + data.msg);
          return;
        }

        // Actualizar el estado localmente con el valor del servidor
        user.activated = data.activated;
        alert(`✓ Usuario ${data.activated ? 'activado' : 'desactivado'} correctamente`);
        
        // Recargar la lista para asegurar que los datos estén sincronizados
        await this.GET(this.$route.params.filter);
      } catch (e) {
        alert('Error al cambiar el estado del usuario: ' + (e.message || 'Error de conexión'));
        console.error('Error completo:', e);
      }
    },
    async transferToVirtual(user) {
      const amount = parseFloat(user.transferAmount);
      
      if (!amount || amount <= 0 || isNaN(amount)) {
        alert('Por favor ingrese un monto válido mayor a 0');
        return;
      }

      if (amount > user.balance) {
        alert(`El monto excede el saldo disponible. Disponible: USD ${user.balance.toFixed(2)}`);
        return;
      }

      if (!confirm(`¿Desea transferir USD ${amount.toFixed(2)} del saldo disponible al no disponible?`)) return;

      try {
        console.log('Enviando transferencia:', { action: "transfer-balance", id: user.id, amount: amount, direction: 'toVirtual' });
        
        const { data } = await api.users.POST({ 
          action: "transfer-balance", 
          id: user.id,
          amount: amount,
          direction: 'toVirtual'
        });
        
        console.log('Respuesta del servidor:', data);
        
        if (data.error) {
          alert('Error: ' + (data.msg || 'Error desconocido'));
          return;
        }

        // Actualizar saldos localmente
        user.balance = parseFloat((user.balance - amount).toFixed(2));
        user.virtualbalance = parseFloat((user.virtualbalance + amount).toFixed(2));
        user.transferAmount = 0;
        
        alert('✓ Transferencia realizada correctamente');
        
        // Recargar la lista para asegurar datos actualizados
        await this.GET(this.$route.params.filter);
      } catch (e) {
        alert('Error al realizar la transferencia: ' + (e.message || 'Error de conexión'));
        console.error('Error completo:', e);
      }
    },
    async transferToAvailable(user) {
      const amount = parseFloat(user.transferAmountVirtual);
      
      if (!amount || amount <= 0 || isNaN(amount)) {
        alert('Por favor ingrese un monto válido mayor a 0');
        return;
      }

      if (amount > user.virtualbalance) {
        alert(`El monto excede el saldo no disponible. Disponible: USD ${user.virtualbalance.toFixed(2)}`);
        return;
      }

      if (!confirm(`¿Desea transferir USD ${amount.toFixed(2)} del saldo no disponible al disponible?`)) return;

      try {
        console.log('Enviando transferencia:', { action: "transfer-balance", id: user.id, amount: amount, direction: 'toAvailable' });
        
        const { data } = await api.users.POST({ 
          action: "transfer-balance", 
          id: user.id,
          amount: amount,
          direction: 'toAvailable'
        });
        
        console.log('Respuesta del servidor:', data);
        
        if (data.error) {
          alert('Error: ' + (data.msg || 'Error desconocido'));
          return;
        }

        // Actualizar saldos localmente
        user.virtualbalance = parseFloat((user.virtualbalance - amount).toFixed(2));
        user.balance = parseFloat((user.balance + amount).toFixed(2));
        user.transferAmountVirtual = 0;
        
        alert('✓ Transferencia realizada correctamente');
        
        // Recargar la lista para asegurar datos actualizados
        await this.GET(this.$route.params.filter);
      } catch (e) {
        alert('Error al realizar la transferencia: ' + (e.message || 'Error de conexión'));
        console.error('Error completo:', e);
      }
    },
  },
};
</script>

<style>
.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: inline-block;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
.scroll-to-top:hover {
  background-color: #0056b3;
}
.scroll-to-top i {
  font-size: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
.pagination button {
  margin: 0 5px;
}
.heroku-restart-btn {
  background: #8000b0;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  margin: 20px 0 10px 0;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
}
.heroku-restart-btn:hover {
  background: #a040c0;
}

.backup-download-btn {
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  margin-left: 10px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.backup-download-btn:hover:not(:disabled) {
  background: #218838;
}

.backup-download-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-activate {
  background-color: #4caf50;
  color: white;
}

.btn-activate:hover {
  background-color: #45a049;
}

.btn-deactivate {
  background-color: #f44336;
  color: white;
}

.btn-deactivate:hover {
  background-color: #da190b;
}
</style>
