<template lang="pug">
    v-list-item
      v-list-item-avatar
        v-icon mdi-database
      v-list-item-content
        v-list-item-title Local DB
        v-list-item-subtitle Name: {{ $store.getters.localDBInfo.db_name }}
      v-list-item-action
        v-row(justify="center")
          v-dialog(
            v-model="dialog" 
            max-width="25vw"
            overlay-opacity="0.9"
            overlay-color="secondary"
            :fullscreen="$vuetify.breakpoint.mdAndDown"
            transition="dialog-bottom-transition"
          )
            template(v-slot:activator="{ on }")
              v-btn(
                icon 
                small 
                fab
                color="primary"
                v-on="on"
              )
                v-icon mdi-database-edit
            v-overlay(
              :value="destroyInProgress"
              color="warning"
            )
              v-card()
                v-card-text
                  v-row
                    v-col Destroying local database. This may take a while if it's a large database.
                  v-row
                    v-col
                      div(class="text-center")
                        v-progress-circular(color="error" indeterminate size="64")
            v-card
              v-card-title Local database
              v-card-text
                v-expansion-panels(:value="1")
                  v-expansion-panel
                    v-expansion-panel-header Info
                    v-expansion-panel-content
                      ul
                        li Compacting may take a while, depending on number of documents in local DB.
                        li Performance tips:
                          ul
                            li Archive completed projects, tasks and notes.
                            li Destroy local database (sync to remote or backup first) before doing a full resync to only sync back unarchived items
                  v-expansion-panel
                    v-expansion-panel-header Actions
                    v-expansion-panel-content
                      v-card(class="mx-auto" tile)
                        v-list
                          database-compaction(whatdb="localDB")
                          //v-list-item(
                            :disabled="compactingDone || compactInProgress"
                            @click="compactLocalDB" 
                            )
                            v-list-item-content
                              v-list-item-title Compact database
                                v-progress-linear(  
                                  v-if="compactInProgress"
                                  color="info"
                                  buffer-value="0"
                                  stream
                                )
                            v-list-item-icon
                              v-icon(v-if="compactingDone" color="success") mdi-check
                v-divider
                div(class="text-center")
                  v-btn(
                    v-if="!backupPreparing"
                    color="primary"
                    @click="backupLocalDB"
                  ) Create backup
                  div(
                    v-if="backupPreparing"
                  )
                    // Ready:
                    a(
                      id="linkReadyContainer"
                      class="backupLink"
                      download="pimpim_LocalDB_backup"
                    ) Creating backup
                    v-progress-linear(
                      v-if="backupPreparing && !backupDone"
                      color="info"
                      buffer-value="0"
                      stream
                    )
                //v-divider
                v-fab-transition
                  v-speed-dial(
                    absolute 
                    bottom 
                    right
                  )
                    template(v-slot:activator)
                      v-tooltip(bottom)
                        template(v-slot:activator="{ on }")
                          v-btn(
                            v-on="on" 
                            icon 
                            small 
                            fab
                            @click="trashIconClicked = !trashIconClicked"
                          )
                            //@click="toggleTrashIcon"
                            v-icon(v-if="trashIconClicked") mdi-close
                            v-icon(v-else color="primary" title="Jau") mdi-delete
                        span Delete local database
                    v-btn(
                      fab
                      small
                      color="yellow lighten-2"
                      @click="destroyLocalDB"
                    )
                      v-icon(color="black") mdi-radioactive
              v-divider
              v-card-actions
                  v-btn(
                      color="primary"
                      text
                      @click="dialog = false"
                  ) Close
                  v-spacer

</template>

<script>
import DatabaseCompaction from "@/components/app/DatabaseCompaction.vue";

export default {
  name: "LocalDatabaseListItem",
  components: {
    DatabaseCompaction
  },
  data: () => ({
    dialog: false,
    backupPreparing: false,
    backupDone: false,
    trashIconClicked: false,
    //compactingDone: false,
    //compactInProgress: false,
    destroyInProgress: false,
  }),
  computed: {},
  methods: {
    /*
    compactLocalDB: async function() {
      try {
        this.compactInProgress = true;
        var result = await window.db.compact();
        if (result.ok) {
          this.compactingDone = true;
        }
        this.compactInProgress = false;
        console.log(result)
      } catch (err) {
        console.log(err);
        this.compactInProgress = false;
      }
    },
    */

    backupLocalDB: async function() {
      this.backupPreparing = true; // backup not really ready at this time. Used for proper feedback
      const backup = await window.db.allDocs({
        include_docs: true,
        attachments: true
      });
      const blob = await URL.createObjectURL(
        new Blob([JSON.stringify(backup.rows, null, 2)], {
          type: "application/json"
        })
      );
      const link = document.getElementById("linkReadyContainer");
      link.href = blob;
      link.innerText = "Save backup file";
      link.classList.add('backupLinkDone'); // classlist mutation can be replaced by ternary operator
      
      this.backupDone = true;
    },
    destroyLocalDB: async function() {
      if (
        window.confirm(
          "Do you really want to destroy the local database? This is irreversible"
        )
      ) {
        try {
          this.destroyInProgress = true;
          let result = await window.db.destroy();
          console.log('db destroy result: ', result)
          console.log("Local PouchDB Database destroyed");
          this.$store.commit("showSnackbar", {
            text: 'Local database destroyed. Reloading pimpim',
            color: "warning"
          });
          localStorage.removeItem("lastSync");
          //this.$router.push('/');
          setTimeout(() => {
              window.location.reload();
          }, 600);
        } catch (err) {
          this.$store.commit("showSnackbar", {
            text: err,
            color: "error"
          });
          console.log(err);
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
  color:inherit;
}

</style>