<template lang="pug">
  div(class="text-center")
    v-menu(
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      transition="slide-y-transition"
      offset-y
      bottom
      left
    )
      template(v-slot:activator="{ on }")
        v-btn(
          icon
          v-on="on"
          :loading="syncInProgress"
          @click="updateLastSync"
        )
          v-icon(v-if="!remoteDBIsOnline") mdi-cloud-off-outline
          v-icon(v-else color="primary") mdi-cloud-sync
      v-card
        v-list
          v-list-item
            v-list-item-icon
              v-icon(v-text="syncIcon")
            v-list-item-content
              v-list-item-title Remote Sync
              v-list-item-subtitle(
                v-if="!syncInProgress"
                v-text="lastSync"
              )
              v-list-item-subtitle(v-else)
                div(v-if="pending.push != 0 || pending.pull != 0")
                  span Remaining: 
                  span(class="warning--text") Sending {{ pending.push }}
                  span  |  
                  span(class="info--text") Retrieving {{ pending.pull }}
                div(v-else) ...
        v-divider
        v-list(two-line)
          v-list-item
            v-list-item-avatar
              v-icon mdi-cloud
            v-list-item-content
              v-list-item-title Remote DB
              v-list-item-subtitle(v-text="this.$store.getters.remoteDBSettings.name")
            v-list-item-action
              v-btn(
                icon 
                small 
                fab
                @click="$store.commit('setGenericStateBooleanTrue', 'dbConnectionDialog')"
              )
                v-icon(color="primary") mdi-database-edit
          local-database-list-item
        v-card-actions
          v-spacer
          v-tooltip(bottom)
            template(v-slot:activator="{ on }")
              v-btn(
                v-if="!remoteDBIsOnline"
                color="warning"
                block
                @click="connectRemote"
              ) Connect
              v-btn(
                v-else
                v-on="on"
                color="primary"
                @click="syncDatabase"
                block
                :loading="syncInProgress"
              ) Sync
            span Avoid closing browser window during syncing
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";
import LocalDatabaseListItem from "@/components/app/LocalDatabaseListItem";
import PouchDB from 'pouchdb-browser';

export default {
  name: "NavbarActions",
  components: {
    LocalDatabaseListItem
  },
  mixins: [pouchMixin],
  data: () => ({
    menu: false,
    lastSync: "Never",
    pending: {
      pull: 0,
      push: 0
    },
    syncInProgress: false,
    archivedDocumentsSkippedDuringSync: 0,
  }),
  computed: {
    syncIcon() {
    let x = this.$store.getters.remoteDBIsOnline;
    return !x ? 'mdi-lan-disconnect'
         : this.syncInProgress ? 'mdi-lan-connect'
         : 'mdi-lan-pending';
      //if time to kill -> make it alternate between :mdi-lan-connect mdi-lan-pending
      // using method -> while-loop
    },
    remoteDBIsOnline() {
      return this.$store.getters.remoteDBIsOnline;
    }
  },
  mounted() {
    this.updateLastSync();

    setTimeout(() => {
      if (this.$store.getters.localSettings.liveSync) {
        this.syncDatabase()
      }
    }, 5000);
  },
  methods: {
    connectRemote: async function() {
      const isConnected = await this.$store.dispatch('remoteDBConnectivityCheck');
      if (!isConnected) {
        this.$store.commit('setGenericStateBooleanTrue', 'dbConnectionDialog')
      }
    },
    updateLastSync: function() {
      const ls = localStorage.getItem("lastSync");
      let time, granularity;
      if (!ls) {
        this.lastSync = "Never synced";
        return;
      }
      let dDue = new Date(ls);
      let dNow = new Date();
      let diff = dNow - dDue;
      
      if (diff < 3600000) {
        time = Math.floor(diff / 60000);
        granularity = time === 1 ? "minute" : "minutes";
      } else {
        time = Math.floor(diff / (1000 * 60 * 60));
        granularity = "hours";
      }
      this.lastSync = `${time} ${granularity} since last sync`;
    },
    syncDatabase: function() {
      const vuex = this.$store;
      const dis = this;
      this.syncInProgress = true;
      this.pending.push = 0;
      this.pending.pull = 0;
      this.archivedDocumentsSkippedDuringSync = 0;
      const settings = this.$store.getters.localSettings;

      PouchDB.sync(window.db, window.remoteDB, {
        live: settings.liveSync,
        retry: settings.retrySync,
        push: {},
        pull: {
          filter: function(doc) {
            if (doc.archived) {
              window.db
                .get(doc._id)
                .then(function(localDoc) {
                  if (doc._rev > localDoc._rev) {
                    return true;
                  }
                })
                .catch(function() {
                  dis.archivedDocumentsSkippedDuringSync++
                });
            } else {
              return true;
            }
          }
        }
      })
        .on("change", function(info) {
          console.log("Change happenend: ", info); // this is here for stability testing
          dis.pending[info.direction] = info.change.pending; // direction: push || pull
          // snackbar with info on pending documents ?
        })
        .on("paused", function(err) {
          // replication paused (e.g. replication up to date, user went offline)
          if (err) {
            console.log("Pause happened. Sync error: ", err);
          } else {
            console.log("Pause happened. Sync success");
            dis.syncInProgress = false;
          }
        })
        .on("active", function() {
          // replicate resumed (e.g. new changes replicating, user went back online)
          this.syncInProgress = true;
          console.log(
            "replicate resumed (e.g. new changes replicating, user went back online)"
          );
        })
        .on("denied", function(err) {
          // a document failed to replicate (e.g. due to permissions)
          // TODO - send to log
          console.log("DENIED HAPPENED: ", err);
        })
        .on("complete", function(info) {
          console.log("Done syncing:", info);
          // push
          const pushedDocs = info.push.docs_written;
          const pushStart = new Date(info.push.start_time);
          const pushEnd = new Date(info.push.end_time);
          var pushDiff = Math.abs((pushStart - pushEnd) / 1000).toFixed(2);
          // pull
          const pulledDocs = info.pull.docs_written;
          const pullStart = new Date(info.pull.start_time);
          const pullEnd = new Date(info.pull.end_time);
          var pullDiff = Math.abs((pullStart - pullEnd) / 1000).toFixed(2);
          let txt;
          if (pushedDocs === 0 && pulledDocs === 0) {
            txt = "No changes made. Local&Remote DB in sync";
          } else {
            txt = `Sent ${pushedDocs} documents to remote database in ${pushDiff}s
              , and received ${pulledDocs} in ${pullDiff}s`;
          }
          vuex.commit("showSnackbar", {
            text: txt,
            color: "success",
            timeout: 6000
          });
          setTimeout(() => {
            if (!localStorage.getItem("lastSync")) {
              vuex.commit("showSnackbar", {
                text:
                  "After the very first sync, loading data for the first time may be slow, due to indexing.",
                color: "info",
                timeout: 8000
              });
            }
          }, 6500);
          // TODO - send to log: archivedDocumentsSkippedDuringSync
          localStorage.setItem("lastSync", new Date().toJSON());
          dis.updateLastSync();
          dis.syncInProgress = false;
        })
        .on("error", function(err) {
          dis.syncInProgress = false;
          console.log("Error syncing: ", err);
          // TODO - send to log
          // set localStorage sync did not finish
          vuex.commit("showSnackbar", {
            text: 'Something went wrong during sync. Is the Remote DB reachable? ' + err,
            color: "error"
          });
        });
    }
  }
};
</script>
