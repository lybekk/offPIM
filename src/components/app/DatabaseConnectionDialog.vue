<template lang="pug">

  v-row(justify="center")
    v-dialog(
      v-model="dialog" 
      max-width="25vw"
      overlay-opacity="0.9"
      overlay-color="secondary"
      scrollable
      :fullscreen="$vuetify.breakpoint.mdAndDown"
      transition="dialog-bottom-transition"
    )
      v-card
        v-card-title Remote database settings
        v-card-text
          v-expansion-panels(:value="2")
            v-expansion-panel
              v-expansion-panel-header Info
              v-expansion-panel-content
                ul
                  li Use full url, with http or https, including database name (I.E. <code class="secondary info--text">http://localhost:5984/vault</code>), to a 
                    | CouchDB compatible database server to enable synchronization. 
                    | Credentials may be included in url: <code class="secondary info--text">http://username:password@localhost:5984/vault</code> (less secure)
                  li If username:password not in url, provide credentials in form
                  li Note: User/admin must have permission to upload design documents
                  li Leave username blank if credentials are in the url
            v-expansion-panel
              v-expansion-panel-header Actions
              v-expansion-panel-content
                v-list
                  database-compaction(whatdb="remoteDB")
            v-expansion-panel
              v-expansion-panel-header Authentication
              v-expansion-panel-content
                v-card
                  v-card-text
                    v-row
                      v-col(cols="12")
                        v-text-field(
                            v-model="remoteDBUrl"
                            :color="getColor"
                            label="Remote database URL"
                            class="text-capitalize"
                            outlined
                            shaped
                        )
                      v-col(cols="12" sm="6")
                        v-text-field(
                          v-model="username"
                          label="Username"
                          outlined
                          shaped
                        )
                      v-col(cols="12" sm="6")
                        v-text-field(
                          v-model="password"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show1 ? 'text' : 'password'"
                          name="pwd"
                          label="Password"
                          outlined
                          shaped
                          @click:append="show1 = !show1"
                        )
                      v-col(cols="12")
                        v-checkbox(
                          v-model="saveConnectionDetails"
                          label="Save settings in browser"
                        )
                v-row(v-if="connectionResultMessage")
                  p(class="error--text") {{ connectionResultMessage }}
        v-card-actions
          v-btn(
            small
            text
            color="warning"
            @click="removeRemoteDBConnection"
          ) Remove Connection
          v-spacer
          v-btn(text @click="dialog = false") Cancel
          v-btn(color="primary" text @click="setValues") Connect

</template>

<script>
import DatabaseRemoteAuthentication from "@/components/app/DatabaseRemoteAuthentication.vue"; //will be removed
import DatabaseCompaction from "@/components/app/DatabaseCompaction.vue";

export default {
  name: 'DatabaseConnectionDialog',
  components: {
    DatabaseRemoteAuthentication, //will be removed
    DatabaseCompaction
  },
  data: () => ({
    remoteDBUrl: null,
    username: null,
    password: null,
    show1: false,
    connectionOK: null,
    connectionResultMessage: null,
    saveConnectionDetails: false,
  }),
  computed: {
    dialog: {
      get() {
        return this.$store.getters.dbConnectionDialog
      },
      set(val) {
        if (!val) {
          this.$store.commit('setGenericStateBooleanFalse', 'dbConnectionDialog')
        }
      }
    },
    getColor () {
      let c = this.$store.getters.remoteDBIsOnline;
      console.log(c);
      return  c == false ? 'error'
            : c == true ? 'success'
            : ''
    }
  },
  mounted () {
    this.startup()
  },
  methods: {
    removeRemoteDBConnection: async function () {
      this.$store.commit('showSnackbar', { text:'Removed remote DB connection. Reloading PIMPIM', color:'warning' });
      this.remoteDBUrl = null; // for cosmetic purposes
      this.$store.commit('setGenericStateBooleanFalse', 'remoteDBIsOnline');
      localStorage.removeItem('remoteDBOptions');
      setTimeout(() => {
        window.location.reload();
      }, 400);
    },
    setValues: async function () {
      let v = this.$store;
      let r = this.remoteDBUrl;
      if (!r || r === '') {
        v.commit('showSnackbar', { text:'Remote DB URL not set', color:'info' });
        return
      }
      let options = { name: r };
      let u = this.username;
      if (u && u.length > 1) {
        options.auth = {
          username: u,
          password: this.password
        };
      }
      window.remoteDB = await new window.PouchDB(options);
      try {
        const response = await window.remoteDB.info();
        console.log('Connection response: ', response)
        if (response.db_name) {
          v.commit('showSnackbar', { text:'Remote DB connected.', color:'success' });
          if(this.saveConnectionDetails) {
            localStorage.setItem('remoteDBOptions', JSON.stringify( { name: r, ...options.auth } ) ); // options.name gets consumed by PouchDB
          }
          v.commit('setGenericStateBooleanTrue', 'remoteDBIsOnline');
          this.dialog = false;
        } else {
          throw { message: 'Something went wrong. See console for details'}
        }
        this.connectionResultMessage = 'Connected';
      } catch(error) {
        console.log('Connection failed: ', error)
        if(error.status === 401) {
          this.connectionResultMessage = error.message;
        } else {
          this.connectionResultMessage = JSON.stringify(error); // duplicated for the time being. Further testing required
          v.commit('showSnackbar', { text:error, color:'error' });
        }
      }
    },
    startup: async function() {
      const rDB = localStorage.getItem('remoteDBOptions');
      if ( rDB ) {
        const options = JSON.parse(rDB);
        this.remoteDBUrl = options.name;
        window.remoteDB = await new window.PouchDB( options );
        const result = await this.$store.dispatch('remoteDBConnectivityCheck');
        if (result) {
          this.$store.dispatch('remoteDBInfo');
        }
      }
    },
    requestAuthCookie: async function() { // not used for the time being, as pouchdb handles authentication well
      //const urlDB = this.remoteDBUrl;
      //let url = this.remoteDBUrl;
      let urlSplit = this.remoteDBUrl.split('/');
      urlSplit.pop();
      let sessionUrl = urlSplit.join('/') + "/_session";

      //const urlDB = this.$store.getters.urlDBRoot;
      const form = { name: this.username, password: this.password };
      //const response = await fetch(urlDB + "_session", {
      const response = await fetch( sessionUrl, {
        method: "POST",
        body: JSON.stringify(form),
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (response.ok) {
        //this.authenticated = true;
        //this.authMsg = null;
        this.authMsg = 'Authenticated';
        //this.authDialog = false;
        //this.pimpimDoc.authenticationRequired = false;
        //this.mangoDoc.authenticationRequired = false;
        //const cookie = await fetch(urlDB + '_session');
        //const cookieObj = await cookie.json();
        //console.log(cookieObj)
      } else if (response.status == 401) {
        this.authMsg = "Incorrect credentials";
      } else {
        console.log(result);
        this.authMsg = "Something went wrong. See console.";
      }
    },

    /*
    connectionCheck: async function () {
      try {
        const response = await fetch( this.remoteDBUrl,{
          credentials: "include"
        } );
        const data = await response.json();
        //const data = await window.remoteDB.info();
        //console.log(data);
        //Do not use -> if ( response.status == 200) { // gives 200 for all relative paths
        if ( data.db_name) {
          this.connectionOK = true;
        } else {
          throw 'Could not establish connection to remote database'
        }
      } catch(error) {
        this.connectionOK = false
        setTimeout(() => {
          this.connectionOK = null
        }, 400);
        this.$store.commit('showSnackbar', { text:'Connection failed: ' + error, color:'error' })
      }
    },
    */
  }
};
</script>