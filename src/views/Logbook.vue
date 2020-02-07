<template>
<v-content>
  <v-container fluid>
    <v-row>
      <v-col cols="auto">
          <v-navigation-drawer
            app
            expand-on-hover
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">
                  Logbook
                </v-list-item-title>
                <v-list-item-subtitle>
                  Total: <span v-text="totalLogs"></span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>

            <logbook-newlogform />

            <v-list
              dense
              nav
            >
              <v-list-item
                link
              >
                <v-list-item-icon>
                  <v-icon>mdi-clock</v-icon>
                </v-list-item-icon>

                <v-list-item-content @click="last30">
                  <v-list-item-title>30 last entries</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              
              <v-divider inset></v-divider>
              
              <logbook-taglist />

            </v-list>
          </v-navigation-drawer>
      </v-col>

      <v-col>
        <v-row>
          <v-col>
            <logbook-search />
          </v-col>
          <v-col>
              <span v-text="logsDisplayed"></span>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <logbook-timeline />
          </v-col>
        </v-row>

      </v-col>
    </v-row>

  </v-container>

    <v-navigation-drawer
      v-model="drawerRight"
      app
      right
    >
      <template v-slot:prepend>
        <v-toolbar>
          <v-progress-circular v-if="$store.getters.getChronologyLoading" indeterminate color="info"></v-progress-circular>
          <v-icon v-else>mdi-calendar</v-icon>
          <v-toolbar-title>Chronology</v-toolbar-title>
        </v-toolbar>
      </template>

      <v-treeview 
        :items="dateTree"
        :open.sync="dateTreeOpen"
        dense
        shaped
        hoverable
        transition
        open-on-click
        activatable
      >
        <template v-slot:label="{item}">
          <div @click="getChildren(item)">{{item.name}}</div>
        </template>
      </v-treeview>
    </v-navigation-drawer>

</v-content>
</template>
<script>
import LogbookNewlogform from '@/components/LogbookNewlogform.vue'
import LogbookTimeline from '@/components/LogbookTimeline.vue'
import LogbookTaglist from '@/components/LogbookTaglist.vue'
import LogbookSearch from '@/components/LogbookSearch.vue'

export default {
  name: 'logbook',
  components: {
    LogbookNewlogform,
    LogbookTimeline,
    LogbookTaglist,
    LogbookSearch
  },
  props: {
    source: String,
  },
  data: () => ({
    drawer: false,
    drawerRight: false,
    dateTree: [],
    dateTreeOpen: []
  }),
  computed: {
    totalLogs: function() {
      let x = this.$store.getters.getTotals;
      return x.logs
    },
    logsDisplayed: function() {
      let l = this.$store.getters.loaderState;
      if (l) {
        return '...'
      }

      const n = this.$store.getters.countDisplayedLogs;
      if (n > 0) {
        return `Found ${n} entries`
      }
      return 'No entries matching query'
    },
  },
  created: function () {
  },
  mounted () {
    this.$store.dispatch('getLastLogEntriesByCount', 30);
    this.getLogsYears();
    setTimeout(()=>{
      this.drawerRight = true;
      this.drawer = true;
    }, 300);
  },
  beforeDestroy() {
    this.drawerRight = false;
    this.drawer = true;
  },
  methods: {
    async getChildren (item) {
      this.$store.commit('setChronologyLoading', true);
      if (!item.children) {
        this.$store.dispatch('getLogsByDate', item);
        return
        } // fetch entries, add to view container
      if (item.children.length) {
        this.$store.commit('setChronologyLoading', false)
        return
      }
      let url;
      const monthList = {
        '01':'January',
        '02':'February',
        '03':'March',
        '04':'April',
        '05':'May',
        '06':'June',
        '07':'July',
        '08':'August',
        '09':'September',
        '10':'October',
        '11':'November',
        '12':'December'
      };

      /* GENERATE DAYS */
      if (item.type == 'month') {
        url = this.$store.getters.urlDB;
        let z = item.value.slice(0,10);
        let from = new Date(z);
        let to = new Date(z);
        from.setMonth( from.getMonth() - 1 );
        to.setMonth( to.getMonth() + 2 );
        let startkey = from.toISOString().slice(0,7);
        let endkey = to.toISOString().slice(0,7);
        return fetch(url + `/_design/pimpim/_view/logs-start-days?group=true&startkey="${startkey}"&endkey="${endkey}"`)
          .then(res => res.json())
          .then((data) => {
            const l = data.rows.length;
            data.rows.forEach( (aggregate, i) => {
              const x = aggregate.key.split("-");
              let day = x[2];
              const n = `${day} (${aggregate.value})`;
              item.children.push( { id: aggregate.key, name: n, type: 'day'} )
              if (i +1 == l || l == 0) {
                this.$store.commit('setChronologyLoading', false)
              }
            });
            this.dateTreeOpen.push(z);
          })
          .catch(err => console.warn(err))
      }

      /* GENERATE MONTHS */
      url = this.$store.getters.urlDB;
      return fetch(url + '/_design/pimpim/_view/logs-start-months?group=true') // if performance issue, use startkey & endkey
        .then(res => res.json())
        .then((data) => {
          const l = data.rows.length;
          data.rows.forEach( (aggregate, i) => {
            const x = aggregate.key.split("-");
            const year = x[0];
            let month = x[1];
            const parent = item.name.slice(0,4);
            if (year == parent) {
              const n = `${monthList[month]} (${aggregate.value})`;
              item.children.push( { id: aggregate.key, name: n, children:[], type: 'month', value: aggregate.key.slice(0,10)} )
            }
            if (i +1 == l || l == 0) {
              this.$store.commit('setChronologyLoading', false)
            }
          });
          this.dateTreeOpen.push( item.name.slice(0,4) );
        })
        .catch(err => console.warn(err))
    },
    getLogsYears: async function () {
        let url = this.$store.getters.urlDB;
        const response = await fetch(url + '/_design/pimpim/_view/logs-start-years?group=true&descending=true');
        const data = await response.json();
        data.rows.forEach(y => {
          const x = `${y.key} (${y.value})`;
          this.dateTree.push( { id: y.key, name:x, children: [] } )
        });
    },
    last30: function () {
      this.$store.dispatch('getLastLogEntriesByCount', 30)
    }
  }
}

</script>

