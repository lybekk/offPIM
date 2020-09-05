<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      :expand-on-hover="$vuetify.breakpoint.lgAndUp"
      dark
      color="primary darken-3"
    >
      <v-list
        dense
        flat
      >
        <v-list-item
          link
          to="/"
        >
          <v-list-item-icon>
            <v-icon color="secondary">
              mdi-circle
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>offPIM</v-list-item-title>
          </v-list-item-content>
          <!-- DO NOT REMOVE
          <div class="d-flex align-center">
            <v-slide-x-transition :hide-on-leave="true">
              <span class="headline" v-if="this.$route.name == 'welcome'">offPIM</span>
              <v-btn v-else icon to="/">
                <v-icon>mdi-apps</v-icon>
              </v-btn>
            </v-slide-x-transition>
          </div>
          -->
        </v-list-item>
      </v-list>
      <v-divider />
      <NavbarApps />
      <v-divider inset />
      <v-list-item
        link
        href="https://lybekk.github.io/offPIM/"
        target="_blank"
        rel="noreferrer"
      >
        <v-list-item-icon>
          <v-icon>mdi-book-information-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Docs</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon>mdi-open-in-new</v-icon>
        </v-list-item-action>
      </v-list-item>
      <template v-slot:append>
        <v-list shaped>
          <v-list-item
            link="link"
            to="/settings"
          >
            <v-list-item-action>
              <v-icon>mdi-cogs</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="primary darken-2"
      dark
      hide-on-scroll
      elevate-on-scroll
      extended
    >
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        top
        color="info"
        height="4"
      />
      <v-app-bar-nav-icon
        aria-label="Apps menu"
        @click.stop="drawer = !drawer"
      />
      <v-spacer />
      <LocalWhiteboard />
      <NavbarActions />
      <template v-slot:extension>
        <v-tabs
          align-with-title
          show-arrows
          active-class="primary darken-1 text--white"
        >
          <v-tab
            v-for="(tab, i) in $store.getters.appBarTabs"
            :key="i"
            :to="{ name: tab.to, params: tab.params }"
          >
            <v-icon 
              v-if="isSmallScreen" 
              v-text="tab.icon" 
            />
            <span
              v-else 
              v-text="tab.name" 
            />
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
    <NewDocButtons />
    <v-snackbar
      v-model="snackbar.visible"
      :timeout="snackbar.timeout"
      :multi-line="snackbar.multiline === true"
      :color="snackbar.color"
      app
      :top="$vuetify.breakpoint.mdAndDown"
    >
      {{ snackbar.text }}
    </v-snackbar>
    <DatabaseConnectionDialog />
    <DocumentViewer />
    <RawDocumentViewer />
  </v-app>
</template>

<script>
import NavbarApps from "@/components/app/NavbarApps.vue";
import NavbarActions from "@/components/app/NavbarActions.vue";
import DatabaseConnectionDialog from "@/components/app/DatabaseConnectionDialog.vue";
import RawDocumentViewer from "@/components/app/RawDocumentViewer.vue";
import DocumentViewer from "@/components/app/DocumentViewer.vue";
import LocalWhiteboard from "@/components/app/LocalWhiteboard.vue";
import NewDocButtons from "@/components/app/NewDocButtons.vue";
import formatMixin from '@/mixins/formatMixin'

import offPIMDesignDoc from "@/components/designdocs/offpim_design_doc.json";
import MangoDesignDoc from "@/components/designdocs/mango_indexes.json";

export default {
  name: "App",
  components: {
    NavbarApps,
    NavbarActions,
    DatabaseConnectionDialog,
    RawDocumentViewer,
    DocumentViewer,
    LocalWhiteboard,
    NewDocButtons
  },
  mixins: [formatMixin],
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
  mounted() {
    this.$store.dispatch("infoBridge", {
      text: "offPIM mounted",
      level: "debug"
    });
    this.$store.commit("loadLocalSettings");
    this.$vuetify.theme.dark = localStorage.getItem("darkMode");
    setTimeout(() => {
      this.$store.commit("setGenericStateBooleanFalse", "buttonFormNewHidden");
      this.startupcheck();
    }, 1000);

    setTimeout(() => {
      if (this.$vuetify.breakpoint.lgAndUp) {
        this.drawer = true;
      }
    }, 2000);
    /**
     * Keyboard shortcuts
     */
    var vm = this;
    window.addEventListener("keydown", function(event) {
      // NOTE: metaKey == Command on Mac
      if ((event.metaKey || event.ctrlKey) && event.key === "d") {
        event.preventDefault();
        vm.openNewEntryForm();
      }
    });
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
        this.$store.dispatch("infoBridge", {
          text: "Something went wrong during design doc verification: ",
          color: "error",
          error: err
        });
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
    },

    openNewEntryForm: function() {
      const routeInfo = {
        name: this.$route.name,
        params: this.$route.params
      };
      window.localStorage.setItem("currentRoute", JSON.stringify(routeInfo));
      this.$router.push({ name: "formsNew" });
    }
  }
};
</script>
