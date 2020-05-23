<template lang="pug">
    v-dialog(
      v-model="dialog" 
      max-width="50vw"
      overlay-opacity="0.9"
      overlay-color="secondary"
      scrollable
      :fullscreen="$vuetify.breakpoint.mdAndDown"
      transition="dialog-bottom-transition"
    )
      v-card
        v-card-title Remote database
        v-card-subtitle Authentication
        v-card-text
          v-row
            v-col(cols="12")
              v-text-field(
                  v-model="remoteDBUrl"
                  :color="getColor"
                  label="Remote database URL"
                  class="text-capitalize"
                  hide-details
                  outlined
                  shaped
              )
            v-col(cols="12" sm="6")
              v-text-field(
                v-model="username"
                label="Username"
                hide-details
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
                hide-details
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
            p(:class="getColor+'--text'") {{ connectionResultMessage }}
        v-card-actions
          v-btn(
            text
            color="primary"
            :to="{ name: 'settings' }"
            @click="dialog = false"
          )
            v-icon mdi-cogs
            span Settings
          v-spacer
          v-btn(text @click="dialog = false") Cancel
          v-btn(color="primary" text @click="setValues") Connect

</template>

<script>
import PouchDB from "pouchdb-browser";
PouchDB.plugin(require("pouchdb-find"));

export default {
  name: "DatabaseConnectionDialog",
  data: () => ({
    remoteDBUrl: null,
    username: null,
    password: null,
    show1: false,
    connectionResultMessage: null,
    saveConnectionDetails: false
  }),
  computed: {
    dialog: {
      get() {
        return this.$store.getters.dbConnectionDialog;
      },
      set(val) {
        if (!val) {
          this.$store.commit(
            "setGenericStateBooleanFalse",
            "dbConnectionDialog"
          );
        }
      }
    },
    getColor() {
      let c = this.$store.getters.remoteDBIsOnline;
      return c == false ? "error" : c == true ? "success" : "";
    }
  },
  mounted() {
    this.startup();
  },
  methods: {
    setValues: async function() {
      let v = this.$store;
      let r = this.remoteDBUrl;
      if (!r || r === "") {
        v.dispatch("infoBridge", {
          color: "info",
          text: "Remote DB URL not set"
        });
        return;
      }
      let options = { name: r };
      let u = this.username;
      if (u && u.length > 1) {
        options.auth = {
          username: u,
          password: this.password
        };
      }
      window.remoteDB = await new PouchDB(options);
      try {
        const response = await window.remoteDB.info();
        if (response.db_name) {
          v.dispatch("infoBridge", {
            text: "Remote DB connected.",
            color: "success"
          });
          if (this.saveConnectionDetails) {
            localStorage.setItem(
              "remoteDBOptions",
              JSON.stringify({ name: r, ...options.auth })
            ); // options.name gets consumed by PouchDB
          }
          v.commit("setGenericStateBooleanTrue", "remoteDBIsOnline");
          this.dialog = false;
        } else {
          throw { message: "Something went wrong. See console for details" };
        }
        this.connectionResultMessage = "Connected";
      } catch (error) {
        console.log("Connection failed: ", error);
        if (error.status === 401) {
          this.connectionResultMessage = error.message;
        } else {
          this.connectionResultMessage = JSON.stringify(error); // duplicated for the time being. Further testing required
          v.dispatch("infoBridge", {
            text: "Remote DB Unreachable",
            color: "warning"
          });
        }
      }
    },
    startup: async function() {
      const rDB = localStorage.getItem("remoteDBOptions");
      if (rDB) {
        const options = JSON.parse(rDB);
        this.remoteDBUrl = options.name;
        this.username = options.username ? options.username : null;
        this.password = options.password ? options.password : null;

        this.setValues();
      }
    }
  }
};
</script>
