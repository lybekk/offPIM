<template lang="pug">
v-content
  v-container(fluid)
    v-row
      v-col
        v-container
          v-card(
            class="mx-auto" 
            tile
          )
            v-list(rounded)
              v-subheader(class="headline font-weight-light") Status report
                //- TODO Morning/evening / Key figures
              v-list-item-group(color="primary")
                v-list-item(
                  v-if="this.$store.getters.getTasksAggregate.today != 0"
                  to="/tasks"
                )
                  v-list-item-icon
                    v-icon mdi-checkbox-marked-circle-outline
                  v-list-item-content
                    v-list-item-title {{ reportTasks.main }} 
                      span(v-if="this.$store.getters.getTasksAggregate.overdue != 0")
                        span( class="error--text") {{ reportTasks.overdue }} 
                        span overdue
                v-list-item(
                  v-if="this.$store.getters.getMessagesUnreadCount != 0"
                  to="/messages"
                )
                  v-list-item-icon
                    v-icon mdi-email
                  v-list-item-content
                    v-list-item-title(v-text="reportMessages")
    v-row
      v-col
        v-card
          v-card-title Tasks
          //v-card-text(
            v-if="isNoTasks"
            ) No unfinished tasks
          v-card-text
            v-container(fluid)
              v-row
                v-col(cols="12")
                  div
                    p(v-if="!this.$store.getters.getTasksAggregate.initiated") Retrieving aggregates
                    p(
                      v-if="this.$store.getters.getTasksAggregate.doneToday != 0"
                    ) Tasks done today: 
                      span(
                        v-text="this.$store.getters.getTasksAggregate.doneToday"
                        class="success--text"
                      )
                    p(
                      v-if="this.$store.getters.getTasksAggregate.initiated && !taskProgress.visible"
                    ) No tasks done today so far
                    v-progress-linear(
                      v-if="this.$store.getters.getTasksAggregate.initiated && taskProgress.visible"
                      :color="taskProgress.color"
                      :buffer-value="taskProgress.buffer"
                      :value="taskProgress.value"
                    )
              v-row
                v-col(
                  cols="12"
                  lg="3"
                )
                  v-skeleton-loader(
                    :loading="!this.$store.getters.getTasksAggregate.initiated"
                    transition="scale-transition"
                    type="image"
                  )
                    chart-task-statuses
                v-col(
                  cols="12"
                  lg="3"
                  )
                  chart-tasks-today
  v-footer 
    v-container
      v-row
        v-col
          v-container(
            v-for="dt in dataTables"
            :key="dt.name"
          )
            v-card
              v-card-title(class="headline") {{ dt.name }}
              v-card-text
                v-simple-table
                  template(v-slot:default)
                    thead
                      tr
                        th(class="text-left") Key
                        th(class="text-left") Value
                    tbody
                      tr(
                        v-for="data in dt.table" 
                        :key="data.key"
                      )
                        //v-for="data in dataTable" 
                        td {{ data.key }}
                        td {{ data.value }}
        v-col
          v-container
            v-card
              v-card-title(class="headline") Remote database
              v-card-text(v-if="!$store.getters.remoteDBIsOnline") Remote database is not connected
              v-card-text(v-else)
                v-simple-table
                  template(v-slot:default)
                    tbody
                      tr
                        td DB Name
                        td {{ rDBInfo.db_name }}
                      tr
                        td DB Name
                        td {{ rDBInfo.host }}
                      tr
                        td Deleted documents
                        td {{ rDBInfo.doc_del_count }}
                      tr
                        td Total documents
                        td {{ rDBInfo.doc_count }}
                      tr
                        td DB disk Size
                        td {{ formatBytes(rDBInfo.disk_size) }}
                      tr
                        td DB disk Size
                        td {{ formatBytes(rDBInfo.data_size) }}
                      tr
                        td DB Adapter
                        td {{ rDBInfo.adapter }}
</template>

<script>
import ChartTaskStatuses from "@/components/charts/ChartTaskStatuses.vue"
import ChartTasksToday from "@/components/charts/ChartTasksToday.vue"
import formatMixin from '@/mixins/formatMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  components: {
    ChartTaskStatuses,
    ChartTasksToday
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
    taskProgress: function () {
      let j = { color: 'info', buffer: 0, value: 0, visible: true}
      let a = this.$store.getters.getTasksAggregate
      let d = a.doneToday;
      let t = a.today;
      if (d == 0 && t == 0) {
        j.visible = false
        return j
      }
      if (d > 0 && t == 0) {
        j.value = 100
        j.color = 'success'
        return j
      }
      let s = d + t
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
    sparklineLoading: function () {
      if (this.tasksStatuSparklineValues.length == 5) {
        return false
      }
      return true
    }
  },
  created () {
    },
  mounted () {
    setTimeout(() => {
      this.$store.commit('setLeftDrawer', true);
    }, 200);
    setTimeout(() => {
      this.$store.dispatch('setMessagesUnreadCount');
      this.fillDataTable();
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
