import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accounts: [{
      type:      'admin',
      email:     'CBM',
      password:  'Adm1ncbm2$24',
      id:        'admin',
      name:      'Administrador',
    },
    // {
    //   type:      'office',
    //   email:     'central',
    //   password:  'cbm2023',
    //   id:        'central',
    //   name:      'Central',
    // },{
    //   type:      'office',
    //   email:     'secundaria',
    //   password:  'cbm2023',
    //   id:        'secondary',
    //   name:      'Secundaria',
    // }
    ],

    account: null,
  },
  mutations: {
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
  },
})
