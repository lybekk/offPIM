<template>
  <v-list-item
    :disabled="compactingDone || compactInProgress"
    @click="compactDB"
  >
    <v-list-item-icon>
      <v-icon>mdi-database-refresh</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>
        Compact database
        <v-progress-linear
          v-if="compactInProgress"
          color="info"
          buffer-value="0"
          stream
        />
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-icon>
      <v-icon
        v-if="compactingDone"
        color="success"
      >
        mdi-check
      </v-icon>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
export default {
  name: "DatabaseCompaction",
  props: {
    whatdb: {
      type: String,
      default: 'localDB',
    }
  },
  data: () => ({
    compactInProgress: false,
    compactingDone: false
  }),
  methods: {
    compactDB: async function() {
      try {
        console.log("Attempting compaction on: ", this.whatdb);
        this.compactInProgress = true;
        var result;
        if (this.whatdb == "remoteDB") {
          result = await window.remoteDB.compact();
        } else {
          this.$store.dispatch("infoBridge", {
            color: "info",
            text:
              "Local compaction may take a while. Feel free to get things done. Just don't close the browser."
          });
          result = await window.db.compact();
        }
        if (result.ok) {
          this.compactingDone = true;
        }
        this.compactInProgress = false;
      } catch (error) {
        this.$store.dispatch("infoBridge", {
          color: "error",
          text: this.whatdb + " database compaction failed",
          error: error
        });
        this.compactInProgress = false;
      }
    }
  }
};
</script>
