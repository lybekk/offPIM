<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col>
          <v-container>
            <v-card
              class="mx-auto"
              tile
            >
              <v-list rounded>
                <v-subheader class="headline font-weight-light">
                  Status report
                  <!-- TODO Morning/evening / Key figures-->
                </v-subheader>
                <v-list-item-group color="primary">
                  <v-list-item
                    v-if="this.$store.getters.getTasksAggregate.today != 0"
                    to="/tasks"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ reportTasks.main }} <span v-if="this.$store.getters.getTasksAggregate.overdue != 0"><span class="error--text">{{ reportTasks.overdue }} </span><span>overdue</span></span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="this.$store.getters.getMessagesUnreadCount != 0"
                    to="/messages"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-email</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="reportMessages" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-container>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <span class="headline">Tasks <span class="subtitle-1 info--text">{{ totalOpenTasks }}</span></span>
        </v-col>
        <v-col
          md="6"
          lg="6"
        >
          <MetricsStatuses />
        </v-col>
        <v-col lg="6">
          <MetricsPriorities />
        </v-col>
        <!-- TODO: Replace with Vue's own progress-->
        <!--v-col(md="6"
lg="3"
)
chart-tasks-today-->
        <v-col lg="2">
          <v-card v-if="this.$store.getters.getTasksAggregate.initiated &amp;&amp; taskProgress.visible">
            <v-card-title>
              <v-icon
                v-if="allTasksDone"
                large
                left
                color="success"
              >
                mdi-check
              </v-icon><span v-text="!allTasksDone ? 'Done today: ' : 'All due done'" /><span
                v-if="!allTasksDone"
                class="success--text ml-1"
                v-text="this.$store.getters.getTasksAggregate.doneToday"
              />
            </v-card-title>
            <v-card-subtitle
              v-if="!allTasksDone"
            >
              <v-progress-linear
                v-if="this.$store.getters.getTasksAggregate.initiated &amp;&amp; taskProgress.visible"
                :color="taskProgress.color"
                :value="taskProgress.value"
                rounded
              />
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-footer>
      <v-container>
        <v-row>
          <v-col>
            <v-container
              v-for="dt in dataTables"
              :key="dt.name"
            >
              <v-card>
                <v-card-title class="headline">
                  {{ dt.name }}
                </v-card-title>
                <v-card-text>
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr
                          v-for="data in dt.table"
                          :key="data.key"
                        >
                          <th>{{ data.key }}</th><td>{{ data.value }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-container>
          </v-col>
          <v-col>
            <v-container>
              <v-card>
                <v-card-title class="headline">
                  Remote database
                </v-card-title>
                <v-card-text v-if="!$store.getters.remoteDBIsOnline">
                  Remote database is not connected
                </v-card-text>
                <v-card-text v-else>
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr
                          v-for="(value, name, index) in remoteDBInfo"
                          :key="index"
                        >
                          <th>{{ name }}</th><td>{{ value }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-main>
</template>

<script>
// TODO: Refactor to vuetify components import ChartTasksToday from "@/components/charts/ChartTasksToday.vue"
import formatMixin from '@/mixins/formatMixin'
import { mapGetters } from 'vuex'

import MetricsStatuses from "@/components/tasks/MetricsStatuses.vue"
import MetricsPriorities from "@/components/tasks/MetricsPriorities.vue"

export default {
  name: 'Dashboard',
  components: {
    MetricsStatuses,
    MetricsPriorities
  },
  mixins: [formatMixin],
  data: () => ({
    dataTables: {
      localDB: {
        name: 'Local DB',
        table: []
      },
    }
  }),
  computed: {
    ...mapGetters({
      rDBInfo: 'remoteDBInfo'
    }),
    remoteDBInfo() {
      let r = this.rDBInfo;
      let obj = {
        "DB Name": r.db_name,
        "Host": r.host,
        "Deleted documents": r.doc_del_count,
        "Total documents": r.doc_count,
        "DB Adapter": r.adapter,
      }
      if (r.disk_size) {
        obj["DB disk size"] = this.formatBytes(r.disk_size);
        obj["DB data size"] = this.formatBytes(r.data_size);
      }
      if (r.sizes) {
        obj["Live data size"] = this.formatBytes(r.sizes.active);
        obj["Uncompressed data size"] = this.formatBytes(r.sizes.external);
        obj["Disk data size"] = this.formatBytes(r.sizes.file);
      }
      return obj
    },
    allTasksDone() {
      return this.taskProgress.value == 100 ? true : false
    },
    taskProgress: function () {
      let j = { color: 'info', buffer: 0, value: 0, visible: true}
      let a = this.$store.getters.getTasksAggregate
      let d = a.doneToday;
      let t = a.today;
      let o = a.overdue;
      let tasksLeft = t + o;
      /**
       * If no tasks are due
       */
      if (d == 0 && !tasksLeft) {
        j.visible = false
        return j
      }
      /**
       * If all due tasks are done
       */
      if ( d > 0 && !tasksLeft) {
        j.value = 100
        j.color = 'success'
        return j
      }
      let s = d + tasksLeft
      let pct = Math.floor( d / s * 100 )
      j.value = pct
      if (pct <= 50) {
        j.color = 'warning'
      }
      return j
    },
    reportMessages: function () {
      let m = this.$store.getters.getMessagesUnreadCount;
      let mx = ''
      if (m>1) {mx = 's'}
      return `${m} unread message${mx}`
      },
    reportTasks: function () {
      const encouragements = [
        'Buckle up!',
        'Strap up!',
        'Roll up your sleeves.'
      ]
      var randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      let r = '';
      let ov = '';
      const t = this.$store.getters.getTasksAggregate;
      let tod = t.today;
      let tov = t.overdue;
      if (tod == 1) {
        // combine and compare with overdue //r = `Only ${tod} task needs your attention.`
        r = `Only ${tod} task due today.`
      } else if (tod >= 10) {
        r = `${randomEncouragement} ${tod} tasks ahead.`
      } else if (tod < 10) {
        r = `You have ${tod} tasks due today.`
      }
      if (tov != 0) {
        ov = `${tov}`
      }
      return { main: r, overdue: ov }
    },
    totalOpenTasks() {
      const s = this.$store.getters.getTaskStatuses;
      let sum = s.wait + s.plan + s.todo + s.next + s.doing;
      return sum
    },
  },
  created () {
    },
  mounted () {
    setTimeout(() => {
      this.$store.dispatch('setMessagesUnreadCount');
      this.fillDataTable();
      if (this.$store.getters.remoteDBIsOnline) {
        this.$store.dispatch('remoteDBInfo');
      }
    }, 600);


  },
  methods: {
    fillDataTable: async function() {
      let ldb = this.dataTables.localDB.table;
        // PouchDB
        try {
          const result = await window.db.info();
          ldb.push(
            { key:'Local DB Name' ,value: result.db_name}
          )
          ldb.push(
            { key:'PouchDB DB Adapter' ,value: result.adapter}
          )
          ldb.push(
            { key:'Auto Compaction' ,value: result.auto_compaction}
          )
          ldb.push(
            { key:'Update sequence' ,value: result.update_seq}
          )
          ldb.push(
            { key:'Local documents' ,value: result.doc_count}
          )
        } catch (err) {
          console.log('Local database stats generation failed', err);
        }
    }
  }
}
</script>
