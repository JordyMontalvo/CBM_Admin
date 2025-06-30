<template>
  <Layout>
    <i class="load" v-if="loading"></i>

    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>Inventario</strong>
        </div>
      </div>

      <div class="container">
        <br />
        <div class="select">
          <select v-model="product" @change="change">
            <option v-for="p in products" :value="p">{{ p.name }}</option>
          </select>
        </div>
        &nbsp;&nbsp;&nbsp;<a @click="download">Descargar Reporte</a>
        <br />
        <br />
        <!-- Tabla principal única -->
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>FECHA</th>
                <th>CODIGO</th>
                <th style="width: 320px">PRODUCTO</th>
                <th>MOTIVO</th>
                <th>INGRESO CANTIDAD</th>
                <th>EGRESO CANTIDAD</th>
                <th>PRECIO UNITARIO</th>
                <th>TOTAL</th>
                <th>SALDO UNIDADES</th>
                <th>SUCURSAL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, i) in table" :key="i">
                <td>{{ field.date | date }}</td>
                <td>{{ field.id }}</td>
                <td>{{ field.name }}</td>
                <td>{{ field.reason }}</td>
                <td>{{ field.total_in }}</td>
                <td>{{ field.total_out }}</td>
                <td>{{ field.price }}</td>
                <td>{{ field.total_price }}</td>
                <td>{{ field.balance }}</td>
                <td>{{ field.office }}</td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top: 1em; display: flex; gap: 1em">
            <button @click="prevPage" :disabled="page === 1">Anterior</button>
            <span>Página {{ page }} de {{ totalPages }}</span>
            <button @click="nextPage" :disabled="page === totalPages">
              Siguiente
            </button>
          </div>
        </div>
      </div>
      <br />
    </section>
  </Layout>
</template>

<script>
import Layout from "@/views/Layout";
import api from "@/api";
import lib from "@/lib";

export default {
  components: { Layout },
  data() {
    return {
      loading: false,
      products: [],
      product: null,
      table: [],
      total: 0,
      page: 1,
      limit: 20,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.limit);
    },
  },

  filters: {
    date(val) {
      return new Date(val).toLocaleDateString();
    },
  },

  async created() {
    const account = JSON.parse(localStorage.getItem("session"));
    this.$store.commit("SET_ACCOUNT", account);
    await this.GET();
  },

  methods: {
    async GET() {
      this.loading = true;
      const { data } = await api.kadex.GET({
        productId: this.product ? this.product.id : undefined,
        page: this.page,
        limit: this.limit,
      });
      this.loading = false;
      this.products = data.products;
      this.table = data.table;
      this.total = data.total;
      if (!this.product && this.products.length) {
        this.product =
          this.products.find((p) => p.id === data.productId) ||
          this.products[0];
      }
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.GET();
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.GET();
      }
    },
    change() {
      this.page = 1;
      this.GET();
    },
    download() {
      let filename = `Inventario-${this.product.name}.xlsx`;
      let data_xls = [];

      this.table.forEach((t) => {
        data_xls.push({
          FECHA: new Date(t.date).toLocaleDateString(),
          CODIGO: t.id,
          PRODUCTO: t.name,
          MOTIVO: t.reason,
          "INGRESO CANTIDAD": t.total_in,
          "EGRESO CANTIDAD": t.total_out,
          "PRECIO UNITARIO": t.price,
          TOTAL: t.total_price,
          "SALDO UNIDADES": t.balance,
          SUCURSAL: t.office,
        });
      });

      var ws = XLSX.utils.json_to_sheet(data_xls);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inventario");
      XLSX.writeFile(wb, filename);
    },
  },
};
</script>
