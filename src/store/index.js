import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

import notes from './modules/notes'
import tasks from './modules/tasks'
import logs from './modules/logs'
import messages from './modules/messages'
import finances from './modules/finances'
import inventory from './modules/inventory'
import themes from './modules/themes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: [],
    leftDrawer: false,
    loaderActive: false,
    remoteDBIsOnline: false,
    localSettings: {
      liveSync: false,
      retrySync: false,
    },
    remoteDBSettings: {
      name: null, // I.E. 'http://localhost:5984/vault'
      auth: {
        username: false,
        password: false,
      }
    },
    remoteDBInfo: {},
    localDBInfo: {},
    dbConnectionEstablished: false,
    dbConnectionDialog: false,
    dialogItemDetailed: false,
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
    tagList: [],

    // Raw Document/JSON viewer
    rawDocumentViewerDialog: false,
    rawDocumentViewerDocument: { _id: null },

    // Session logs
    sessionLogs: {
      debug: [],
      info: [],
      warn: [],
      error: [],
    },
    errors: [], // may be removed
    alerts: [], // may be removed

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
  }
})
