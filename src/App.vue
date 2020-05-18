<template lang="pug">
  v-app(id="inspire")
    v-navigation-drawer(
      v-model="drawer"
      app
    )
      navbar-apps
      v-divider
      v-list-item(
        link 
        href="https://lybekk.github.io/offPIM/"
        target="_blank"
        rel="noreferrer"
        )
        v-list-item-icon
          v-icon mdi-book-information-variant
        v-list-item-content
          v-list-item-title Docs
        v-list-item-action
          v-icon mdi-open-in-new
    v-app-bar(
      app
      hide-on-scroll
      elevate-on-scroll
    )
      v-app-bar-nav-icon(
        @click.stop="drawer = !drawer"
        aria-label="Apps menu"
      )
      div(class="d-flex align-center")
        v-slide-x-transition(:hide-on-leave="true")
          span(
            v-if="this.$route.name == 'welcome'"
            class="headline" 
          ) offPIM
          v-btn(
            v-else  
            icon
            to="/"
          )
            v-icon mdi-apps
      v-tabs(
        fixed-tabs
        background-color="transparent"
        grow
        color="transparent"
      )
        v-tab(@click.stop="drawer = !drawer")
      //- TODO - Dedicated sync-icon here
      NavbarActions
      template(v-slot:extension)
        v-tabs(
          align-with-title
          icons-and-text
        )
          v-tab(
            v-for="(tab, i) in $store.getters.appBarTabs" 
            :key="i"
            :to="{ name: tab.to }"
          ) {{ tab.name }}
            v-icon(v-text="tab.icon")
        v-progress-linear(
          :active="loading"
          :indeterminate="loading"
          absolute
          bottom
          color="primary"
          )
        v-fab-transition
          v-btn(
            v-show="!$store.getters.buttonFormNewHidden"
            color="primary"
            fab
            bottom
            right
            absolute
            to="/new"
          )
            v-icon mdi-plus
    v-scroll-x-transition(mode="out-in")
      router-view
    v-snackbar(
      v-model="snackbar.visible"
      :timeout="snackbar.timeout"
      :multi-line="snackbar.multiline === true"
      :color="snackbar.color"
      bottom
    ) {{ snackbar.text }}
    database-connection-dialog
    raw-document-viewer
</template>

<script>
import NavbarApps from "@/components/app/NavbarApps.vue";
import NavbarActions from "@/components/app/NavbarActions.vue";
import DatabaseConnectionDialog from "@/components/app/DatabaseConnectionDialog.vue";
import RawDocumentViewer from "@/components/app/RawDocumentViewer.vue";

import offPIMDesignDoc from "@/components/designdocs/offpim_design_doc.json";
import MangoDesignDoc from "@/components/designdocs/mango_indexes.json";

export default {
  name: "App",
  components: {
    NavbarApps,
    NavbarActions,
    DatabaseConnectionDialog,
    RawDocumentViewer
  },
  data: () => ({}),
  computed: {
    drawer: {
      get() {
        return this.$store.getters.isLeftDrawerOpen;
      },
      set(state) {
        this.$store.commit("setLeftDrawer", state);
      }
    },
    snackbar() {
      return this.$store.state.snackbar;
    },
    loading() {
      return this.$store.getters.loaderState;
    }
  },
  created() {},
  mounted() {
    this.$store.commit("loadLocalSettings");
    this.startupcheck();
    this.$vuetify.theme.dark = localStorage.getItem("darkMode");
    setTimeout(() => {
      this.$store.commit("setGenericStateBooleanFalse", "buttonFormNewHidden");
    }, 1000);
  },
  methods: {
    startupcheck: async function() {
      let v = this.$store;
      v.dispatch("checkThemeSettings"); //store/themes.js
      v.dispatch("localDBInfo");

      try {
        const pDoc = await v.dispatch("startupIndexCheck", {
          doc: "offpim",
          version: offPIMDesignDoc.version
        });
        const mDoc = await v.dispatch("startupIndexCheck", {
          doc: "offpim_mango_indexes",
          version: MangoDesignDoc.version
        });
        console.log(pDoc);
        if (!pDoc || !mDoc) {
          await this.insertDesignDocument(offPIMDesignDoc, "offpim");
          await this.insertDesignDocument(
            MangoDesignDoc,
            "offpim_mango_indexes"
          );
        }
        v.dispatch("setTotals");
        v.dispatch("setMessagesUnreadCount");
      } catch (err) {
        console.log(
          "Something went wrong during design doc verification: ",
          err
        );
      }
    },
    insertDesignDocument: async function(serverDoc, docId) {
      console.log("Checking design document version for doc: ", docId);
      const s = serverDoc; // serverDesignDoc / design doc included in this version of offpim

      try {
        const dbDoc = await window.db.get(`_design/${docId}`); // databaseDesignDoc
        if (s.version > dbDoc.version) {
          s._rev = dbDoc._rev;
          const response = await window.db.put(s); // may require confirmation
          if (response.ok) {
            this[`design_${docId}`] = true;
          } else {
            throw "Failed inserting design document " + docId;
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
    }
  }
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>