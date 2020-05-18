<template lang="pug">
    v-card-text
        v-list
            v-dialog(max-width="500")
                template(v-slot:activator="{ on }")
                    v-list-item(v-on="on")
                        v-list-item-icon
                            v-icon mdi-information
                        v-list-item-content
                            v-list-item-title Info
                v-card
                    v-card-title
                    v-card-text
                        p(v-for="tip in remoteTips" v-html="tip")
            v-subheader Actions
            database-compaction(whatdb="remoteDB")
            v-list-item(@click="removeRemoteDBConnection")
                v-list-item-icon
                    v-icon(color="warning") mdi-database-remove
                v-list-item-content
                    v-list-item-title Remove connection
                    v-list-item-subtitle Clears settings & reloads app
            v-subheader Settings
            v-list-item(
                v-if="!$store.getters.remoteDBIsOnline"
                class="warning--text"
            )
                v-list-item-content
                    v-list-item-title Connect to remote database to enable this:
            v-list-item
                v-list-item-action
                    v-switch(
                        v-model="settingLiveSync"
                        hide-details
                        :disabled="!$store.getters.remoteDBIsOnline"
                    )
                v-list-item-content
                    v-list-item-title Sync continuously to remoteDB
                    v-list-item-subtitle Requires refresh (Sync starts after 5 seconds)
            v-list-item
                v-list-item-action
                    v-switch(
                        v-model="settingRetrySync"
                        :disabled="!settingLiveSync"
                        hide-details
                    )
                v-list-item-content
                    v-list-item-title Retry if sync fails
                    v-list-item-subtitle (I.E. due to connection issues)

</template>

<script>
import DatabaseCompaction from "@/components/app/DatabaseCompaction.vue";

export default {
    name: 'settingsremotedb',
    components: {
        DatabaseCompaction
        },
  data: () => ({
        remoteTips: [
        "Leave username blank if credentials are in the url",
        "Use full url, with <kbd>http</kbd> or <kbd>https</kbd>, including database name (I.E. <kbd>http://localhost:5984/vault</kbd>), to a CouchDB compatible database server to enable synchronization. Credentials may be included in url: <kbd>http://user:pass@domain:port/db</kbd> (less secure)",
        "If username:password not in url, provide credentials in form",
        "Note: User/admin must have permission to upload design documents"
        ]
  }),
  computed: {
    settingLiveSync: {
      get() {
        return this.$store.getters.localSettings.liveSync;
      },
      set(val) {
        this.$store.commit("setLocalSetting", { key: "liveSync", value: val });
      },
    },
    settingRetrySync: {
      get() {
        return this.$store.getters.localSettings.retrySync;
      },
      set(val) {
        this.$store.commit("setLocalSetting", { key: "retrySync", value: val });
      },
    },
  },
  methods: {
    removeRemoteDBConnection: async function() {
      this.$store.commit("showSnackbar", {
        text: "Removed remote DB connection. Reloading offPIM",
        color: "warning",
      });
      this.remoteDBUrl = null; // for cosmetic purposes
      this.$store.commit("setGenericStateBooleanFalse", "remoteDBIsOnline");
      localStorage.removeItem("remoteDBOptions");
      setTimeout(() => {
        window.location.reload();
      }, 400);
    },
  }
}
</script>