import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_SERVER + "/api";

// Deshabilitar caché para requests GET usando solo parámetros (sin headers que causen problemas CORS)
axios.interceptors.request.use((config) => {
  if (config.method === 'get' || config.method === 'GET') {
    // Agregar timestamp como parámetro para evitar caché (más seguro que headers)
    if (config.params) {
      config.params._t = Date.now();
    } else {
      config.params = { _t: Date.now() };
    }
  }
  return config;
});

class API {
  constructor({
    auth,
    users,
    affiliations,
    Collects,
    OfficeCollects,
    activations,
    products,
    kadex,
    closeds,
    promos,
    promo,
    pay,
    wallet,
    Tree,
    offices,
    stock,
    transactions,
    dashboard,
  }) {
    this.auth = auth;
    this.users = users;
    this.affiliations = affiliations;
    this.Collects = Collects;
    this.OfficeCollects = OfficeCollects;
    this.activations = activations;
    this.products = products;
    this.kadex = kadex;
    this.closeds = closeds;
    this.promos = promos;
    this.promo = promo;
    this.pay = pay;
    this.wallet = wallet;
    this.Tree = Tree;
    this.offices = offices;
    this.stock = stock;
    this.transactions = transactions;
    this.dashboard = dashboard;
  }
}

function authHeaders() {
  const sessionToken = localStorage.getItem("sessionToken");
  if (!sessionToken) return {};
  return { Authorization: `Bearer ${sessionToken}` };
}

class Auth {
  ADMIN_LOGIN({ username, password } = {}) {
    return axios.post(`/admin/auth/login`, { username, password });
  }

  ADMIN_LOGOUT() {
    return axios.post(`/admin/auth/logout`, {}, { headers: authHeaders() });
  }

  CHANGE_PASSWORD({ oldPassword, newPassword, revokeOthers = true } = {}) {
    return axios.post(
      `/admin/auth/change-password`,
      { oldPassword, newPassword, revokeOthers },
      { headers: authHeaders() }
    );
  }
}

class Users {
  GET({ filter, page = 1, limit = 10, search, showAvailable }) {
    // Añadir showAvailable como parámetro
    const searchParam = search ? `&search=${search}` : "";
    const availableParam = showAvailable
      ? `&showAvailable=${showAvailable}`
      : ""; // Añadir el parámetro showAvailable
    return axios.get(
      `/admin/users?filter=${filter}&page=${page}&limit=${limit}${searchParam}${availableParam}`
    ); // Incluir el nuevo parámetro en la URL
  }

  POST(payload) {
    // Aceptar cualquier payload y enviarlo completo al servidor
    return axios.post(`/admin/users`, payload);
  }
}

class Affiliations {
  GET({ filter, account, page = 1, limit = 100, search, startDate, endDate }) {
    const searchParam = search ? `&search=${search}` : "";
    const startDateParam = startDate ? `&startDate=${startDate}` : "";
    const endDateParam = endDate ? `&endDate=${endDate}` : "";
    return axios.get(
      `/admin/affiliations?filter=${filter}&account=${account}&page=${page}&limit=${limit}${searchParam}${startDateParam}${endDateParam}`
    );
  }
  POST({ action, id, points, voucher }) {
    return axios.post(`/admin/affiliations`, { action, id, points, voucher });
  }
}

class Collects {
  GET({ filter, account }) {
    return axios.get(`/admin/collects?filter=${filter}&&account=${account}`);
  }
  POST({ action, id }) {
    return axios.post(`/admin/collects`, { action, id });
  }
}

class OfficeCollects {
  GET({ filter, account }) {
    return axios.get(
      `/admin/office-collects?filter=${filter}&&account=${account}`
    );
  }
  POST({ action, id }) {
    return axios.post(`/admin/office-collects`, { action, id });
  }
}

class Activations {
  GET({ filter, account, page = 1, limit = 100, search, startDate, endDate }) {
    const searchParam = search ? `&search=${search}` : "";
    const startDateParam = startDate ? `&startDate=${startDate}` : "";
    const endDateParam = endDate ? `&endDate=${endDate}` : "";
    return axios.get(
      `/admin/activations?filter=${filter}&account=${account}&page=${page}&limit=${limit}${searchParam}${startDateParam}${endDateParam}`
    );
  }
  POST({ action, id, points, voucher }) {
    return axios.post(`/admin/activations`, { action, id, points, voucher });
  }
}

class Products {
  GET() {
    return axios.get(`/admin/products`);
  }
  POST({ action, id, data }) {
    return axios.post(`/admin/products`, { action, id, data });
  }
}

class Kadex {
  GET({
    pageProducts,
    limitProducts,
    pageRecharges,
    limitRecharges,
    pageAffiliations,
    limitAffiliations,
    pageActivations,
    limitActivations,
    page,
    limit,
  } = {}) {
    // Construir query string dinámicamente
    const params = [];
    if (pageProducts) params.push(`pageProducts=${pageProducts}`);
    if (limitProducts) params.push(`limitProducts=${limitProducts}`);
    if (pageRecharges) params.push(`pageRecharges=${pageRecharges}`);
    if (limitRecharges) params.push(`limitRecharges=${limitRecharges}`);
    if (pageAffiliations) params.push(`pageAffiliations=${pageAffiliations}`);
    if (limitAffiliations)
      params.push(`limitAffiliations=${limitAffiliations}`);
    if (pageActivations) params.push(`pageActivations=${pageActivations}`);
    if (limitActivations) params.push(`limitActivations=${limitActivations}`);
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);
    const query = params.length ? `?${params.join("&")}` : "";
    return axios.get(`/admin/kadex${query}`);
  }
  POST({ action, id, data }) {
    return axios.post(`/admin/kadex`, { action, id, data });
  }
}

class Closeds {
  GET({ page = 1, limit = 100 } = {}) {
    return axios.get(`/admin/closeds?page=${page}&limit=${limit}`);
  }
  GET_DATES() {
    return axios.get(`/admin/closeds/dates`);
  }
  GET_BY_ID(id) {
    return axios.get(`/admin/closeds?id=${id}`);
  }
  POST({ action, id, data }) {
    return axios.post(`/admin/closeds`, { action, id, data });
  }
}

class Promos {
  GET() {
    return axios.get(`/admin/promos`);
  }
  POST({ id, img, pos }) {
    return axios.post(`/admin/promos`, { id, img, pos });
  }
}
class Promo {
  POST({ type, action, data }) {
    // console.log({ type, action, data })
    return axios.post(`/admin/promo`, { type, action, data });
  }
}

class Pay {
  GET() {
    return axios.get(`/admin/pay`);
  }
  POST({ dni, amount, desc }) {
    return axios.post(`/admin/pay`, { dni, amount, desc });
  }
}

class Wallet {
  GET() {
    return axios.get(`/admin/wallet`);
  }
}

class Tree {
  GET({ id } = {}) {
    const idParam = id ? `?id=${id}` : "";
    return axios.get(`/admin/tree${idParam}`);
  }
  POST({ to, from }) {
    return axios.post(`/admin/tree`, { to, from });
  }
}

class Stock {
  GET({ id }) {
    return axios.get(`/admin/stock?id=${id}`);
  }
  POST({ id, amount }) {
    return axios.post(`/admin/stock`, { id, amount });
  }
}

class Offices {
  GET() {
    return axios.get(`/admin/offices`);
  }
  POST({ action, id, products, office, newOffice }) {
    return axios.post(`/admin/offices`, { action, id, products, office, newOffice });
  }
  CREATE(newOffice) {
    return axios.post(`/admin/offices`, { action: 'create', newOffice });
  }
  TOGGLE_ACTIVE(id) {
    return axios.post(`/admin/offices`, { action: 'toggleActive', id });
  }
}

class Transactions {
  GET({ page = 1, limit = 50, search = '', type = 'all', virtual = 'all', name = '', showDeleted = 'false' } = {}) {
    const searchParam = search ? `&search=${search}` : '';
    const typeParam = type ? `&type=${type}` : '';
    const virtualParam = virtual ? `&virtual=${virtual}` : '';
    const nameParam = name ? `&name=${name}` : '';
    const showDeletedParam = showDeleted ? `&showDeleted=${showDeleted}` : '';
    return axios.get(
      `/admin/transactions?page=${page}&limit=${limit}${searchParam}${typeParam}${virtualParam}${nameParam}${showDeletedParam}`
    );
  }
  POST({ action, id, deletedBy, restoredBy }) {
    return axios.post(`/admin/transactions`, { action, id, deletedBy, restoredBy });
  }
}

class Dashboard {
  GET() {
    return axios.get(`/admin/dashboard`);
  }
}

export default new API({
  auth: new Auth(),
  users: new Users(),
  affiliations: new Affiliations(),
  Collects: new Collects(),
  OfficeCollects: new OfficeCollects(),
  activations: new Activations(),
  products: new Products(),
  kadex: new Kadex(),
  closeds: new Closeds(),
  promos: new Promos(),
  promo: new Promo(),
  pay: new Pay(),
  wallet: new Wallet(),
  Tree: new Tree(),
  offices: new Offices(),
  stock: new Stock(),
  transactions: new Transactions(),
  dashboard: new Dashboard(),
});
