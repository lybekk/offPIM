<template lang="pug">
  v-card-text
    v-overlay(
      :value="destroyInProgress"
      color="warning"
    )
      v-card
        v-card-text
          v-row
            v-col Destroying local database. This may take a while if it's a large database.
          v-row
            v-col
              div(class="text-center")
                v-progress-circular(color="error" indeterminate size="64")
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
            p(v-for="tip in localTips" v-html="tip")
      v-subheader Actions
      database-compaction(whatdb="localDB")
      local-database-import
      v-list-item(
        :disabled="backupPreparing && !backupDone"
        @click="backupLocalDB"
      )
        v-list-item-icon
          v-icon mdi-database-export
        v-list-item-content
          v-list-item-title Create backup
            v-progress-linear(
              v-if="backupPreparing && !backupDone"
              color="info"
              buffer-value="0"
              stream
            )
          div(
            v-if="backupPreparing"
          )
            a(
              id="linkReadyContainer"
              class="backupLink"
              download="offpim_LocalDB_backup"
            ) Creating backup
        v-list-item-icon
          v-icon(v-if="backupDone" color="success") mdi-check
      v-list-item(@click="")
        v-list-item-icon
          v-fab-transition
            v-btn(
              :key="activeFab.icon"
              :color="activeFab.color"
              fab
              :elevation="trashIconClicked ? 4 : 0"
              small
              @click="destroyLocalDB"
            )
              v-icon(:color="trashIconClicked ? 'black' : ''") {{ activeFab.icon }}
        v-list-item-content(@click="trashIconClicked = !trashIconClicked")
          v-list-item-title {{ activeFab.title }}
          v-list-item-subtitle {{ activeFab.subtitle }}

</template>

<script>
import DatabaseCompaction from "@/components/app/DatabaseCompaction.vue";
import LocalDatabaseImport from "@/components/settings/LocalDatabaseImport.vue";

export default {
  name: "settingslocaldb",
  components: {
    DatabaseCompaction,
    LocalDatabaseImport
  },
  data: () => ({
    backupPreparing: false,
    backupDone: false,
    trashIconClicked: false,
    destroyInProgress: false,
    localTips: [
      "Compacting may take a while, depending on number of documents in local DB.",
      "Performance tips:",
      "* Archive completed projects, tasks and notes.",
      "* Destroy local database (sync to remote or backup first) before doing a full resync to only sync back unarchived items"
    ]
  }),
  computed: {
    activeFab() {
      let t = this.trashIconClicked;
      return {
        icon: t ? "mdi-radioactive" : "mdi-database-remove",
        color: t ? "yellow lighten-2" : "transparent",
        title: t ? "Are you sure?" : "Destroy local database",
        subtitle: t
          ? "Click nuke icon to proceed"
          : "Remote DB will be left intact"
      };
    }
  },
  methods: {
    backupLocalDB: async function() {
      this.backupPreparing = true; // backup not really ready at this time. Used for proper feedback
      const backup = await window.db.allDocs({
        include_docs: true
      });
      const blob = await URL.createObjectURL(
        new Blob(
          [
            JSON.stringify(
              backup.rows.map(({ doc }) => doc),
              null,
              2
            )
          ],
          {
            type: "application/json"
          }
        )
      );
      const link = document.getElementById("linkReadyContainer");
      link.href = blob;
      link.innerText = "Save backup file";
      link.classList.add("backupLinkDone"); // classlist mutation can be replaced by ternary operator

      this.backupDone = true;
    },
    destroyLocalDB: async function() {
      if (!this.trashIconClicked) {
        this.trashIconClicked = true;
        return;
      }
      if (
        window.confirm(
          "Do you really want to destroy the local database? This is irreversible"
        )
      ) {
        try {
          this.destroyInProgress = true;
          let result = await window.db.destroy();
          console.log("db destroy result: ", result);
          console.log("Local PouchDB Database destroyed");
          this.$store.dispatch("infoBridge", {
            text: "Local database destroyed. Reloading offPIM",
            color: "warning"
          });
          localStorage.removeItem("lastSync");
          setTimeout(() => {
            window.location.reload();
          }, 600);
        } catch (error) {
          this.$store.dispatch("infoBridge", {
            text: error,
            color: "error"
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.backupLink {
  font-size: large;
}

.backupLinkDone {
  width: 100%;
  display: block;
  border-style: solid;
  border-color: #ffffff26;
  color: inherit;
}
</style>
