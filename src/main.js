import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './registerServiceWorker'

import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

import PouchDB from 'pouchdb-browser'
import PouchDBFind from 'pouchdb-find'

PouchDB.plugin(PouchDBFind);

/* eslint-disable no-unused-vars */
window.db = new PouchDB('vault');
window.remoteDB = null;
/* eslint-enable no-unused-vars */

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    /**
     * hide SplashScreen due to capacitor 
     */
    mounted() {
        SplashScreen.hide()
    },
    render: h => h(App),
}).$mount('#app')