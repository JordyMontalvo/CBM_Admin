<template>
  <Layout>
    <i class="load" v-if="loading"></i>

    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>{{ title }}</strong
          >&nbsp;&nbsp;&nbsp;<a @click="download">Descargar Reporte</a>
          <input
            class="input"
            placeholder="Buscar por nombre"
            v-model="search"
            @input="input"
          />
        </div>
      </div>

      <div class="container">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <!-- <th>
                  <p style="display: flex">
                    Fecha <input class="input" style="margin-left: 6px;" placeholder="buscar" v-model="search" @input="input">
                  </p>
                </th> -->
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Oficina</th>
                <th>Products</th>
                <th>Precio Total</th>
                <th>Puntos</th>
                <th>Medio de Pago</th>
                <th>Voucher</th>
                <th>Saldo</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(activation, i) in activations"
                v-show="activation.visible"
              >
                <th>{{ totalItems - (currentPage - 1) * itemsPerPage - i }}</th>
                <td>{{ activation.date | date }}</td>
                <td>
                  {{ activation.name }} {{ activation.lastName }} <br />
                  <a>cédula: {{ activation.dni }}</a> <br />
                  tel: {{ activation.phone }}
                </td>
                <td>{{ activation.office }}</td>
                <td>
                  <!-- <div> -->
                  <!-- <table>
                      <tr v-for="product in activation.products" v-if="product.quantity != 0">
                        <td style="padding: 0">{{ product.name }}</td>
                        <td style="padding: 0">&nbsp; {{ product.quantity }}</td>
                      </tr>
                    </table> -->
                  <!-- <span style="width: 136px; display: inline-block;">{{ product.name }}</span> &nbsp;
                    <span>{{ product.quantity }}</span> -->
                  <!-- </div> -->

                  <div
                    v-for="product in activation.products"
                    v-if="product.total"
                  >
                    {{ product.total }} {{ product.name }}
                  </div>
                </td>
                <td>
                  $ {{ parseFloat(activation.price).toFixed(2) }} <br />
                  <a
                    :href="`${INVOICE_ROOT}?id=${activation.id}`"
                    target="_blank"
                    style="color: gray"
                    v-if="activation.status == 'approved'"
                    >boleta</a
                  >
                </td>
                <td>
                  {{ parseFloat(activation.points).toFixed(2) }}
                  <!-- <input v-model="activation.points" @change="change(activation)" style="width: 50px;"> -->
                </td>
                <td style="min-width: 200px">
                  <span v-if="activation.pay_method == 'cash'">Efectivo</span>
                  <div v-if="activation.pay_method == 'bank'">
                    <span>Banco</span> <br />
                    <small>Nombre: {{ activation.bank }}</small> <br />
                    <small>Fecha: {{ activation.voucher_date }}</small> <br />
                    <small>Núm: {{ activation.voucher_number }}</small>
                  </div>
                </td>
                <td>
                  <a :href="activation.voucher" target="_blank">
                    <img
                      :src="activation.voucher"
                      style="max-height: 80px; max-width: 80px"
                    />
                  </a>
                  <span v-if="!activation.editing">
                    <button @click="editVoucher(activation)">Editar</button>
                  </span>
                  <input
                    v-if="activation.editing"
                    v-model="activation.newVoucher"
                    placeholder="Nueva URL del voucher"
                  />
                  <button
                    v-if="activation.editing"
                    @click="saveVoucher(activation)"
                  >
                    Guardar
                  </button>
                </td>
                <td>
                  <div v-if="activation.amounts">
                    <small>no disponible: S/{{ activation.amounts[0] }}</small>
                    <br />
                    <small
                      >disponible: S/{{
                        Number(activation.amounts[1]).toFixed(2)
                      }}</small
                    >
                    <br />
                    <small
                      >cobrar: S/{{
                        Number(activation.amounts[2]).toFixed(2)
                      }}</small
                    >
                    <br />
                  </div>
                </td>
                <td>
                  <!-- <span class="has-text-success" v-if="activation.status == 'approved'">
                    {{ activation.status | status }}
                  </span> -->

                  <span
                    class="has-text-success"
                    v-if="activation.status == 'approved'"
                  >
                    {{ activation.status | status }}
                  </span>
                  <span
                    class="has-text-danger"
                    v-if="activation.status == 'rejected'"
                  >
                    {{ activation.status | status }}
                  </span>

                  <i class="load" v-if="activation.sending"></i>

                  <!-- <div class="buttons" v-if="activation.status == 'pending' && !activation.sending">
                    <button class="button is-primary" @click="approve(activation)">Confirmar</button>
                  </div> -->

                  <div
                    class="buttons"
                    v-if="activation.status == 'pending' && !activation.sending"
                  >
                    <button
                      class="button is-primary"
                      @click="approve(activation)"
                    >
                      Aprobar
                    </button>
                    <button
                      class="button is-danger"
                      @click="reject(activation)"
                    >
                      Rechazar
                    </button>
                  </div>

                  <br />
                  <label style="cursor: pointer">
                    <small style="color: gray">entregado: </small>

                    <i
                      class="fa-regular fa-square"
                      style="color: gray"
                      v-if="!activation.delivered"
                      @click="check(activation)"
                    ></i>

                    <i
                      class="fa-regular fa-square-check"
                      style="color: gray"
                      v-if="activation.delivered"
                      @click="uncheck(activation)"
                    ></i>
                  </label>
                </td>
                <td
                  v-if="activation.status == 'approved' && !activation.closed"
                >
                  <i
                    class="fa-solid fa-xmark"
                    style="color: #ccc; cursor: pointer; margin-right: 8px"
                    @click="revert(activation)"
                  ></i>
                </td>
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
          <span class="pagination-info"
            >Página {{ currentPage }} de {{ totalPages }}</span
          >
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
        <button
          v-if="showScrollToTop"
          @click="scrollToTop"
          class="scroll-to-top"
        >
          <i class="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from "@/views/Layout";
import api from "@/api";

const INVOICE_ROOT = process.env.VUE_APP_INVOICE_ROOT;
console.log({ INVOICE_ROOT });

export default {
  components: { Layout },
  data() {
    return {
      activations: [],
      loading: true,
      title: null,
      search: null,
      INVOICE_ROOT,
      currentPage: 1,
      itemsPerPage: 20,
      totalItems: 0,
      totalPages: 0,
      showScrollToTop: false,
      pageInput: 1,
    };
  },
  computed: {
    accounts() {
      return this.$store.state.accounts;
    },
    account() {
      return this.$store.state.account;
    },
  },
  filters: {
    status(val) {
      if (val == "approved") return "Aprobada";
      if (val == "pending") return "Pendiente";
      if (val == "rejected") return "Rechazada";
    },
    date(val) {
      return new Date(val).toLocaleDateString();
      // return new Date(val).toLocaleString()
    },
  },
  created() {
    const account = JSON.parse(localStorage.getItem("session"));

    this.$store.commit("SET_ACCOUNT", account);

    this.GET(this.$route.params.filter);
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    async GET(filter) {
      console.log(
        "Sending request with page:",
        this.currentPage,
        "Type:",
        typeof this.currentPage
      );
      const { data } = await api.activations.GET({
        filter,
        account: this.account.id,
        page: this.currentPage,
        limit: this.itemsPerPage,
        search: this.search || undefined,
      });

      this.loading = false;

      if (data.error && data.msg == "invalid filter") {
        this.$router.push("activations/all");
        return;
      }

      this.totalItems = data.total;
      this.totalPages = data.totalPages;
      this.activations = data.activations.map((i) => ({
        ...i,
        sending: false,
        visible: true,
        editing: false,
        newVoucher: "",
      }));

      this.activations.forEach((activation) => {
        const office = this.accounts.find((x) => x.id == activation.office);
        if (office) activation.office = office.name;
      });

      this.activations.sort((a, b) => new Date(b.date) - new Date(a.date));

      this.title =
        filter === "all" ? "Todas las Activaciones" : "Activaciones Pendientes";
    },
    async changePage(page) {
      console.log("Changing to page:", page, "Type:", typeof page);
      this.currentPage = page;
      await this.GET(this.$route.params.filter);
    },
    async nextPage() {
      await this.changePage(this.currentPage + 1);
    },
    async previousPage() {
      await this.changePage(this.currentPage - 1);
    },

    async approve(activation) {
      if (!confirm("Desea confirmar la activación?")) return;

      activation.sending = true;

      const { data } = await api.activations.POST({
        action: "approve",
        id: activation.id,
      });
      console.log({ data });

      activation.sending = false;

      // error
      if (data.error && data.msg == "already approved")
        return (activation.status = "approved");
      if (data.error && data.msg == "already rejected")
        return (affiliation.status = "rejected");

      // success
      activation.status = "approved";
    },
    async reject(activation) {
      if (!confirm("Desea rechazar la activación?")) return;

      activation.sending = true;

      const { data } = await api.activations.POST({
        action: "reject",
        id: activation.id,
      });
      console.log({ data });

      activation.sending = false;

      // error
      if (data.error && data.msg == "already approved")
        return (activation.status = "approved");
      if (data.error && data.msg == "already rejected")
        return (activation.status = "rejected");

      // success
      activation.status = "rejected";
    },
    input() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(async () => {
        this.currentPage = 1;
        await this.GET(this.$route.params.filter);
      }, 1500);
    },

    async check(activation) {
      if (
        !confirm("Seguro que desea marcar entregado? esto no se puede revertir")
      )
        return;
      // console.log('check', { activation })
      activation.delivered = true;

      const { data } = await api.activations.POST({
        action: "check",
        id: activation.id,
      });
    },
    async uncheck(activation) {
      if (affiliation.delivered) return;
      // console.log('uncheck', { activation })
      activation.delivered = false;

      const { data } = await api.activations.POST({
        action: "uncheck",
        id: activation.id,
      });
    },

    async revert(activation) {
      if (!confirm("Desea revertir la activación?")) return;

      console.log("revert ...");

      const { data } = await api.activations.POST({
        action: "revert",
        id: activation.id,
      });
      location.reload();
    },

    async changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        await this.GET(this.$route.params.filter);
      }
    },

    async nextPage() {
      await this.changePage(this.currentPage + 1);
    },

    async previousPage() {
      await this.changePage(this.currentPage - 1);
    },

    // async change(activation) {
    //   const { data } = await api.activations.POST({ action: 'change', id: activation.id,
    //                                                                   points: activation.points })
    // },

    download() {
      let filename = "Activaciones.xlsx";
      let data_xls = [];

      this.activations.forEach((a) => {
        let disponible = 0,
          no_disponible = 0;

        if (a.amounts) {
          no_disponible = a.amounts[0];
          disponible = a.amounts[1];
        }

        let cash = disponible + no_disponible;

        let pay = 0;

        if (a.amounts) {
          pay = a.amounts[2];
        } else {
          pay = a.price;
        }

        let efectivo = 0,
          banco = 0;

        if (!a.pay_method) efectivo = pay;
        if (a.pay_method == "cash") efectivo = pay;
        if (a.pay_method == "bank") banco = pay;

        for (let p of a.products) {
          if (p.total) {
            data_xls.push({
              ID: a.id,

              "USUARIO (NO. DE CÉDULA)": a.dni,
              "NOMBRES COMPLETOS": a.name + " " + a.lastName,
              "FECHA DE ACTIVACIÓN": new Date(a.date).toLocaleDateString(),

              // 'PLAN': a.plan.name,
              "VALOR DE LA COMPRA": a.price,

              KASH: cash,
              "SALDO DISPONIBLE DE CASH": disponible,
              "SALDO NO DISPONIBLE DE CASH": no_disponible,

              EFECTIVO: efectivo,
              BANCO: banco,
              "NOMBRE BANCO": a.bank,
              "FECHA VOUCHER ": a.voucher_date
                ? new Date(a.voucher_date).toLocaleDateString()
                : "",
              "NUMERO DE VOUCHER ": a.voucher_number,
              VOUCHER: a.voucher,

              "TOTAL APORTE": cash + pay,

              PRODUCTO: p.name,
              PRECIO: p.price,
              // 'POINTS': p.points,

              ESTATUS: a.status,
              OFICINA: a.office,
              "ENTRAGA DE PRODUCTOS": a.delivered ? "Entregado" : "Pendiente",
            });
          }
        }
      });

      var ws = XLSX.utils.json_to_sheet(data_xls);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Activaciones");
      XLSX.writeFile(wb, filename);
    },

    editVoucher(activation) {
      console.log("Editando voucher para:", activation);
      activation.editing = true;
      activation.newVoucher = activation.voucher; // Prellenar el input con la URL actual
    },

    async saveVoucher(activation) {
      if (!activation.newVoucher) return; // Validar que haya una nueva URL

      const { data } = await api.activations.POST({
        action: "updateVoucher",
        id: activation.id,
        voucher: activation.newVoucher,
      });

      if (!data.error) {
        activation.voucher = activation.newVoucher; // Actualizar la URL en la vista
        activation.editing = false; // Cerrar el input
      } else {
        alert("Error al actualizar el voucher");
      }
    },
    handleScroll() {
      this.showScrollToTop = window.scrollY >= document.body.offsetHeight / 2;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    async goToPage() {
      const page = Math.max(1, Math.min(this.pageInput, this.totalPages)); // Asegurarse de que la página esté dentro del rango
      this.currentPage = page;
      await this.GET(this.$route.params.filter);
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
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.pagination-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.pagination-info {
  margin: 0 10px;
  font-weight: bold;
}

.pagination-input {
  width: 50px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 0 5px;
  text-align: center;
}
</style>
