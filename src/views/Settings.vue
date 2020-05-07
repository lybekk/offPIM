<template lang="pug">
v-content
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
            :vertical="!$vuetify.breakpoint.mdAndDown"
            color="primary"
        )
            v-tab(href="#tab-local") Local settings
            v-tab(href="#tab-actions") Actions
            v-tab-item#tab-local
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
                            v-subheader Browser
                            v-list-item(@click="refreshCache")
                                v-list-item-icon
                                    v-icon mdi-cached
                                v-list-item-content
                                    v-list-item-title Refresh cache
                                        //v-btn(
                                            color="primary"
                                            @click="refreshCache"
                                            ) Refresh cache
                                    v-list-item-subtitle Useful if a new version of offPIM is available
                            v-subheader Local Database
                            database-compaction(whatdb="localDB")
                            local-database-import

</template>

<script>
import DatabaseCompaction from "@/components/app/DatabaseCompaction.vue";
import LocalDatabaseImport from "@/components/settings/LocalDatabaseImport.vue";

export default {
  name: "settings",
  components: {
      DatabaseCompaction,
      LocalDatabaseImport
  },
  props: {
    source: String,
  },
  data: () => ({
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
  mounted() {},
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
      }
  },
};
</script>
