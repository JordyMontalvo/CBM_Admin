<template>
  <Layout>
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando datos, por favor espera...</p>
    </div>

    <div class="container" v-else>
      <button class="button is-link" @click="closed2">Iniciar Cierre</button>
      <br /><br />

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

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
          <tr v-for="(node, i) in filteredTree" :key="node.id">
            <th>{{ i + 1 }}</th>
            <td>{{ node.name }}</td>
            <td>{{ node.points }}</td>
            <td>{{ node._total }}</td>
            <td>{{ node.rank | _rank }}</td>
            <td>{{ node.residual_bonus }}</td>
          </tr>
        </tbody>
      </table>

      <div class="summary">
        Activos simple: {{ tree.filter((e) => e._activated).length }} <br />
        Activos full: {{ tree.filter((e) => e.activated).length }} <br /><br />
        Afiliaciones: {{ affiliations.length }} <br />
        Compras: {{ activations.length }} <br />
      </div>

      <button v-if="!saving" class="button" @click="save">Guardar</button>
      <button v-if="saving" class="button">Guardando ...</button>
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
    return {
      loading: true,
      tree: [],
      affiliations: [],
      activations: [],
      closeds: [],
      closureDates: [],
      errorMessage: "",
      saving: false,
      selectedDate: "",
      selectedClosure: null,
    };
  },
  created() {
    const account = JSON.parse(localStorage.getItem("session"));
    this.$store.commit("SET_ACCOUNT", account);
    this.GET();
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
      this.errorMessage = "";
      try {
        const { data } = await api.closeds.GET();
        this.closeds = data.closeds.reverse();
        this.closureDates = [
          ...new Set(this.closeds.map((closed) => closed.date)),
        ];
      } catch (error) {
        console.error("Error al obtener los cierres:", error);
        this.errorMessage =
          "Hubo un problema al cargar los datos. Inténtalo de nuevo más tarde.";
      } finally {
        this.loading = false;
      }
    },
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
  },
};
</script>

<style>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Ocupa toda la altura de la vista */
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
</style>
