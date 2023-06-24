import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accounts: [{
      type:      'admin',
      email:     'CBM',
      password:  'CBM2023',
      id:        'admin',
      name:      'Administrador',
    },{
      type:      'office',
      email:     'central',
      password:  'impulse2023',
      id:        'central',
      name:      'Central',
    },{
      type:      'office',
      email:     '65750952',
      password:  'impulse2023',
      id:        'secondary',
      name:      'Ledezma',
    }],

    account: null,
  },
  mutations: {
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
  },
})
