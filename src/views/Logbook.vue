<template>
  <v-main>
    <v-container fluid>
      <v-navigation-drawer
        v-model="drawerRight"
        app
        right
      >
        <LogbookChronology />
        <v-divider inset />
        <LogbookTaglist />
      </v-navigation-drawer>
      <v-row>
        <v-col>
          <v-row>
            <v-col>
              <LogbookSearch />
            </v-col>
            <v-col><span v-text="logsDisplayed" /></v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-timeline dense>
                <v-slide-x-transition group>
                  <LogbookItem
                    v-for="(doc, i) in $store.getters.getData"
                    :key="i"
                    :doc="doc"
                  />
                </v-slide-x-transition>
              </v-timeline>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="title">
                      Logbook
                    </v-list-item-title>
                    <v-list-item-subtitle>Total logs in database: <span v-text="totalLogs" /></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <LogbookDetailed />
    </v-container>
  </v-main>
</template>
<script>
import LogbookItem from "@/components/logbook/LogbookItem.vue";
import LogbookTaglist from "@/components/logbook/LogbookTaglist.vue";
import LogbookSearch from "@/components/logbook/LogbookSearch.vue";
import LogbookChronology from "@/components/logbook/LogbookChronology.vue";
import LogbookDetailed from "@/components/logbook/LogbookDetailed.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "Logbook",
  components: {
    LogbookItem,
    LogbookTaglist,
    LogbookSearch,
    LogbookChronology,
    LogbookDetailed
  },
  mixins: [pouchMixin],
  props: {
    list: {
      type: String,
      default: null,
    }
  },
  data: () => ({
    drawerRight: false,
    navTabs: [
      {
        name: "Latest",
        to: "logbook",
        icon: "mdi-clock"
      }
    ]
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
    this.$store.commit("appBarTabs", this.navTabs);
    this.$store.commit("flushData");
    // improve performance. Too sluggish. Consider async await. Chronology/getlogsyears last
    if (!this.list) {
      this.getLastLogEntriesByCount();
    } else {
      console.log("Debug: No list parameter");
    }

    // TODO: Remove after redesign
    setTimeout(() => {
      this.drawerRight = true;
    }, 600);
  },
  beforeDestroy() {
    this.$store.commit("appBarTabs", []);
    this.$store.commit("flushData");
  },
  methods: {
    getLastLogEntriesByCount: async function() {
      try {
        let data = await this.getQuery(
          "offpim/logs-start-days",
          null, //this.tag,
          null, //this.tag,
          true
        );
        this.$store.commit("addDataArray", data);
      } catch (error) {
        this.errorHandler(error);
      }
    }
  }
};
</script>

