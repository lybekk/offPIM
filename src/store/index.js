import Vue from 'vue'
import Vuex from 'vuex'

//import state from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
//import * as actions from './actions'

import notes from './modules/notes'
import tasks from './modules/tasks'
import logs from './modules/logs'
import messages from './modules/messages'
import finances from './modules/finances'
import inventory from './modules/inventory'
import themes from './modules/themes'
//import form from './form' /* not in use */


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: [],
    loaderActive: false,
    //database: 'vaulttest',
    //dbBasePath: 'http://localhost:5984/',
    //localDB: 'vault', // will replace the two above.
    //remoteDB: 'http://localhost:5984/vaulttest',
    remoteDBIsOnline: false,
    remoteDBSettings: {
      name: null, // I.E. 'http://localhost:5984/vault'
      auth: {
        username: false,
        password: false,
      }
    },
    remoteDBInfo: {},
    localDBInfo: {},
    //dbms: null, // CouchDB or PouchDB
    //isPouchDB: false,
    dbConnectionEstablished: false,
    dbConnectionDialog: false,
    errors: [],
    alerts: [],
    navItems: [],
    deleted: [],
    snackbar: {
      visible: false,
      text: null,
      timeout: 4000,
      multiline: false,
      color: ''
    },
    totals: {},
    tagList: []
  },
  actions,
  mutations,
  getters,
  modules: {
    notes,
    tasks,
    logs,
    messages,
    finances,
    inventory,
    themes
    //form
  }
})
