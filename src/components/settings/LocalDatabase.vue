<template>
  <v-card-text>
    <v-overlay
      :value="destroyInProgress"
      color="warning"
    >
      <v-card>
        <v-card-text>
          <v-row>
            <v-col>Destroying local database. This may take a while if it's a large database.</v-col>
          </v-row>
          <v-row>
            <v-col>
              <div class="text-center">
                <v-progress-circular
                  color="error"
                  indeterminate
                  size="64"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-overlay>
    <v-list>
      <v-dialog max-width="500">
        <template v-slot:activator="{ on }">
          <v-list-item v-on="on">
            <v-list-item-icon><v-icon>mdi-information</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>Info</v-list-item-title></v-list-item-content>
          </v-list-item>
        </template>
        <v-card>
          <v-card-title />
          <v-card-text>
            <p
              v-for="(tip, i) in localTips"
              :key="i"
              v-html="tip"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-subheader>Actions</v-subheader>
      <DatabaseCompaction whatdb="localDB" />
      <LocalDatabaseImport />
      <v-list-item
        :disabled="backupPreparing &amp;&amp; !backupDone"
        @click="backupLocalDB"
      >
        <v-list-item-icon>
          <v-icon>mdi-database-export</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            Create backup
            <v-progress-linear
              v-if="backupPreparing &amp;&amp; !backupDone"
              color="info"
              buffer-value="0"
              stream
            />
          </v-list-item-title>
          <div v-if="backupPreparing">
            <a
              id="linkReadyContainer"
              class="backupLink"
              download="offpim_LocalDB_backup"
            >Creating backup</a>
          </div>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon
            v-if="backupDone"
            color="success"
          >
            mdi-check
          </v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item @click="console.log('link')">
        <v-list-item-icon>
          <v-fab-transition>
            <v-btn
              :key="activeFab.icon"
              :color="activeFab.color"
              fab
              :elevation="trashIconClicked ? 4 : 0"
              small
              @click="destroyLocalDB"
            >
              <v-icon :color="trashIconClicked ? 'black' : ''">
                {{ activeFab.icon }}
              </v-icon>
            </v-btn>
          </v-fab-transition>
        </v-list-item-icon>
        <v-list-item-content @click="trashIconClicked = !trashIconClicked">
          <v-list-item-title>{{ activeFab.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ activeFab.subtitle }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card-text>
</template>

<script>
import DatabaseCompaction from "@/components/app/DatabaseCompaction.vue";
import LocalDatabaseImport from "@/components/settings/LocalDatabaseImport.vue";

export default {
  name: "Settingslocaldb",
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
