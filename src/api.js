import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_SERVER + '/api'


class API {
  constructor({ users, affiliations, Collects, OfficeCollects, activations, promos, promo, pay, Tree, offices, stock }) {
    this.users        = users
    this.affiliations = affiliations
    this.Collects     = Collects
    this.OfficeCollects = OfficeCollects
    this.activations  = activations
    this.promos       = promos
    this.promo        = promo
    this.pay          = pay
    this.Tree         = Tree
    this.offices      = offices
    this.stock        = stock
  }
}

class Users {
  GET({ filter }) {
    return axios.get (`/admin/users?filter=${filter}`)
  }
  POST({ action, id, data }) {
    return axios.post(`/admin/users`, { action, id, data })
  }
}

class Affiliations {
  GET({ filter, account }) {
    return axios.get (`/admin/affiliations?filter=${filter}&&account=${account}`)
  }
  POST({ action, id }) {
    return axios.post(`/admin/affiliations`, { action, id })
  }
}

class Collects {
  GET({ filter, account }) {
    return axios.get (`/admin/collects?filter=${filter}&&account=${account}`)
  }
  POST({ action, id }) {
    return axios.post(`/admin/collects`, { action, id })
  }
}

class OfficeCollects {
  GET({ filter, account }) {
    return axios.get (`/admin/office-collects?filter=${filter}&&account=${account}`)
  }
  POST({ action, id }) {
    return axios.post(`/admin/office-collects`, { action, id })
  }
}

class Activations {
  GET({ filter, account }) {
    return axios.get (`/admin/activations?filter=${filter}&&account=${account}`)
  }
  POST({ action, id }) {
    return axios.post(`/admin/activations`, { action, id })
  }
}

class Promos {
  GET() {
    return axios.get (`/admin/promos`)
  }
  POST({ id, img }) {
    return axios.post(`/admin/promos`, { id, img })
  }
}
class Promo {
  POST({ type, action, data }) {
    // console.log({ type, action, data })
    return axios.post(`/admin/promo`, { type, action, data })
  }
}

class Pay {
  POST({ dni, amount, desc }) {
    return axios.post(`/admin/pay`, { dni, amount, desc })
  }
}

class Tree {
  GET() {
    return axios.get (`/admin/tree`)
  }
}

class Stock {
  GET({ id }) {
    return axios.get (`/admin/stock?id=${id}`)
  }
  POST({ id, amount }) {
    return axios.post(`/admin/stock`, { id, amount })
  }
}

class Offices {
  GET() {
    return axios.get (`/admin/offices`)
  }
  POST({ id, products, office }) {
    return axios.post(`/admin/offices`, { id, products, office })
  }
}

export default new API({
  users:        new Users(),
  affiliations: new Affiliations(),
  Collects:     new Collects(),
  OfficeCollects: new OfficeCollects(),
  activations:  new Activations(),
  promos:       new Promos(),
  promo:        new Promo(),
  pay:          new Pay(),
  Tree:         new Tree(),
  offices:      new Offices(),
  stock:        new Stock(),
})
