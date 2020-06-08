<template lang="pug">
    v-menu(
      v-model="menu"
      :close-on-content-click="false"
      transition="slide-y-transition"
      bottom
      left
    )
      template(v-slot:activator="{ on }")
        v-btn(
          icon
          v-on="on"
          @click="updateLastSync"
          aria-label="Sync dialog"
        )
          v-icon(color="primary") mdi-dots-vertical
        v-btn(
          v-if="$store.getters.localSettings.liveSync"
          icon
          :loading="syncInProgress"
          @click="buttonLiveSync"
        )
          v-icon(v-if="!remoteDBIsOnline") mdi-cloud-off-outline
          v-icon(v-else color="success") mdi-cloud-sync
        v-btn(
          v-else
          icon
          :loading="syncInProgress"
          @click="syncDatabase"
          :disabled="$store.getters.localSettings.liveSync"
          aria-label="Sync button"
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
                  span(class="warning--text") Push {{ pending.push }}
                  span  |  
                  span(class="info--text") Pull {{ pending.pull }}
                div(v-else) ...
        v-divider
        v-list(two-line)
          v-list-item(
            color="primary"
            @click="$store.commit('setGenericStateBooleanTrue', 'dbConnectionDialog')"
          )
            v-list-item-avatar
              v-icon mdi-cloud
            v-list-item-content
              v-list-item-title Remote DB
              //- TODO - Fix name. Legacy code. Get name from remoteDBinfo
              v-list-item-subtitle(v-text="this.$store.getters.remoteDBSettings.name")
            v-list-item-action
              v-icon(color="primary") mdi-cogs
          v-list-item(:to="{ name: 'settings' }")
            v-list-item-avatar
              v-icon(color="primary") mdi-database
            v-list-item-content
              v-list-item-title Local DB
            v-list-item-action
              v-icon(color="primary") mdi-cogs
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
                :disabled="$store.getters.localSettings.liveSync"
                :loading="syncInProgress"
              )
                span(v-if="$store.getters.localSettings.liveSync") Live-sync On
                span(v-else) Sync
            span Avoid closing browser window during syncing
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";
import PouchDB from "pouchdb-browser";

export default {
  name: "NavbarActions",
  components: {
  },
  mixins: [pouchMixin],
  data: () => ({
    banner: true,
    menu: false,
    lastSync: "Never",
    pending: {
      pull: 0,
      push: 0,
    },
    syncInProgress: false,
    archivedDocumentsSkippedDuringSync: 0,
  }),
  computed: {
    syncIcon() {
      let x = this.$store.getters.remoteDBIsOnline;
      return !x
        ? "mdi-lan-disconnect"
        : this.syncInProgress
        ? "mdi-lan-connect"
        : "mdi-lan-pending";
      //if time to kill -> make it alternate between :mdi-lan-connect mdi-lan-pending
      // using method -> while-loop
    },
    remoteDBIsOnline() {
      return this.$store.getters.remoteDBIsOnline;
    },
  },
  mounted() {
    this.updateLastSync();

    setTimeout(() => {
      if (this.$store.getters.localSettings.liveSync) {
        this.syncDatabase();
      }
    }, 5000);
  },
  methods: {
    connectRemote: async function() {
      const isConnected = await this.$store.dispatch(
        "remoteDBConnectivityCheck"
      );
      if (!isConnected) {
        this.$store.commit("setGenericStateBooleanTrue", "dbConnectionDialog");
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

      if(!this.remoteDBIsOnline) {
        this.$store.dispatch(
          "remoteDBConnectivityCheck"
        );
      }

      const rDB = localStorage.getItem("remoteDBOptions");
      if (!rDB) {
        this.$store.dispatch("infoBridge", {
          text: "Enter connection info",
          color: "info",
        });
        this.$store.commit(
          "setGenericStateBooleanTrue",
          "dbConnectionDialog"
        );
        return
      }

      const vuex = this.$store;
      const dis = this;
      this.syncInProgress = true;
      this.pending.push = 0;
      this.pending.pull = 0;
      this.archivedDocumentsSkippedDuringSync = 0;
      const settings = this.$store.getters.localSettings;

      const archivedDocsForSyncPhase2 = [];

      PouchDB.sync(window.db, window.remoteDB, {
        live: settings.liveSync,
        retry: settings.retrySync,
        push: {},
        pull: {
          filter: function(doc) {
            // TODO - Test archiving on another offPIM instance
            if (doc.archived) {
              archivedDocsForSyncPhase2.push(doc._id)
            } else {
              return true;
            }
          },
        },
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

          if (dis.$store.getters.localSettings.liveSync) {
            if (archivedDocsForSyncPhase2.length) {
              dis.syncPhase2(archivedDocsForSyncPhase2)
            }
            localStorage.setItem("lastSync", new Date().toJSON());
            dis.updateLastSync();
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
          if (archivedDocsForSyncPhase2.length) {
            dis.syncPhase2(archivedDocsForSyncPhase2)
          }

          vuex.dispatch("infoBridge", {
            text: "Done syncing:" + info,
            //color: "success",
            //timeout: 6000,
          });

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

          vuex.dispatch("infoBridge", {
            text: txt,
            color: "success",
            timeout: 6000,
          });

          setTimeout(() => {
            if (!localStorage.getItem("lastSync")) {
              vuex.dispatch("infoBridge", {
                text: "After the very first sync, loading data for the first time may be slow, due to indexing.",
                color: "info",
                timeout: 8000,
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
          // TODO: set localStorage sync did not finish
          vuex.dispatch("infoBridge", {
            text:
              "Something went wrong during sync. Is the Remote DB reachable? ",
            color: "error",
            error: err
          });

        });
    },

    /**
      * A second sync phase, updating documents archived on remoteDB or 
      * another instance source (i.e. offPIM on another device)
      */
    syncPhase2: async function(allArchivedDocIds) {

      try {
        const allLocalIds = await window.db.allDocs()
        .then( function(docs) {
            return docs.rows.map(a => a.id);
        })
        let docsToResync = allArchivedDocIds.filter(id => allLocalIds.includes(id));

        if (docsToResync.length) {
          var result = await window.db.replicate.from(window.remoteDB, {
            doc_ids: docsToResync
          });
          console.log('Result from Sync Phase 2: ', result)
        }

      } catch (err) {
        console.log('Sync phase 2 failed: ', err);
      }

    },
    buttonLiveSync: async function() {
      if(!this.remoteDBIsOnline) {
        await this.$store.dispatch(
          "remoteDBConnectivityCheck"
        );
      }


      let txt = this.remoteDBIsOnline ? 'Live-sync is working' : 'No contact with remote database';
      this.$store.dispatch("infoBridge", {
        text: txt,
        color: this.remoteDBIsOnline ? 'success' : 'warning',
      });
    },

  },
};
</script>
