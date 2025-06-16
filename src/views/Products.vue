<template>
  <Layout>
    <i class="load" v-if="loading"></i>

    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>Productos</strong>
        </div>
      </div>

      <div class="container">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <!-- <th>id</th> -->
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precios Compra</th>
                <th>Precios Afiliación</th>
                <th>Precios Descuento</th>
                <th>Valor a Comisionar</th>
                <th>Valor Descuento</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, i) in products">
                <th>{{ i + 1 }}</th>
                <!-- <td>{{ product.id }}</td> -->
                <td>
                  <span v-if="!product.edit">{{ product.name }}</span>

                  <input
                    class="input"
                    placeholder="Nombre"
                    style="max-width: 220px"
                    v-model="product._name"
                    v-if="product.edit"
                  />
                </td>
                <td>
                  <span v-if="!product.edit">{{ product.type }}</span>

                  <input
                    class="input"
                    placeholder="Categoría"
                    style="max-width: 220px"
                    v-model="product._type"
                    v-if="product.edit"
                  />
                </td>
                <td style="min-width: 250px">
                  <span v-if="!product.edit">{{ product.price }}</span>

                  <div v-if="product.edit">
                    PILOTO:
                    <input
                      class="input"
                      type="number"
                      style="max-width: 80px"
                      v-model.number="product._price[0]"
                    />
                    <br />
                    BÁSICO:
                    <input
                      class="input"
                      type="number"
                      style="max-width: 80px"
                      v-model.number="product._price[1]"
                    />
                    <br />
                    ESTÁNDAR:
                    <input
                      class="input"
                      type="number"
                      style="max-width: 80px"
                      v-model.number="product._price[2]"
                    />
                    <br />
                    PREMIUM:
                    <input
                      class="input"
                      type="number"
                      style="max-width: 80px"
                      v-model.number="product._price[3]"
                    />
                    <br />
                    ESTRELLA:
                    <input
                      class="input"
                      type="number"
                      style="max-width: 80px"
                      v-model.number="product._price[4]"
                    />
                  </div>
                </td>
                <td style="min-width: 250px">
                  <span v-if="!product.edit">{{ product.aff_price }}</span>

                  <div v-if="product.edit">
                    En Afiliación
                    <input type="checkbox" v-model="product.aff_price_check" />

                    <div v-if="product.aff_price_check">
                      PILOTO:
                      <input
                        class="input"
                        type="number"
                        style="max-width: 80px"
                        v-model.number="product._aff_price[0]"
                      />
                      <br />
                      BÁSICO:
                      <input
                        class="input"
                        type="number"
                        style="max-width: 80px"
                        v-model.number="product._aff_price[1]"
                      />
                      <br />
                      ESTÁNDAR:
                      <input
                        class="input"
                        type="number"
                        style="max-width: 80px"
                        v-model.number="product._aff_price[2]"
                      />
                      <br />
                      PREMIUM:
                      <input
                        class="input"
                        type="number"
                        style="max-width: 80px"
                        v-model.number="product._aff_price[3]"
                      />
                      <br />
                      ESTRELLA:
                      <input
                        class="input"
                        type="number"
                        style="max-width: 80px"
                        v-model.number="product._aff_price[4]"
                      />
                    </div>
                  </div>
                </td>
                <td style="min-width: 220px">
                  <span v-if="!product.edit">{{ product.desc_price }}</span>

                  <div v-if="product.edit">
                    Descuento
                    <input type="checkbox" v-model="product.desc_price_check" />

                    <div v-if="product.desc_price_check">
                      PILOTO:
                      <input
                        class="input"
                        type="number"
                        style="max-width: 80px"
                        v-model.number="product._desc_price[0]"
                      />
                      <br />
                      BÁSICO:
                      <input
                        class="input"
                        type="number"
                        style="max-width: 80px"
                        v-model.number="product._desc_price[1]"
                      />
                      <br />
                      ESTÁNDAR:
                      <input
                        class="input"
                        type="number"
                        style="max-width: 80px"
                        v-model.number="product._desc_price[2]"
                      />
                      <br />
                      PREMIUM:
                      <input
                        class="input"
                        type="number"
                        style="max-width: 80px"
                        v-model.number="product._desc_price[3]"
                      />
                      <br />
                      ESTRELLA:
                      <input
                        class="input"
                        type="number"
                        style="max-width: 80px"
                        v-model.number="product._desc_price[4]"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <span v-if="!product.edit">{{ product.val }}</span>

                  <div v-if="product.edit">
                    A comisionar
                    <input type="checkbox" v-model="product.val_check" />

                    <div v-if="product.val_check">
                      <input
                        class="input"
                        type="number"
                        style="max-width: 80px"
                        v-model.number="product._val"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <span v-if="!product.edit">{{ product.val_desc }}</span>

                  <div v-if="product.edit">
                    Descuento
                    <input type="checkbox" v-model="product.val_desc_check" />

                    <div v-if="product.val_desc_check">
                      <input
                        class="input"
                        type="number"
                        style="max-width: 80px"
                        v-model.number="product._val_desc"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <button @click="deleteProduct(product)">Eliminar</button>
                  <br /><br />
                  <i
                    class="fa-regular fa-pen-to-square"
                    style="color: #ccc; cursor: pointer; margin-right: 8px"
                    v-if="!product.edit"
                    @click="edit(product)"
                  ></i>
                  <i
                    class="fa-solid fa-check"
                    style="color: #ccc; cursor: pointer; margin-right: 8px"
                    v-if="product.edit"
                    @click="save(product)"
                  ></i>
                  <i
                    class="fa-solid fa-xmark"
                    style="color: #ccc; cursor: pointer; margin-right: 8px"
                    v-if="product.edit"
                    @click="cancel(product)"
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <br />

      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>Nuevo producto</strong>
        </div>
      </div>

      <div class="container">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <!-- <th>id</th> -->
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precios Compra</th>
                <th>Precios Afiliación</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>0</th>
                <td>
                  <input
                    class="input"
                    placeholder="Nombre"
                    style="max-width: 220px"
                    v-model="new_product.name"
                  />
                </td>
                <td>
                  <input
                    class="input"
                    placeholder="Categoría"
                    style="max-width: 220px"
                    v-model="new_product.type"
                  />
                </td>
                <td>
                  PILOTO:
                  <input
                    class="input"
                    type="number"
                    style="max-width: 80px"
                    v-model.number="new_product.price[0]"
                  />
                  <br />
                  BÁSICO:
                  <input
                    class="input"
                    type="number"
                    style="max-width: 80px"
                    v-model.number="new_product.price[1]"
                  />
                  <br />
                  ESTÁNDAR:
                  <input
                    class="input"
                    type="number"
                    style="max-width: 80px"
                    v-model.number="new_product.price[2]"
                  />
                  <br />
                  PREMIUM:
                  <input
                    class="input"
                    type="number"
                    style="max-width: 80px"
                    v-model.number="new_product.price[3]"
                  />
                  <br />
                  ESTRELLA:
                  <input
                    class="input"
                    type="number"
                    style="max-width: 80px"
                    v-model.number="new_product.price[4]"
                  />
                </td>
                <td>
                  En Afiliación
                  <input
                    type="checkbox"
                    v-model="new_product.aff_price_check"
                  />

                  <div v-if="new_product.aff_price_check">
                    PILOTO:
                    <input
                      class="input"
                      type="number"
                      style="max-width: 80px"
                      v-model.number="new_product.aff_price[0]"
                    />
                    <br />
                    BÁSICO:
                    <input
                      class="input"
                      type="number"
                      style="max-width: 80px"
                      v-model.number="new_product.aff_price[1]"
                    />
                    <br />
                    ESTÁNDAR:
                    <input
                      class="input"
                      type="number"
                      style="max-width: 80px"
                      v-model.number="new_product.aff_price[2]"
                    />
                    <br />
                    PREMIUM:
                    <input
                      class="input"
                      type="number"
                      style="max-width: 80px"
                      v-model.number="new_product.aff_price[3]"
                    />
                    <br />
                    ESTRELLA:
                    <input
                      class="input"
                      type="number"
                      style="max-width: 80px"
                      v-model.number="new_product.aff_price[4]"
                    />
                  </div>
                </td>
                <td>
                  <button class="button is-primary" @click="add">
                    Aprobar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
      new_product: {
        price: [],
        aff_price: [],
      },
    };
  },
  filters: {
    date(val) {
      return new Date(val).toLocaleDateString();
    },
  },
  created() {
    const account = JSON.parse(localStorage.getItem("session"));

    this.$store.commit("SET_ACCOUNT", account);

    this.GET();
  },

  methods: {
    async GET() {
      this.loading = true;

      // GET data
      const { data } = await api.products.GET();
      console.log({ data });

      this.loading = false;

      this.products = data.products;

      this.products = data.products.map((p) => ({
        ...p,
        sending: false,
        edit: false,
        _name: "",
        _type: "",
        _price: [0, 0, 0, 0, 0],

        _aff_price: [0, 0, 0, 0, 0],
        aff_price_check: p.aff_price ? true : false,

        _desc_price: [0, 0, 0, 0, 0],
        desc_price_check: p.desc_price ? true : false,

        _val: 0,
        val_check: p.val ? true : false,

        _val_desc: 0,
        val_desc_check: p.val_desc ? true : false,
      }));
    },

    edit(product) {
      /*; console.log('edit: ', product)*/
      product.edit = true;

      product._name = product.name;
      product._type = product.type;

      product._price[0] = product.price[0];
      product._price[1] = product.price[1];
      product._price[2] = product.price[2];
      product._price[3] = product.price[3];
      product._price[4] = product.price[4];

      if (product.aff_price_check) {
        product._aff_price[0] = product.aff_price[0];
        product._aff_price[1] = product.aff_price[1];
        product._aff_price[2] = product.aff_price[2];
        product._aff_price[3] = product.aff_price[3];
        product._aff_price[4] = product.aff_price[4];
      }

      if (product.desc_price_check) {
        product._desc_price[0] = product.desc_price[0];
        product._desc_price[1] = product.desc_price[1];
        product._desc_price[2] = product.desc_price[2];
        product._desc_price[3] = product.desc_price[3];
        product._desc_price[4] = product.desc_price[4];
      }

      if (product.val_check) {
        product._val = product.val;
      }

      if (product.val_desc_check) {
        product._val_desc = product.val_desc;
      }

      // if(!product._name)  product._name = product.name
      // if(!product._type)  product._type = product.type

      // if(!product._price[0]) product._price[0] = product.price[0]
      // if(!product._price[1]) product._price[1] = product.price[1]
      // if(!product._price[2]) product._price[2] = product.price[2]
      // if(!product._price[3]) product._price[3] = product.price[3]

      // if(product.aff_price_check) {
      //   if(!product._aff_price[0]) product._aff_price[0] = product.aff_price[0]
      //   if(!product._aff_price[1]) product._aff_price[1] = product.aff_price[1]
      //   if(!product._aff_price[2]) product._aff_price[2] = product.aff_price[2]
      //   if(!product._aff_price[3]) product._aff_price[3] = product.aff_price[3]
      // }

      // if(product.val_check) {
      //   if(!product._val) product._val = product.val
      // }
    },
    async save(product) {
      await api.products.POST({
        action: "edit",
        id: product.id,
        data: {
          _name: product._name,
          _type: product._type,
          _price: product._price,

          aff_price_check: product.aff_price_check,
          _aff_price: product._aff_price,

          desc_price_check: product.desc_price_check,
          _desc_price: product._desc_price,

          val_check: product.val_check,
          _val: product._val,

          val_desc_check: product.val_desc_check,
          _val_desc: product._val_desc,
        },
      });

      product.name = product._name;
      product.type = product._type;
      product.price = product._price;

      if (product.aff_price_check) product.aff_price = product._aff_price;
      else product.aff_price = null;

      if (product.desc_price_check) product.desc_price = product._desc_price;
      else product.desc_price = null;

      if (product.val_check) product.val = product._val;
      else product.val = null;

      if (product.val_desc_check) product.val_desc = product._val_desc;
      else product.val_desc = null;

      product.edit = false;
    },
    cancel(product) {
      product.edit = false;
    },

    async add() {
      /*; console.log('save ...')*/

      const { name, type, price, aff_price_check, aff_price } =
        this.new_product;
      // console.log({ name, type, price, aff_price_check, aff_price })

      await api.products.POST({
        action: "add",
        data: {
          name,
          type,
          price,
          aff_price_check,
          aff_price,
        },
      });

      location.reload();
    },
    deleteProduct(product) {
      if (confirm("¿Estás seguro que deseas eliminar el producto?")) {
        api.products.POST({
          action: "delete",
          id: product.id,
        });
        location.reload();
      }
    },
  },
};
</script>
