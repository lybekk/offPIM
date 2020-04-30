import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './registerServiceWorker'


import PouchDB from 'pouchdb-browser'

PouchDB.plugin(require('pouchdb-find'));

/* eslint-disable no-unused-vars */
window.db = new PouchDB('vault');
window.remoteDB = null;
/* eslint-enable no-unused-vars */

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
