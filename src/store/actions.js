export default {
  setTotals: async function (context) {
    const response = await window.db.query('pimpim/totals', {
      group: true
    })
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
      console.log('Doc delete result: ', response); // TODO - send to log
    } catch (error) {
      context.commit('addAlert', {type:'error',text: 'Deleting document failed: ' + error})
      result = error
    }
    return await result;
  },

  insertDocument: async function (state, payload) {
    let txt;
    let pDoc = payload.doc;

    try {
      if (!pDoc._id) { // Consider handing off _id(uuid)generation to PouchDB
        const errtxt = "_id missing in request. Insert unsuccessful";
        throw errtxt
      }

      if (pDoc._rev) {
        var eDoc = await window.db.get(pDoc._id);
        pDoc._rev = eDoc._rev
      }

      var response = await window.db.put(pDoc);
      if (response.ok) {
        if (payload.snackbarText) {
          txt = payload.snackbarText
        } else {
          txt = 'Document update OK'
        }
        this.commit('showSnackbar', { text:txt, color:'success' })
      } else {
        const errtxt = 'Document update failed' + response;
        throw errtxt
        //this.commit('addAlert', {type:'error',text:'Document update failed' + response })
      }
      return await response;
    } catch (error) {
      this.commit('addAlert', {type:'error',text:error})
    }
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





  startupIndexCheck: async function (context, payload) {
    const localVersion = payload.version;
    const dbDoc = await window.db.get(`_design/${payload.doc}`); // databaseDesignDoc
    if (localVersion > dbDoc.version) {
      console.log('Design document version in app is higher than the one in the database. Redirecting to setup');
      return false
    }
    return true

  },

  startupIndexCheck_OLD: async function (context, payload) {
    const dDoc = payload;
    const docs = {
      pimpimMain: ["indexes/pimpim_design_doc.json","pimpim"],
      mango: ["indexes/mango_indexes.json","pimpim_mango_indexes"]
    };  
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

  },

  remoteDBConnectivityCheck: async function (context) {
    try {
      const response = await window.remoteDB.info();
      if (response.db_name) {
        context.commit('setGenericStateBooleanTrue', 'remoteDBIsOnline');
        this.commit('showSnackbar', { text:'Remote database connection successful', color:'success' });
        context.dispatch('remoteDBInfo');
        return true
      }
    } catch(error) {
      // TODO Send to log (requires logging feature)
      // TODO Advise troubleshooting steps (network/curl, CORS )
      this.commit('showSnackbar', { text:'Remote database connection unsuccessful', color:'error', log: error });
      context.commit('setGenericStateBooleanFalse', 'remoteDBIsOnline');
      return false
    }
  },

  remoteDBInfo: async function (context) {
    const result = await window.remoteDB.info();
    context.commit('remoteDBInfo', result)
  },

  localDBInfo: async function (context) {
    const result = await window.db.info();
    context.commit('localDBInfo', result)
  },

}