<template lang="pug">
v-content
  //- Not in use. Functionality moved to App.vue
  v-container(fluid)
  p(class="headline") Setup
  v-stepper(v-model="e6" vertical)
    v-stepper-step(
      :complete="e6 > 1" 
      step="1" 
      :rules="[() => design_offpim]") offPIM Design document
    v-stepper-content(step="1")
      v-card(
        v-if="offpimDoc.authenticationRequired"
      )
        v-card Authentication required for design document to be uploaded
          br
          v-btn(
            color="warning"
            @click.stop="authDialog = true"
          ) Authenticate
      v-card(v-if="design_offpim")
        p Design document up to date
        v-btn(color="primary" @click="e6 = 4") Continue
      v-card(v-if="!design_offpim && !offpimDoc.authenticationRequired")
        p Insert design document
    v-stepper-step(
      step="2"
      :rules="[() => design_offpim_mango_indexes]"
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
      v-card(v-if="!design_offpim_mango_indexes && !mangoDoc.authenticationRequired")
        p Insert mango query index document
      v-card(v-if="design_offpim_mango_indexes")
        p Mango query index document up to date
        p(color="success--text") Setup complete
        v-btn(to="/" color="success") OK
  v-card(v-if="design_offpim && design_offpim_mango_indexes")
    v-card-title Setup success
    v-btn(to="/" color="primary") OK
  div(class="text-center")
    v-dialog(
      v-model="authDialog"
      width="500"
    )
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

export default {
  name: "Setup",
  components: {},
  data: () => ({
    e6: 0, // stepper
    show1: false,
    authDialog: false,
    authenticated: false,
    offpimDoc: {
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
    },
    design_offpim: false,
    design_offpim_mango_indexes: false
  }),
  computed: {
    dbName: function() {
      return this.$store.getters.dbName;
    }
  },
  created() {},
  mounted() {
    // "Turned off". Moved to App.vue
    //this.insertDesignDocument(OffPIMDesignDoc, "offpim");
    //this.insertDesignDocument(MangoDesignDoc, "offpim_mango_indexes");
  },
  methods: {
    insertDesignDocument: async function(serverDoc, docId) {
      console.log('Checking design document version for doc: ', docId)
      const s = serverDoc; // serverDesignDoc / design doc included in this version of offpim

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
          this[`design_${docId}`] = true;
        }
      } catch (err) {
        console.log(docId, " doc does not exist. Attempting insert");
        const result = await window.db.put(s);
        this[`design_${docId}`] = true;
        console.log("Insert result: ", result);
      }
    },
  }
};
</script>
