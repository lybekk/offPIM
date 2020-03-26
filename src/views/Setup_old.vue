<template>
<v-content>
  <v-container fluid>

  <p class="headline">Setup</p>
    <!--  or radiobuttons
    v-row(v-if="!dbChoice")
      v-col
        p Pick a database
        v-card
          v-tabs(
            v-model="tab"
            background-color="deep-purple accent-4"
            centered
            dark
            icons-and-text
          )
            v-tabs-slider
            v-tab(href="#tab-1") Pick a database
              v-icon mdi-phone

            v-tab(href="#tab-2") Favorites
              v-icon mdi-heart

            v-tab(href="#tab-3") Nearby
              v-icon mdi-account-box

          v-tabs-items(v-model="tab")
            v-tab-item(
              v-for="i in 3"
              :key="i"
              :value="'tab-' + i"
            )
              v-card(flat)
                v-card-text { text }}
        -->












  <v-stepper v-model="e6" vertical>
    <!-- :rules="[() => false]" -->
    <!-- Consider using editable steppers instead -->
    <v-stepper-step :complete="e6 > 1" :rules="[() => databaseServerConnectionSuccess]" step="1">
      Database server connection
    </v-stepper-step>
    <v-stepper-content step="1">
      <v-card v-if="!databaseServerConnectionSuccess" class="mb-12">
        If no connection. See settings.json in /pimpim/settings.json. Change db-path to xx
        <br>
        <v-btn @click="databaseServerConnection">Retry connection</v-btn>
      </v-card>
      <v-card v-else>
        Database server connection established
        <br>
        <v-btn color="primary" @click="e6 = 2">Continue</v-btn>
      </v-card>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 2" step="2" :rules="[() => databaseConnectionSuccess]">
      Database state
    </v-stepper-step>
    <v-stepper-content step="2">
      <v-card v-if="!databaseConnectionSuccess" class="mb-12">
        Database <code>{{ dbName }}</code> does not exist on database server. 
        By default name is 'vault'. Change in settings.json if another name is desired.
        <v-btn @click="databaseConnection">Retry connection</v-btn>
      </v-card>
      <v-card v-else>
        Database <code>{{ dbName }}</code> exists. Great!
        <br>
        <!-- 
        <v-btn color="primary" @click="e6 = 1">Back</v-btn>
        -->
        <v-btn color="primary" @click="e6 = 3">Continue</v-btn>
      </v-card>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 3" step="3" :rules="[() => pimpimDesignDocumentSuccess]">
      PIMPIM Design document
    </v-stepper-step>
    <v-stepper-content step="3">
      <v-card
        v-if="pimpimDoc.authenticationRequired"
      >
        <v-card>
          Authentication required for design document to be uploaded
          <br>
          <v-btn
            color="warning"
            @click.stop="authDialog = true"
          >
            Authenticate
          </v-btn>
        </v-card>
      </v-card>
      <v-card v-if="pimpimDesignDocumentSuccess">
        <p>Design document up to date</p>
        <v-btn color="primary" @click="e6 = 4">Continue</v-btn>
      </v-card>
      <v-card v-if="!pimpimDesignDocumentSuccess && !pimpimDoc.authenticationRequired">
        <!-- 
          <p>PIMPIM server design document version higher than doc in Database</p>
        -->
        <p>Insert design document</p>
        <v-btn color="primary" @click="pimpimDesignDocument">Insert</v-btn>
      </v-card>
    </v-stepper-content>

    <v-stepper-step step="4" :rules="[() => mangoDesignDocumentSuccess]">
      Mango query indexes document
    </v-stepper-step>
    <v-stepper-content step="4">
      <v-card
        v-if="mangoDoc.authenticationRequired"
      >
        <v-card>
          Authentication required for design document to be uploaded
          <br>
          <v-btn
            color="warning"
            @click.stop="authDialog = true"
          >
            Authenticate
          </v-btn>
        </v-card>
      </v-card>
      <v-card v-if="!mangoDesignDocumentSuccess && !mangoDoc.authenticationRequired">
        <p>Insert mango query index document</p>
        <v-btn color="primary" @click="mangoDesignDocument">Insert</v-btn>
      </v-card>
      <v-card v-if="mangoDesignDocumentSuccess">
        <p>Mango query index document up to date</p>
        <p color="success--text">Setup complete</p>
        <!-- @click="e6 = 1" -->
        <v-btn to="/" color="success">Go to Dashboard</v-btn>
      </v-card>
      <!-- If all is well, btn to Dashboard -->
    </v-stepper-content>
  </v-stepper>

  <!-- Authentication dialog -->
  <div class="text-center">
    <v-dialog
      v-model="authDialog"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Authentication
        </v-card-title>
        <v-card-text>
          Provide credentials for a user/admin with permission to upload design documents
          <v-form>
            <v-row>
              <v-col cols="12" >
                <v-text-field
                  v-model="username"
                  label="Username"
                  outlined
                  shaped
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" >
                <v-text-field
                  v-model="password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show1 ? 'text' : 'password'"
                  name="pwd"
                  label="Password"
                  outlined
                  shaped
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="authMsg">
              <p class="error--text">{{ authMsg }}</p>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="requestAuthCookie"
          >
            Request auth cookie
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  </v-container>
</v-content>
</template>

<script>

export default {
  name: 'setup',
  components: {
  },
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
    username: 'admin',
    password: 'Password',
    rules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters',
      //emailMatch: () => ('The email and password you entered don\'t match'),
    },
    databaseServerConnectionSuccess: false,
    databaseConnectionSuccess: false,
    pimpimDesignDocumentSuccess: false,
    mangoDesignDocumentSuccess: false,
  }),
  computed: {
    dbName: function () {
      return this.$store.getters.dbName;
    }
  },
  created () {
  },
  mounted () {
    this.databaseServerConnection();
    this.databaseConnection();
    setTimeout(() => {
      this.pimpimDesignDocument();
    }, 1000);
    setTimeout(() => {
      this.mangoDesignDocument();
    }, 1500);
  },
  methods: {
    databaseServerConnection: async function() {
      const url = this.$store.getters.urlDBRoot;
      const response = await fetch(url);
      //const serverDesignDoc = await getServerDesignDoc.json();
      if (response.ok) {
        this.databaseServerConnectionSuccess = true
      }
      //const urlDB = this.$store.getters.urlDB;
    },
    databaseConnection: async function() {
      const url = this.$store.getters.urlDB;
      const response = await fetch(url);
      //const serverDesignDoc = await getServerDesignDoc.json();
      if (response.ok) {
        this.databaseConnectionSuccess = true
      }
      //const urlDB = this.$store.getters.urlDB;
    },
    pimpimDesignDocument: async function() {
      if (!this.databaseConnectionSuccess) {return}

      const getServerDesignDoc = await fetch('indexes/pimpim_design_doc.json');
      const serverDesignDoc = await getServerDesignDoc.json();

      const urlDB = this.$store.getters.urlDB;

      const getDatabaseDesignDoc = await fetch(urlDB + '_design/pimpim');
      const databaseDesignDoc = await getDatabaseDesignDoc.json();

      const context = this;
      async function insertDoc(context) {
        const response = await fetch(urlDB + '_design/pimpim', {
          method: "PUT",
          body: JSON.stringify(serverDesignDoc),
          credentials: 'include',
          headers: {
          "Content-Type": "application/json"
          }
        });
        if (response.status == 401) {
          context.pimpimDoc.authenticationRequired = true;
        } else if (response.ok) {
          context.pimpimDesignDocumentSuccess = true;
        }
        //const result = await response.json();
        //console.log(result)
        //return response
      }

      if (getDatabaseDesignDoc.status == 404) {
        insertDoc(context);
      }

      if (serverDesignDoc.version > databaseDesignDoc.version) {
        /* response.status == 409 */
        serverDesignDoc._rev = databaseDesignDoc._rev
        insertDoc(context);
      } else if (serverDesignDoc.version == databaseDesignDoc.version) {
        this.pimpimDesignDocumentSuccess = true;
      }

    },
    mangoDesignDocument: async function() { //minify - merge with pimpimDoc
      if (!this.databaseConnectionSuccess) {return}
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
    requestAuthCookie: async function() {
      const urlDB = this.$store.getters.urlDBRoot;
      const form = { name:this.username, password:this.password };
      const response = await fetch(urlDB + '_session', {
        method: "POST",
        body: JSON.stringify(form),
        credentials: 'include',
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
        this.authMsg = 'Incorrect credentials';
      } else {
        console.log(result);
        this.authMsg = 'Something went wrong. See console.';
      }
    }
    //insertPimpimDesignDoc: async function() {
    //}
  }
}

/*
console.log('PIMPIM server design document version higher than doc in Database. Replacing...');
        serverDesignDoc._rev = databaseDesignDoc._rev;

        const uploadDesignDoc = await fetch(urlDB, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          //mode: 'cors', // no-cors, *cors, same-origin
          //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          //credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          //redirect: 'follow', // manual, *follow, error
          //referrerPolicy: 'no-referrer', // no-referrer, *client
          body: JSON.stringify(serverDesignDoc) // body data type must match "Content-Type" header
        });

        if (uploadDesignDoc.status == 401) {
          console.log('Uatorisert..');
        }
        //return await response.json(); // parses JSON response into native JavaScript objects
        //console.log('respons statusgoe: ', await response.status);
        console.log('respons etter post: ', await uploadDesignDoc.json()); // parses JSON response into native JavaScript objects

      //* Load local pimpimdocs
      //* Check if design document exist in database
      //  Get document
      //  If not exists, upload


*/
</script>
