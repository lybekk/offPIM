<template>
  <v-list>
    <v-toolbar>
      <v-progress-circular
        v-if="chronologyLoading"
        indeterminate
        color="info"
      />
      <v-icon v-else>
        mdi-calendar
      </v-icon>
      <v-toolbar-title>Chronology</v-toolbar-title>
    </v-toolbar>
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
        <div @click="getChildren(item)">
          {{ item.name }}
        </div>
      </template>
    </v-treeview>
  </v-list>
</template>

<script>
export default {
  name: "Logbookchronology",
  components: {},
  data: () => ({
    dateTree: [],
    dateTreeOpen: [],
    chronologyLoading: false
  }),
  computed: {},
  watch: {},
  mounted() {
    this.getLogsYears();
  },
  methods: {
    getLogsByDate: async function(payload) {
      let q;
      if (payload.type == "day") {
        q = payload.id.slice(0, 10);
      }
      let mango = {
        selector: {
          "@type": "Event",
          startDate: { $regex: `^${q}` }
        },
        limit: 100,
        sort: [{ start: "asc" }]
      };

      try {
        let data = await window.db.find(mango);
        this.$store.commit("addDataArray", data.docs);
        this.chronologyLoading = false;
      } catch (error) {
        this.$store.dispatch("infoBridge", {
          text: error,
          color: "error"
        });
      }
    },
    getLogsYears: async function() {
      this.chronologyLoading = true;
      try {
        const response = await window.db.query("offpim/logs-start-years", {
          group: true,
          descending: true
        });
        response.rows.forEach(y => {
          const x = `${y.key} (${y.value})`;
          this.dateTree.push({ id: y.key, name: x, children: [] });
        });
        this.chronologyLoading = false;
      } catch (error) {
        this.$store.dispatch("infoBridge", {
          text: error,
          color: "error"
        });
      }
    },
    async getChildren(item) {
      let notThat = this; // used inside promise/forEach
      this.chronologyLoading = true;
      if (!item.children) {
        this.getLogsByDate(item);
        return;
      } // fetch entries, add to view container
      if (item.children.length) {
        this.chronologyLoading = false;
        return;
      }
      const monthList = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
      };

      /* GENERATE DAYS */
      if (item.type == "month") {
        let z = item.value.slice(0, 10);
        let from = new Date(z);
        let to = new Date(z);
        from.setMonth(from.getMonth() - 1);
        to.setMonth(to.getMonth() + 2);
        let startkey = from.toISOString().slice(0, 7);
        let endkey = to.toISOString().slice(0, 7);
        let dt = this.dateTreeOpen;
        return window.db
          .query("offpim/logs-start-days", {
            group: true,
            startkey: startkey,
            endkey: endkey
          })
          .then(function(result) {
            const l = result.rows.length;
            result.rows.forEach((aggregate, i) => {
              const x = aggregate.key.split("-");
              let day = x[2];
              const n = `${day} (${aggregate.value})`;
              item.children.push({ id: aggregate.key, name: n, type: "day" });
              if (i + 1 == l || l == 0) {
                notThat.chronologyLoading = false;
              }
            });
            dt.push(z);
          })
          .catch(err => console.warn(err));
      }

      /* GENERATE MONTHS */
      return window.db
        .query("offpim/logs-start-months", {
          group: true
        })
        .then(data => {
          const l = data.rows.length;
          data.rows.forEach((aggregate, i) => {
            const x = aggregate.key.split("-");
            const year = x[0];
            let month = x[1];
            const parent = item.name.slice(0, 4);
            if (year == parent) {
              const n = `${monthList[month]} (${aggregate.value})`;
              item.children.push({
                id: aggregate.key,
                name: n,
                children: [],
                type: "month",
                value: aggregate.key.slice(0, 10)
              });
            }
            if (i + 1 == l || l == 0) {
              this.chronologyLoading = false;
            }
          });
          this.dateTreeOpen.push(item.name.slice(0, 4));
        })
        .catch(err => console.warn(err));
    }
  }
};
</script>
