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
              v-subheader Status report
                //- Morning/evening / Key figures
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
          v-card-text(
            v-if="isNoTasks"
          ) No unfinished tasks
          v-card-text(v-else)
            v-container(fluid)
              v-row
                v-col(
                  cols="12"
                  sm="6"
                )
                  v-skeleton-loader(
                    :loading="sparklineLoading"
                    transition="scale-transition"
                    type="image"
                  )
                    v-sheet(elevation="6")
                      v-sparkline(
                        :value="tasksStatuSparklineValues"
                        smooth="2"
                        padding="2"
                        type="bar"
                        :gradient="['white']"
                        auto-line-width
                        auto-draw
                        auto-draw-easing
                        :auto-draw-duration=500
                        show-labels
                      )
                        //- fix gradient to align with themes
                        template(v-slot:label="item" color="info") {{ taskStatuses[item.index] }} {{ item.value }}
                v-col(
                  cols="12"
                  sm="6"
                )
                  div
                    p(v-if="!taskProgress.visible") Retrieving aggregates
                    p(
                      v-if="this.$store.getters.getTasksAggregate.doneToday != 0"
                    ) Tasks done today: 
                      span(
                        v-text="this.$store.getters.getTasksAggregate.doneToday"
                        class="success--text"
                      )
                    p(
                      v-else
                    ) No tasks done today so far
                    v-progress-linear(
                      :color="taskProgress.color"
                      :buffer-value="taskProgress.buffer"
                      :value="taskProgress.value"
                      stream
                    )
                      //-:indeterminate="taskProgress.visible"
  v-footer 
    v-container(
      v-for="dt in dataTables"
      :key="dt.name"
    )
      v-card
        v-card-title(class="headline") {{ dt.name }}
        v-card-text
          //v-container(v-for="dt in [dataTable,dataTableLocalDB]")
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
    v-container
      //v-card(v-if="!$store.getters.remoteDBIsOnline")
        v-card-text Remote database is not connected
        // button to dbconnectiondialog
      v-card
        v-card-title(class="headline") Remote database
        v-card-text(v-if="!$store.getters.remoteDBIsOnline") Remote database is not connected
        v-card-text(v-else)
          v-simple-table
            template(v-slot:default)
              //caption(class="headline text-left") Caption
              //thead
                tr
                  th(class="text-left") Key
                  th(class="text-left") Value
              tbody
                tr
                  td DB Name
                  td {{ rDBInfo.db_name }}
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
                  td DB Adapter
                  td {{ rDBInfo.adapter }}
</template>

<script>
import formatMixin from '@/mixins/formatMixin'
import { mapGetters } from 'vuex'


export default {
  name: 'dashboard',
  components: {
  },
  mixins: [formatMixin],
  data: () => ({
    taskStatuses: ['wait','plan','todo','next','doing'],
    tasksStatuSparklineValues: [],
    dataTables: {
      generic: {
        name: 'Misc',
        table: []
      },
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
    isNoTasks: function () {
      return this.tasksStatuSparklineValues.every(item => {return item == 0});
    },
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
        r = `Only ${tod} task needs your attention.`
      } else if (tod >= 10) {
        r = `${randomEncouragement} ${tod} tasks ahead.`
      } else if (tod < 10) {
        r = `You have ${tod} tasks due today.`
      }
      if (tov != 0) {
        ov = `${tov}` //<span class="error">overdue</span>
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
      this.$store.dispatch('tasksDueAggregation');
      this.fillTasksSparkline();
      this.dataTables.generic.table.push(
        { key:'Database server URL' ,value:this.$store.getters.urlDBRoot}
      )
      this.dataTables.generic.table.push(
        { key:'Database name' ,value:this.$store.getters.dbName}
      )
      this.fillDataTable();
    }, 600);
  },
  methods: {
    fillTasksSparkline: async function() {
      await this.$store.dispatch('getTaskStatuses');
      const ts = this.$store.getters.getTaskStatuses;
      for (let x of this.taskStatuses) {
        this.tasksStatuSparklineValues.push( ts[x] )
      }
    },
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
