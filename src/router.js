import Vue from 'vue'
import Router from 'vue-router'

import Login        from './views/Login.vue'
import Sucursal     from './views/Sucursal.vue'
import Logout       from './views/Logout.vue'
import Users        from './views/Users.vue'
import Affiliations from './views/Affiliations.vue'
import Collects     from './views/Collects.vue'
import OfficeCollects     from './views/OfficeCollects.vue'
import Activations  from './views/Activations.vue'
// import Promos       from './views/Promos.vue'
import Banner       from './views/Banner.vue'
import Tree         from './views/Tree.vue'
import Stock        from './views/Stock.vue'
import Offices      from './views/Offices.vue'
import Operations   from './views/Operations.vue'
import Pay          from './views/Pay.vue'
import Wallet       from './views/Wallet.vue'
import Products     from './views/Products.vue'
import Kadex        from './views/Kadex.vue'
import Closed       from './views/Closed.vue'

// import Reports      from './views/Reports.vue'

Vue.use(Router)

const routes = [
  {
    path: '*',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
    meta: { requiresNoAuth: true }
  },
  {
    path: '/sucursal',
    component: Sucursal,
    meta: { requiresNoAuth: true }
  },
  {
    path: '/logout',
    component: Logout
  },
  {
    path: '/users/:filter',
    component: Users,
    meta: { requiresAuth: true }
  },
  {
    path: '/affiliations/:filter',
    component: Affiliations,
    meta: { requiresAuth: true }
  },
  {
    path: '/collects/:filter',
    component: Collects,
    meta: { requiresAuth: true }
  },
  {
    path: '/office-collects/:filter',
    component: OfficeCollects,
    meta: { requiresAuth: true }
  },
  {
    path: '/activations/:filter',
    component: Activations,
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/promotions/:filter',
  //   path: '/promotions',
  //   component: Promos,
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/banner',
    component: Banner,
    meta: { requiresAuth: true }
  },
  {
    path: '/tree',
    component: Tree,
    meta: { requiresAuth: true }
  },
  {
    path: '/stock',
    component: Stock,
    meta: { requiresAuth: true }
  },
  {
    path: '/offices',
    component: Offices,
    meta: { requiresAuth: true }
  },

  {
    path: '/operations/:filter',
    component: Operations,
    meta: { requiresAuth: true }
  },
  {
    path: '/pay',
    component: Pay,
    meta: { requiresAuth: true }
  },
  {
    path: '/wallet',
    component: Wallet,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    component: Products,
    meta: { requiresAuth: true }
  },
  {
    path: '/kadex',
    component: Kadex,
    meta: { requiresAuth: true }
  },
  {
    path: '/closed',
    component: Closed,
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/reports',
  //   component: Reports,
  //   meta: { requiresAuth: true }
  // },
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {

  const requiresNoAuth = to.matched.some(record => record.meta.requiresNoAuth)
  const requiresAuth   = to.matched.some(record => record.meta.requiresAuth)

  const session = localStorage.getItem('session')

  if (requiresNoAuth &&  session) { next({ path: '/affiliations/all' }) }
  if (requiresAuth   && !session) { next({ path: '/login' }) }

  next()
})

export default router
