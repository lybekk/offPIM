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
      logbook-chronology
      v-divider(inset)
      logbook-taglist
    v-row
      v-col
        v-row
          v-col
            logbook-search
          v-col
            span(v-text="logsDisplayed")
        v-row
          v-col
            logbook-timeline

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

      const n = this.$store.getters.getData.length;
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

    // TODO: Remove after redesign
    setTimeout(() => {
      this.drawerRight = true;
    }, 600);
  },
  methods: {
    getLastLogEntriesByCount: async function(count = 30) {
      const v = this.$store;
      v.commit("loaderActive");
      let now = new Date().toISOString().slice(0, 16);
      let mango = {
        selector: {
          //logbook: true,
          "@type": "Event",
          created: { $lte: now }
        },
        limit: count,
        sort: [{ created: "desc" }]
      };

      try {
        let data = await window.db.find(mango);
        this.$store.commit("addDataArray", data.docs);
        v.commit("loaderInactive");
      } catch (error) {
        v.dispatch("infoBridge", {
          color: "error",
          text: error,
          level: "error"
        });
      }
    }
  }
};
</script>

