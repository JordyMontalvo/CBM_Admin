<template>
  <Layout>
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando datos, por favor espera...</p>
    </div>

    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>Selecciona una fecha de cierre</strong>
          <select v-model="selectedDate" @change="updateTable">
            <option value="" disabled>Selecciona una fecha</option>
            <option v-for="date in closureDates" :key="date" :value="date">
              {{ date | date }}
            </option>
          </select>
        </div>
      </div>
      <br />
      <div class="container">
        <button class="button is-link" @click="closed">Iniciar Cierre</button>
        <br />
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
              <td>{{ user.points }}</td>
              <td>{{ user._total }}</td>
              <td>{{ user.rank | _rank }}</td>
              <td>{{ user.residual_bonus }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <p>No hay datos para la fecha seleccionada.</p>
        </div>
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
    return {
      loading: true,
      tree: [],
      affiliations: [],
      activations: [],
      closeds: [],
      selectedDate: "", // Fecha seleccionada
      selectedClosure: null, // Cierre seleccionado
      closureDates: [], // Lista de fechas de cierres
      saving: false,
      errorMessage: "", // Mensaje de error
    };
  },
  created() {
    const account = JSON.parse(localStorage.getItem("session"));
    this.$store.commit("SET_ACCOUNT", account);
    this.GET();
    this.updateTable = debounce(this.updateTable, 300); // 300 ms de retraso
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
    async GET() {
      this.loading = true;
      this.errorMessage = ""; // Reiniciar el mensaje de error
      try {
        const { data } = await api.closeds.GET();
        this.closeds = data.closeds.reverse();
        this.closureDates = [
          ...new Set(this.closeds.map((closed) => closed.date)),
        ]; // Obtener fechas únicas
      } catch (error) {
        console.error("Error al obtener los cierres:", error);
        this.errorMessage =
          "Hubo un problema al cargar los datos. Inténtalo de nuevo más tarde."; // Mensaje de error
      } finally {
        this.loading = false;
      }
    },
    updateTable() {
      // Filtrar el cierre seleccionado por la fecha
      this.selectedClosure = this.closeds.find(
        (closed) => closed.date === this.selectedDate
      );
    },
    async closed() {
      const { data } = await api.closeds.POST({ action: "new" });
      this.GET(); // Recargar los datos después de iniciar un nuevo cierre
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
  },
};
</script>

<style>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
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
  color: red;
  margin-top: 10px;
}
</style>
