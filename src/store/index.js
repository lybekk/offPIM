import Vue from 'vue'
import Vuex from 'vuex'
import notes from './notes'
import tasks from './tasks'
import logs from './logs'
import messages from './messages'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loaderActive: false,
    database: null, //default. Set value in settings.json
    dbBasePath: null, //default. Set value in settings.json
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
  mutations: {
    setTagList (state, payload) {
      state.tagList = payload.rows
    },
    setTotals (state, payload) {
      let s = state;
      let a = payload.rows;
      a.forEach(el => {
        s.totals[el.key] = el.value;
      });
    },
    setSettings (state, payload) {
      state.database = payload.database;
      state.dbBasePath = payload.dbBasePath;
    },
    showSnackbar(state, payload) {
      state.snackbar.text = payload.text
      state.snackbar.multiline = (payload.text.length > 50) ? true : false
      
      if (payload.multiline) {
        state.snackbar.multiline = payload.multiline
      }
      
      if (payload.color) {
        state.snackbar.color = payload.color
      } else {
        state.snackbar.color = ''
      }

      if (payload.timeout) {
        state.snackbar.timeout = payload.timeout
      }

      state.snackbar.visible = true
    },
    closeSnackbar(state) {
      state.snackbar.visible = false
      state.snackbar.multiline = false
      state.snackbar.timeout = 4000
      state.snackbar.text = null
    },
    addError (state, error) {
      state.errors.push(error)
    },
    toggleLoader (state) {
      state.loaderActive = !state.loaderActive;
    },
    loaderInactive (state) {
      state.loaderActive = false;
    },
    loaderActive (state) {
      state.loaderActive = true;
    },
    addAlert (state, payload) {
      let p = payload;
      let alert = {
        type:p.type, 
        text:p.text, 
        alert:true
      };
      state.alerts.push(alert)
    },
    deleteAlert (state, payload) {
      state.alerts.splice(payload, 1)
    },
    addDeleted (state, docId) {
      state.deleted.push(docId);
    },
  },
  actions: {
    setTotals: async function (context) {
      let url = context.getters.urlDB;
      const response = await fetch(url + '_design/pimpim/_view/totals?group=true');
      context.commit('setTotals', await response.json())
    },
    addError (context) {
      context.commit('addError')
    },
    deleteDocument: async function (context, docId) {
      let u = this.getters.urlDB;
      const response = await fetch( u + docId);
      const doc = await response.json();
      let result;

      try {
          let url = u + docId + '?rev=' + doc._rev;
          const data = await delete_request(url);
          result = JSON.stringify(data);
          console.log('Doc delete result: ', result);
          this.commit('addDeleted', docId)
          this.commit('showSnackbar', { text:'Document deleted', color:'error' })
      } catch (error) {
          result = error;
      }

      async function delete_request(url = "") {
          const response = await fetch(url, {
              method: "DELETE",
              headers: {
              "Content-Type": "application/json"
              }
          });
          return await response.json();
      }
  
      return await result;
    },
    insertDocument: async function (state, payload) {
      let url = state.getters.urlDB;
      let txt;

      try {
        if (!payload.doc.realm) {throw "Document missing in request. Insert unsuccessful"}

        if (!payload.doc._id) {
          throw "_id missing in request. Insert unsuccessful"          
        }
        if (payload.doc._rev) {
          const getRevDoc = await fetch(url + payload.doc._id);
          const revDoc = await getRevDoc.json();
          payload.doc._rev = revDoc._rev;
        }
        const response = await fetch(url + payload.doc._id, {
          method: "PUT",
          body: JSON.stringify(payload.doc),
          headers: {
          "Content-Type": "application/json"
          }
        });
        const result = await response.json();
        if (result.ok) {
          /* Consider using global snackbar for result.ok instead. Less invasive */
          if (payload.snackbarText) {
            txt = payload.snackbarText
          } else {
            txt = 'Document update OK'
          }
          this.commit('showSnackbar', { text:txt, color:'success' })
        } else {
          this.commit('addAlert', {type:'error',text:'Document update failed' + result })
        }
        return await result;
      } catch (error) {
        this.commit('addAlert', {type:'error',text:error})
      }
    },
    postData: async function (state, payload) {
      const response = await fetch(payload.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload.data)
      });
      return await response.json(); 
    }
  },
  getters: {
    urlMango: state => {
      let u = state.dbBasePath + state.database + '/_find' ;
      return u
    },
    urlDB: state => {
      let u = state.dbBasePath + state.database + '/' ;
      return u
    },
    urlDBRoot: state => {
      let u = state.dbBasePath ;
      return u
    },
    dbName: state => {
      let u = state.database ;
      return u
    },
    getAlerts: state => {
      return state.alerts
    },
    getDeletedDocuments: state => {
        return state.deleted
    },
    isDeleted: (state) => (id) => {
      return state.deleted.includes(id)
    },
    loaderState: state => {
      return state.loaderActive
    },
    getTotals: state => {
      return state.totals
    },
    getTagList: state => {
      return state.tagList
    }
  },
  modules: {
    notes,
    tasks,
    logs,
    messages
  }
})
