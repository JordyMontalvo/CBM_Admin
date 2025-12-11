<template>
  <Layout>
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando datos, por favor espera...</p>
      <!-- Mensaje de carga estilizado -->
    </div>

    <div class="container">
      <!-- Configuración de límite por página para admin -->

      <!-- Botón para iniciar cierre (solo admin) -->


      <!-- Resto del contenido existente -->
      <br />
      <br />
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Puntos Personales</th>
            <th>Puntos Grupales</th>
            <th>Rango</th>
            <th>Bono Residual</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(node, i) in tree.filter(
              (e) =>
                (e.rank != 'none' && e.rank != null) ||
                e.activated ||
                e._activated
            )"
            :key="node.id"
          >
            <th>{{ i + 1 }}</th>
            <td>{{ node.name }}</td>
            <td>{{ node.points }}</td>
            <td>{{ node._total }}</td>
            <td>{{ node.rank }}</td>
            <td>{{ node.residual_bonus }}</td>
          </tr>
        </tbody>
      </table>

      Activos simple: {{ tree.filter((e) => e._activated).length }} <br />
      Activos full: {{ tree.filter((e) => e.activated).length }} <br /><br />

      Afiliaciones: {{ affiliations.length }} <br />
      Compras: {{ activations.length }} <br />
      <br />
      <div style="margin-top: 1em;">
        <button class="button is-primary" @click="closed2">Iniciar cierre</button>
      </div>
      <button v-if="!saving" class="button" @click="save">Guardar</button>
      <button v-if="saving" class="button">Guardando ...</button>
    </div>

    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>Selecciona una fecha de cierre</strong>
          <select v-model="selectedDate" @change="onDateChange">
            <option value="" disabled>Selecciona una fecha</option>
            <option
              v-for="date in closureDates.slice().reverse()"
              :key="date"
              :value="date"
            >
              {{ date | date }}
            </option>
          </select>
        </div>
      </div>

      <!-- Configuración de límite por página para admin -->
      <div v-if="isAdmin" style="margin-top: 1em;">
        <label for="limit">Cierres por página:</label>
        <input id="limit" type="number" v-model.number="limit" min="1" @change="getClosureDates(1)" style="width: 60px; margin-left: 0.5em;">
      </div>
      <br />
      <div class="container">
        <br />
        <div v-if="selectedClosure" style="margin-bottom: 1em;">
          <button class="button is-success" @click="exportToExcel">
            <span>📊 Exportar a Excel</span>
          </button>
        </div>
        <br />
        <table class="table" v-if="selectedClosure">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Puntos Personales</th>
              <th>Puntos Grupales</th>
              <th>Rango</th>
              <th>Bono Residual</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, i) in selectedClosure.users" :key="user.id">
              <th>{{ i + 1 }}</th>
              <td>{{ user.name }}</td>
              <td>{{ user.points ? user.points.toFixed(2) : "0.00" }}</td>
              <td>{{ user._total ? user._total.toFixed(2) : "0.00" }}</td>
              <td>{{ user.rank | _rank }}</td>
              <td>
                {{
                  user.residual_bonus ? user.residual_bonus.toFixed(2) : "0.00"
                }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <p>No hay datos para la fecha seleccionada.</p>
        </div>
        <br />
      </div>
    </section>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </Layout>
</template>

<script>
import Layout from "@/views/Layout";
import api from "@/api";
import lib from "@/lib";
import { debounce } from "lodash";

export default {
  components: { Layout },
  data() {
    const session = JSON.parse(localStorage.getItem("session"));
    return {
      loading: true,
      // tree, affiliations, activations solo se usan para el cierre seleccionado
      tree: [],
      affiliations: [],
      activations: [],
      closureDates: [],
      errorMessage: "",
      saving: false,
      selectedDate: "",
      selectedClosure: null,
      closeds: [],
      totalCloseds: 0, // total de cierres
      totalPages: 1,   // total de páginas
      currentPage: 1,  // página actual
      limit: 20,       // cierres por página
      isAdmin: false, // Flag para admin, puedes ajustarlo según tu lógica
    };
  },
  created() {
    const account = JSON.parse(localStorage.getItem("session"));
    this.$store.commit("SET_ACCOUNT", account);
    this.getClosureDates();
    // Detectar si el usuario es admin (sin importar mayúsculas/minúsculas)
    this.isAdmin = account && account.role && account.role.toLowerCase() === 'admin';
  },
  filters: {
    date(val) {
      return new Date(val).toLocaleDateString();
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
  methods: {
    async closed2() {
      const { data } = await api.closeds.POST({ action: "new" });
      console.log({ data });

      this.tree = data.tree;
      this.affiliations = data.affiliations;
      this.activations = data.activations;

      for (let node of this.tree) {
        if (node.rank != "none") {
          if (node._pays.length) {
            console.log(node.name);
            console.log(node._pays);
            console.log("");
          }
        }
      }
    },

    async save() {
      if (
        !confirm(
          "Esta por guardar el cierre, este proceso no se puede revertir"
        )
      )
        return;
      console.log(this.activations);
      // return

      this.saving = true;

      const { data } = await api.closeds.POST({
        action: "save",
        data: {
          tree: this.tree,
          affiliations: this.affiliations,
          activations: this.activations,
        },
      });

      this.saving = false;

      location.reload();
    },

    updateTable() {
      this.selectedClosure = this.closeds.find(
        (closed) => closed.date === this.selectedDate
      );
    },

    async getClosureDates(page = 1) {
      this.loading = true;
      this.errorMessage = "";
      try {
        const { data } = await api.closeds.GET({ page, limit: this.limit });
        this.closeds = data.closeds || [];
        this.closureDates = this.closeds.map(c => c.date);
        this.totalCloseds = data.total || 0;
        this.totalPages = data.totalPages || 1;
        this.currentPage = data.currentPage || 1;
      } catch (error) {
        this.errorMessage = "No se pudieron cargar los cierres.";
      } finally {
        this.loading = false;
      }
    },
    async onDateChange() {
      if (!this.selectedDate) {
        this.selectedClosure = null;
        return;
      }
      this.loading = true;
      this.errorMessage = "";
      try {
        // Busca el cierre por fecha en el array ya cargado
        this.selectedClosure = this.closeds.find(
          closed => closed.date === this.selectedDate
        );
        if (!this.selectedClosure) {
          this.errorMessage = "No hay datos para la fecha seleccionada.";
        }
      } catch (error) {
        this.errorMessage = "Hubo un problema al cargar el cierre. Inténtalo de nuevo más tarde.";
        this.selectedClosure = null;
      } finally {
        this.loading = false;
      }
    },
    // Métodos para paginación
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.getClosureDates(this.currentPage + 1);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.getClosureDates(this.currentPage - 1);
      }
    },
    exportToExcel() {
      if (!this.selectedClosure || !this.selectedClosure.users || this.selectedClosure.users.length === 0) {
        alert("No hay datos para exportar. Por favor selecciona un cierre con datos.");
        return;
      }

      // Crear nombre de archivo con la fecha del cierre
      const date = new Date(this.selectedClosure.date);
      const dateStr = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const filename = `Cierres_${dateStr}.xlsx`;

      // Preparar los datos para Excel
      let data_xls = [];

      this.selectedClosure.users.forEach((user, index) => {
        data_xls.push({
          "#": index + 1,
          "Nombre": user.name || "",
          "Puntos Personales": user.points ? parseFloat(user.points.toFixed(2)) : 0.00,
          "Puntos Grupales": user._total ? parseFloat(user._total.toFixed(2)) : 0.00,
          "Rango": this.$options.filters._rank(user.rank) || "Ninguno",
          "Bono Residual": user.residual_bonus ? parseFloat(user.residual_bonus.toFixed(2)) : 0.00
        });
      });

      // Crear el archivo Excel
      var ws = XLSX.utils.json_to_sheet(data_xls);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Cierres");
      XLSX.writeFile(wb, filename);
    },
  },
  mounted() {
    // this.fetchCloseds(); // Cargar los primeros datos al montar el componente
  },
};
</script>

<style>
.loading-container {
  position: fixed; /* Fija el contenedor de carga */
  top: 0;
  left: 0;
  width: 100%; /* Ocupa todo el ancho */
  height: 100%; /* Ocupa toda la altura */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8); /* Fondo blanco con opacidad */
  z-index: 999; /* Asegúrate de que esté por encima de otros elementos */
}

.spinner {
  border: 8px solid #f3f3f3; /* Color de fondo */
  border-top: 8px solid #3498db; /* Color del spinner */
  border-radius: 50%;
  width: 50px; /* Tamaño del spinner */
  height: 50px; /* Tamaño del spinner */
  animation: spin 1s linear infinite; /* Animación del spinner */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: red; /* Estilo para el mensaje de error */
  margin-top: 10px;
}

.list-container {
  height: 400px; /* Ajusta según sea necesario */
  overflow-y: auto;
}
</style>
