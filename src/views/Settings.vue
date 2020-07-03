<template lang="pug">
v-main
    v-overlay(
        :value="refreshingCache"
        color="info"
    )
        v-progress-circular(:value="refreshProgress" size="128" )
    v-container
        v-row
            v-col
                p(class="display-3") Settings
        v-tabs(
            v-model="tab"
            :vertical="!$vuetify.breakpoint.mdAndDown"
            color="primary"
            show-arrows
        )
            v-tab(href="#tab-interface") Interface
            v-tab(href="#tab-actions") Actions
            v-tab(href="#tab-localdb") Local DB
            v-tab(href="#tab-remotedb") Remote DB
            v-tab-item#tab-interface
                v-card(flat)
                    v-card-text
                        v-list
                            v-list-item
                                v-list-item-content
                                    v-switch(
                                        v-model="isDarkMode" 
                                        class="ma-2" 
                                        label="Dark mode" 
                                    )
            v-tab-item#tab-actions
                v-card(flat)
                    v-card-text
                        v-list
                            v-subheader This browser
                            v-list-item(@click="refreshCache")
                                v-list-item-icon
                                    v-icon mdi-cached
                                v-list-item-content
                                    v-list-item-title Refresh cache
                                    v-list-item-subtitle Useful if a new version of offPIM is available
            v-tab-item#tab-localdb
                v-card(flat)
                    local-database
            v-tab-item#tab-remotedb
                v-card(flat)
                    remote-database

</template>

<script>
import RemoteDatabase from "@/components/settings/RemoteDatabase.vue";
import LocalDatabase from "@/components/settings/LocalDatabase.vue";

export default {
  name: "settings",
  components: {
      RemoteDatabase,
      LocalDatabase
  },
  props: {
    source: String,
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
