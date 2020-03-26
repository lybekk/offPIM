export default {
  setTotals: async function (context) {
    //let url = context.getters.urlDB;
    const response = await window.db.query('pimpim/totals', {
      group: true
    })
    console.log(response)
    //const response = await fetch(url + '_design/pimpim/_view/totals?group=true');
    //context.commit('setTotals', await response.json())
    context.commit('setTotals', response)
  },
  addError (context) {
    context.commit('addError')
  },
  deleteDocument: async function (context, docId) {
    let result;
    try {
      var doc = await window.db.get(docId);
      var response = await window.db.remove(doc);
      this.commit('addDeleted', docId)
      this.commit('showSnackbar', { text:'Document deleted', color:'error' })
      console.log('Doc delete result: ', response);
    } catch (error) {
      context.commit('addAlert', {type:'error',text:error})
      result = error
    }
    return await result;
    /*
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
    */

    /*
    async function delete_request(url = "") {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      return await response.json();
    }
    */

    //return await result;
  },

  insertDocument: async function (state, payload) {
    //let url = state.getters.urlDB; // old code for CouchDB
    let txt;
    let pDoc = payload.doc;

    try {
      //if (!pDoc.realm) {throw "Document missing in request. Insert unsuccessful"}
      if (!pDoc._id) { // Consider handing off _id(uuid)generation to PouchDB
        const errtxt = "_id missing in request. Insert unsuccessful";
        this.commit('addAlert', {type:'error',text: errtxt })
        throw errtxt
      }

      if (pDoc._rev) {
        //const getRevDoc = await fetch(url + payload.doc._id);
        //const revDoc = await getRevDoc.json();
        //payload.doc._rev = revDoc._rev;
        var eDoc = await window.db.get(pDoc._id);
        pDoc._rev = eDoc._rev
      }

      var response = await window.db.put(pDoc);
      if (response.ok) {
        // Consider using global snackbar for response.ok instead. Less invasive
        if (payload.snackbarText) {
          txt = payload.snackbarText
        } else {
          txt = 'Document update OK'
        }
        this.commit('showSnackbar', { text:txt, color:'success' })
      } else {
        this.commit('addAlert', {type:'error',text:'Document update failed' + response })
      }
      return await response;
    } catch (error) {
      this.commit('addAlert', {type:'error',text:error})
    }
    /* Old code for CouchDB-only
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
        // Consider using global snackbar for result.ok instead. Less invasive
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
    */
  },

  postData: async function (state, payload) {
    this.commit('loaderActive')
    const response = await fetch(payload.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload.data)
    });
    let data = await response.json();
    this.commit('loaderInactive')
    return data; 
  },

  //startup: async function (context, payload) {
  //startup_deprecated: async function (context) { // not in use. moved to App.vue
    //console.log( localStorage.getItem('dbChoice') )
    //let dbChoice = payload //localtorage (dbChoice)
    //let dbChoice = localStorage.getItem('dbChoice') //localtorage (dbChoice)
    //state.database = payload.database;
    //state.dbBasePath = payload.dbBasePath;
    // old //this.$store.commit('setSettings', window.pimpimSettings);
    /*
      this.$store.commit('setSettings', {
        database: 'vault',
        dbBasePath: sd
      });
    */
    /*
    if (dbChoice == 'CouchDB') {
      //  fetch
      //  await response?
      //  if failed, no connection etc setDialogTrue (dialog to enter url to database and database name(prefilled))
      //    dialog should save to localStorage
      //    set dbConnectionEstablished to true
      try {
        const urlDB = context.getters.urlDB;
        const response = await fetch(urlDB);
        //const databaseDesignDoc = await response.json();
        //response.status
        if ( response.status == 200) {
          console.log('Connection established')
          //context.state.dbConnectionEstablished = true
          context.commit('setGenericStateBooleanTrue', 'dbConnectionEstablished')
        }
      } catch {
        console.log('Connection failed')
        context.commit('setGenericStateBooleanTrue', 'dbConnectionDialog')
      }
    } else if (dbChoice == 'PouchDB') {
      console.log('PouchDB selected')
    }
    */

    //if ( context.state.dbConnectionEstablished ) {
      // must rewrite for pouchdb
      /*
      await context.dispatch( 'startupIndexCheck', { doc: 'pimpim', version: window.pimpim.pimpimDesignDoc.version } )
      await context.dispatch( 'startupIndexCheck', { doc: 'pimpim_mango_indexes', version: window.pimpim.mangoIndexes.version } )

      context.dispatch('setTotals')
  
      //context.dispatch( 'startupIndexCheck', 'pimpimMain' )
      //context.dispatch( 'startupIndexCheck', 'mango' )
  
      context.dispatch('setMessagesUnreadCount');
      context.dispatch('checkThemeSettings'); //store/themes.js
      */
    //}
  //},

  startupIndexCheck: async function (context, payload) {
    const localVersion = payload.version;
    const dbDoc = await window.db.get(`_design/${payload.doc}`); // databaseDesignDoc
    console.log(dbDoc.version)
    //const getServerDesignDoc = await fetch( docs[dDoc][0] );
    //const serverDesignDoc = await getServerDesignDoc.json();

    //const urlDB = context.getters.urlDB;

    //const getDatabaseDesignDoc = await fetch(urlDB + '_design/' + docs[dDoc][1]);
    //const databaseDesignDoc = await getDatabaseDesignDoc.json();
    if (localVersion > dbDoc.version) {
      console.log('Design document version in app is higher than the one in the database. Redirecting to setup');
      return false
      //this._vm.$router.push('setup')
      //if(this.$route.matched[0].name != 'setup') {
      //  this.$router.push('setup')
      //}
    }
    return true

  },

  startupIndexCheck_OLD: async function (context, payload) {
    const dDoc = payload
    //indexCheck: async function(dDoc) {
      //let serverDesignDoc
      //let databaseDesignDoc
    const docs = {
      pimpimMain: ["indexes/pimpim_design_doc.json","pimpim"],
      mango: ["indexes/mango_indexes.json","pimpim_mango_indexes"]
    };
  
      /*
      // Checks if app running inside Electron
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf(' electron/') > -1) {
        // Electron-specific code
  
        //const electron = require('electron')
        //console.log(electron)
        //win.loadURL(`file://${__dirname}/app/index.html`)
  
        //const root = fs.readdirSync('./')
        //const root = fs.readdirSync(__dirname)
  
        //const fs = require('fs')
        //const root = fs.readdirSync(__dirname)
        //console.log(root)
  
        const getServerDesignDoc = await fetch( docs[dDoc][0] );
        //const serverDesignDoc = await getServerDesignDoc.json();
        serverDesignDoc = await getServerDesignDoc.json();
  
        const urlDB = this.$store.getters.urlDB;
  
        const getDatabaseDesignDoc = await fetch(urlDB + '_design/' + docs[dDoc][1]);
        //const databaseDesignDoc = await getDatabaseDesignDoc.json();
        databaseDesignDoc = await getDatabaseDesignDoc.json();
        console.log(serverDesignDoc)
  
      } else {
        const getServerDesignDoc = await fetch( docs[dDoc][0] );
        //const serverDesignDoc = await getServerDesignDoc.json();
        serverDesignDoc = await getServerDesignDoc.json();
  
        const urlDB = this.$store.getters.urlDB;
  
        const getDatabaseDesignDoc = await fetch(urlDB + '_design/' + docs[dDoc][1]);
        //const databaseDesignDoc = await getDatabaseDesignDoc.json();
        databaseDesignDoc = await getDatabaseDesignDoc.json();
      }
      */
        //const getServerDesignDoc = await fetch( docs[dDoc][0] );
        const getServerDesignDoc = await fetch( docs[dDoc][0] );
        const serverDesignDoc = await getServerDesignDoc.json();

        const urlDB = context.getters.urlDB;
  
        const getDatabaseDesignDoc = await fetch(urlDB + '_design/' + docs[dDoc][1]);
        const databaseDesignDoc = await getDatabaseDesignDoc.json();
  
      if (serverDesignDoc.version > databaseDesignDoc.version) {
        console.log('PIMPIM Server design document version is higher than the one in the database. Redirecting to setup');
        if(this.$route.matched[0].name != 'setup') {
          this.$router.push('setup')
        }
      }
    //}
  },

  /*
  createRemoteDB: function (context, payload) {
    //const x = context.getters.remoteDBInfo;
    //const options = null;
    // get remotedb url/name
    // if x, then
    //window.remoteDB = new PouchDB(options) // options received from Vuex 
    window.remoteDB = new window.PouchDB(payload) // options received
  },
  */

  remoteDBConnectivityCheck: async function (context) {
    const response = await window.remoteDB.info();
    if (response.db_name) {
      context.commit('setGenericStateBooleanTrue', 'remoteDBIsOnline');
      //return true
    }
    //else {
    //  return false
    //}
    return ( response.db_name ? true : false )
  },

  remoteDBInfo: async function (context) {
    const result = await window.remoteDB.info();
    context.commit('remoteDBInfo', result)
  },

  localDBInfo: async function (context) {
    const result = await window.db.info();
    context.commit('localDBInfo', result)
  },
/*
    addTodo ({ commit }, text) {
      commit('addTodo', {
        text,
        done: false
      })
    },
  
    removeTodo ({ commit }, todo) {
      commit('removeTodo', todo)
    },
  
    toggleTodo ({ commit }, todo) {
      commit('editTodo', { todo, done: !todo.done })
    },
  
    editTodo ({ commit }, { todo, value }) {
      commit('editTodo', { todo, text: value })
    },
  
    toggleAll ({ state, commit }, done) {
      state.todos.forEach((todo) => {
        commit('editTodo', { todo, done })
      })
    },
  
    clearCompleted ({ state, commit }) {
      state.todos.filter(todo => todo.done)
        .forEach(todo => {
          commit('removeTodo', todo)
        })
    }
*/
}