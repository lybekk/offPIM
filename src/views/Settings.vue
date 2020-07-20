<template>
  <v-main>
    <v-overlay
      :value="refreshingCache"
      color="info"
    >
      <v-progress-circular
        :value="refreshProgress"
        size="128"
      />
    </v-overlay>
    <v-container>
      <v-row>
        <v-col>
          <p class="display-3">
            Settings
          </p>
        </v-col>
      </v-row>
      <v-tabs
        v-model="tab"
        :vertical="!$vuetify.breakpoint.mdAndDown"
        color="primary"
        show-arrows
      >
        <v-tab href="#tab-interface">
          Interface
        </v-tab>
        <v-tab href="#tab-actions">
          Actions
        </v-tab>
        <v-tab href="#tab-localdb">
          Local DB
        </v-tab>
        <v-tab href="#tab-remotedb">
          Remote DB
        </v-tab>
        <v-tab-item id="tab-interface">
          <v-card flat>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-switch
                      v-model="isDarkMode"
                      class="ma-2"
                      label="Dark mode"
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item id="tab-actions">
          <v-card flat>
            <v-card-text>
              <v-list>
                <v-subheader>This browser</v-subheader>
                <v-list-item @click="refreshCache">
                  <v-list-item-icon>
                    <v-icon>mdi-cached</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Refresh cache</v-list-item-title>
                    <v-list-item-subtitle>Useful if a new version of offPIM is available</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item id="tab-localdb">
          <v-card flat>
            <LocalDatabase />
          </v-card>
        </v-tab-item>
        <v-tab-item id="tab-remotedb">
          <v-card flat>
            <RemoteDatabase />
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </v-main>
</template>

<script>
import RemoteDatabase from "@/components/settings/RemoteDatabase.vue";
import LocalDatabase from "@/components/settings/LocalDatabase.vue";

export default {
  name: "Settings",
  components: {
      RemoteDatabase,
      LocalDatabase
  },
  data: () => ({
      tab: null,
      refreshingCache: false,
      refreshProgress: 0,
  }),
  computed: {
    isDarkMode: {
      get() {
        return this.$vuetify.theme.dark;
      },
      set(state) {
        if (state) {
          localStorage.setItem("darkMode", true);
        } else {
          localStorage.removeItem("darkMode");
        }
        this.$vuetify.theme.dark = state;
      },
    },
  },
  created: function() {},
  mounted() {
      const requestedTab = this.$route.params.tab;
      this.tab = requestedTab;
      console.log(requestedTab)
  },
  beforeDestroy() {},
  methods: {
      refreshCache: async function () {
        this.refreshingCache = true;
        setTimeout(() => {
            this.refreshProgress = 100;
        }, 200);
        setTimeout(() => {
            window.location.reload(true)
        }, 1000);
      },
    }
};
</script>
