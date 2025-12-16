import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ToastPlugin from './utils/toast'
import ConfirmPlugin from './utils/confirm'

import "bulma-switch/dist/css/bulma-switch.min.css";

Vue.config.productionTip = false
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
