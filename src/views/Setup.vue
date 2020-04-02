<template lang="pug">
v-content
  v-container(fluid)
  p(class="headline") Setup
  v-stepper(v-model="e6" vertical)
    // :rules="[() => false]"
    // Consider using editable steppers instead    
    //v-stepper-step(
      :complete="e6 > 1" 
      :rules="[() => databaseServerConnectionSuccess]" 
      step="1"
      ) Database server connection
    //v-stepper-content(step="1")
      v-card(
        v-if="!databaseServerConnectionSuccess" class="mb-12"
      ) If no connection. See settings.json in /pimpim/settings.json. Change db-path to xx
        br
        v-btn(@click="databaseServerConnection") Retry connection
      v-card(v-else) Database server connection established
        br
        v-btn(color="primary" @click="e6 = 2") Continue
    //v-stepper-step(
      :complete="e6 > 2" 
      step="2" 
      :rules="[() => databaseConnectionSuccess]"
      ) Database state
    //v-stepper-content(step="2")
      v-card(
        v-if="!databaseConnectionSuccess" 
        class="mb-12"
      )
        | Database 
        code { dbName }}
        | does not exist on database server. 
        |  By default name is 'vault'. Change in settings.json if another name is desired.
        v-btn(
          @click="databaseConnection"
        ) Retry connection
      v-card(
        v-else
      ) Database 
        code { dbName }}
        | exists. Great!
        br
        v-btn(
          color="primary" @click="e6 = 3"
        ) Continue
    v-stepper-step(
      :complete="e6 > 1" 
      step="1" 
      :rules="[() => design_pimpim]") PIMPIM Design document
    v-stepper-content(step="1")
      v-card(
        v-if="pimpimDoc.authenticationRequired"
      )
        v-card Authentication required for design document to be uploaded
          br
          v-btn(
            color="warning"
            @click.stop="authDialog = true"
          ) Authenticate
      v-card(v-if="design_pimpim")
        p Design document up to date
        v-btn(color="primary" @click="e6 = 4") Continue
      v-card(v-if="!design_pimpim && !pimpimDoc.authenticationRequired")
        //<p>PIMPIM server design document version higher than doc in Database</p>
        p Insert design document
        //v-btn(color="primary" @click="pimpimDesignDocument") Insert
    v-stepper-step(
      step="2"
      :rules="[() => design_pimpim_mango_indexes]"
    ) Mango query indexes document
    v-stepper-content(step="2")
      v-card(
        v-if="mangoDoc.authenticationRequired"
      )
        v-card Authentication required for design document to be uploaded
          br
          v-btn(
            color="warning"
            @click.stop="authDialog = true"
          ) Authenticate
      v-card(v-if="!design_pimpim_mango_indexes && !mangoDoc.authenticationRequired")
        p Insert mango query index document
        //v-btn(color="primary" @click="mangoDesignDocument") Insert
      v-card(v-if="design_pimpim_mango_indexes")
        p Mango query index document up to date
        p(color="success--text") Setup complete
        //<!-- @click="e6 = 1" -->
        v-btn(to="/" color="success") Go to Dashboard
      //<!-- If all is well, btn to Dashboard -->
  v-card(v-if="design_pimpim && design_pimpim_mango_indexes")
    v-card-title Setup success
    v-btn(to="/dashboard" color="primary") Go to Dashboard
  div(class="text-center")
    v-dialog(
      v-model="authDialog"
      width="500"
    )
      //<!-- Authentication dialog -->
      v-card
        v-card-title(
          class="headline grey lighten-2"
          primary-title
        ) Authentication
        v-card-text Provide credentials for a user/admin with permission to upload design documents
          v-form
            v-row
              v-col(cols="12")
                v-text-field(
                  v-model="username"
                  label="Username"
                  outlined
                  shaped
                )
            v-row
              v-col(cols="12")
                v-text-field(
                  v-model="password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show1 ? 'text' : 'password'"
                  name="pwd"
                  label="Password"
                  outlined
                  shaped
                  @click:append="show1 = !show1"
                )
            v-row(v-if="authMsg")
              p(class="error--text") {{ authMsg }}
        v-divider
        v-card-actions
          v-spacer
          v-btn(
            color="primary"
            text
            @click="requestAuthCookie"
          ) Request auth cookie

</template>

<script>
import PimpimDesignDoc from '@/components/designdocs/pimpim_design_doc.json'
import MangoDesignDoc from '@/components/designdocs/mango_indexes.json'

export default {
  name: "setup",
  components: {},
  data: () => ({
    e6: 0, // stepper
    show1: false,
    authDialog: false,
    authenticated: false,
    pimpimDoc: {
      authenticationRequired: false
    },
    mangoDoc: {
      authenticationRequired: false
    },
    authMsg: null,
    username: "admin",
    password: "Password",
    rules: {
      required: value => !!value || "Required.",
      min: v => v.length >= 8 || "Min 8 characters"
      //emailMatch: () => ('The email and password you entered don\'t match'),
    },
    //databaseServerConnectionSuccess: false,
    //databaseConnectionSuccess: false,
    //pimpimDesignDocumentSuccess: false,
    //mangoDesignDocumentSuccess: false,
    design_pimpim: false,
    design_pimpim_mango_indexes: false
  }),
  computed: {
    dbName: function() {
      return this.$store.getters.dbName;
    }
  },
  created() {},
  mounted() {
    /*
    setTimeout(() => {
      this.pimpimDesignDocument();
    }, 1000);    
    setTimeout(() => {
      this.mangoDesignDocument();
    }, 1500);
    */
    //this.insertDesignDocument('indexes/pimpim_design_doc.json', 'pimpim');
    //this.insertDesignDocument('indexes/mango_indexes.json', 'pimpim_mango_indexes');
    //this.insertDesignDocument(window.pimpim.pimpimDesignDoc, "pimpim");
    //this.insertDesignDocument(window.pimpim.mangoIndexes, "pimpim_mango_indexes");
    this.insertDesignDocument(PimpimDesignDoc, "pimpim");
    this.insertDesignDocument(MangoDesignDoc, "pimpim_mango_indexes");
  },
  methods: {
    insertDesignDocument: async function(serverDoc, docId) {
      //const getServerDesignDoc = await fetch( serverDoc );
      //const serverDesignDoc = await getServerDesignDoc.json();
      console.log('Checking design document version for doc: ', docId)
      const s = serverDoc; // serverDesignDoc / design doc included in this version of PIMPIM

      try {
        const dbDoc = await window.db.get(`_design/${docId}`); // databaseDesignDoc
        if (s.version > dbDoc.version) {
          s._rev = dbDoc._rev;
          const response = await window.db.put(s); // may require confirmation
          if (response.ok) {
            this[`design_${docId}`] = true;
          } else {
            throw 'Failed inserting design document ' + docId
          }
        } else if (s.version == dbDoc.version) {
          //this.pimpimDesignDocumentSuccess = true;
          this[`design_${docId}`] = true;
        }
      } catch (err) {
        console.log(docId, " doc does not exist. Attempting insert");
        const result = await window.db.put(s);
        this[`design_${docId}`] = true;
        console.log("Insert result: ", result);
      }
    },
    /*
    pimpimDesignDocument: async function() {
      //if (!this.databaseConnectionSuccess) {return}

      const getServerDesignDoc = await fetch('indexes/pimpim_design_doc.json');
      const serverDesignDoc = await getServerDesignDoc.json();
      //console.log(serverDesignDoc)
      //const urlDB = this.$store.getters.urlDB;

      //const getDatabaseDesignDoc = await fetch(urlDB + '_design/pimpim');
      try {
        const databaseDesignDoc = await window.db.get('_design/pimpim');
        //console.log(databaseDesignDoc)
        if (serverDesignDoc.version > databaseDesignDoc.version) {
          // response.status == 409
          serverDesignDoc._rev = databaseDesignDoc._rev
          await window.db.put(serverDesignDoc);
        } else if (serverDesignDoc.version == databaseDesignDoc.version) {
          this.pimpimDesignDocumentSuccess = true;
        }
      } catch(err) {
        console.log('pimpim doc does not exitss')
        const result = await window.db.put(serverDesignDoc);
        console.log('Insert resultzz:',result)
      }
      //const databaseDesignDoc = await getDatabaseDesignDoc.json();

      //const context = this;
      //async function insertDoc(context) {
      //  const response = await fetch(urlDB + '_design/pimpim', {
      //    method: "PUT",
      //    body: JSON.stringify(serverDesignDoc),
      //    credentials: 'include',
      //    headers: {
      //    "Content-Type": "application/json"
      //    }
      //  });
      //  if (response.status == 401) {
      //    context.pimpimDoc.authenticationRequired = true;
      //  } else if (response.ok) {
      //    context.pimpimDesignDocumentSuccess = true;
      //  }
      //  //const result = await response.json();
      //  //console.log(result)
      //  //return response
      //}
      //if (getDatabaseDesignDoc.status == 404) {
      //  insertDoc(context);
      //}
      //
    },
    */
    /*
    mangoDesignDocument: async function() { //minify - merge with pimpimDoc
      //if (!this.databaseConnectionSuccess) {return}
      const getServerDesignDoc = await fetch('indexes/mango_indexes.json');
      const serverDesignDoc = await getServerDesignDoc.json();

      const urlDB = this.$store.getters.urlDB;

      const getDatabaseDesignDoc = await fetch(urlDB + '_design/pimpim_mango_indexes');
      const databaseDesignDoc = await getDatabaseDesignDoc.json();

      const context = this;

      async function insertDoc(context) {
        const response = await fetch(urlDB + '_design/pimpim_mango_indexes', {
          method: "PUT",
          body: JSON.stringify(serverDesignDoc),
          credentials: 'include',
          headers: {
          "Content-Type": "application/json"
          }
        });
        if (response.status == 401) {
          context.mangoDoc.authenticationRequired = true;
        } else if (response.ok) {
          context.mangoDesignDocumentSuccess = true;
        }
      }

      if (getDatabaseDesignDoc.status == 404) {
        insertDoc(context);
      }

      if (serverDesignDoc.version > databaseDesignDoc.version) {
        //response.status == 409
        serverDesignDoc._rev = databaseDesignDoc._rev
        insertDoc(context);
      } else if (serverDesignDoc.version == databaseDesignDoc.version) {
        this.mangoDesignDocumentSuccess = true;
      }
    },
    */
    requestAuthCookie: async function() {
      const urlDB = this.$store.getters.urlDBRoot;
      const form = { name: this.username, password: this.password };
      const response = await fetch(urlDB + "_session", {
        method: "POST",
        body: JSON.stringify(form),
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (response.ok) {
        this.authenticated = true;
        this.authMsg = null;
        this.authDialog = false;
        this.pimpimDoc.authenticationRequired = false;
        this.mangoDoc.authenticationRequired = false;
        //const cookie = await fetch(urlDB + '_session');
        //const cookieObj = await cookie.json();
        //console.log(cookieObj)
      } else if (response.status == 401) {
        this.authMsg = "Incorrect credentials";
      } else {
        console.log(result);
        this.authMsg = "Something went wrong. See console.";
      }
    }
    //insertPimpimDesignDoc: async function() {
    //}
  }
};
</script>
