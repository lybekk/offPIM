<template lang="pug">
v-content
  v-container(fluid)
    v-navigation-drawer(
      v-model="drawerRight"
      app
      right
    )
      v-list
        v-list-item
          v-list-item-content
            v-list-item-title(class="title") Logbook
            v-list-item-subtitle Total: 
              span(v-text="totalLogs")
        v-divider
        v-list(
          dense
          nav
        )
          v-list-item(link)
            v-list-item-icon
              v-icon mdi-clock
            v-list-item-content(@click="getLastLogEntriesByCount(30)")
              v-list-item-title 30 last entries
      logbook-chronology(
        @add-logs="addLogs"
      )
      v-divider(inset)
      logbook-taglist(
        @add-logs="addLogs"
      )
    v-row
      v-col
        v-row
          v-col
            logbook-search(
              @add-logs="addLogs"
            )
          v-col
            span(v-text="logsDisplayed")
        v-row
          v-col
            logbook-timeline(v-bind:logs="logList")

</template>
<script>
import LogbookTimeline from "@/components/logbook/LogbookTimeline.vue";
import LogbookTaglist from "@/components/logbook/LogbookTaglist.vue";
import LogbookSearch from "@/components/logbook/LogbookSearch.vue";
import LogbookChronology from "@/components/logbook/LogbookChronology.vue";

export default {
  name: "logbook",
  components: {
    LogbookTimeline,
    LogbookTaglist,
    LogbookSearch,
    LogbookChronology
  },
  props: {
    source: String
  },
  data: () => ({
    logList: [],
    drawer: false,
    drawerRight: false
  }),
  computed: {
    totalLogs: function() {
      let x = this.$store.getters.getTotals;
      return x.logs;
    },
    logsDisplayed: function() {
      let l = this.$store.getters.loaderState;
      if (l) {
        return "...";
      }

      const n = this.logList.length;
      if (n > 0) {
        return `Found ${n} entries`;
      }
      return "No entries matching query";
    }
  },
  created: function() {},
  mounted() {
    // improve performance. Too sluggish. Consider async await. Chronology/getlogsyears last
    this.getLastLogEntriesByCount(30);
    setTimeout(() => {
      this.drawer = true;
    }, 300);
    setTimeout(() => {
      this.drawerRight = true;
    }, 600);
  },
  beforeDestroy() {
    this.drawerRight = false;
    this.drawer = true;
  },
  methods: {
    getLastLogEntriesByCount: async function(count = 30) {
      const v = this.$store;
      v.commit("loaderActive");
      let now = new Date().toISOString().slice(0, 16);
      let mango = {
        selector: {
          logbook: true,
          created: { $lte: now }
        },
        limit: count,
        sort: [{ created: "desc" }]
      };

      try {
        let data = await window.db.find(mango);
        this.logList = data.docs;
        v.commit("loaderInactive");
      } catch (error) {
        v.commit("showSnackbar", { text: error });
      }

    },
    addLogs: function(logs) {
      this.logList = logs;
    }
  }
};
</script>

