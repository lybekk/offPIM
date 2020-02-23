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
          v-card-text
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
                        auto-line-width
                        auto-draw
                        auto-draw-easing
                        :auto-draw-duration=500
                        show-labels
                      )
                        template(v-slot:label="item") {{ taskStatuses[item.index] }} {{ item.value }}
                v-col(
                  cols="12"
                  sm="6"
                )
                  div
                    //-div(v-if="taskProgress.visible")
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
    v-container
      v-simple-table
        template(v-slot:default)
          thead
            tr
              th(class="text-left") Key
              th(class="text-left") Value
          tbody
            tr(
              v-for="data in dataTable" 
              :key="data.key"
            )
              td {{ data.key }}
              td {{ data.value }}
</template>

<script>

export default {
  name: 'dashboard',
  components: {
  },
  data: () => ({
    taskStatuses: ['wait','plan','todo','next','doing'],
    tasksStatuSparklineValues: [],
    dataTable: []
  }),
  computed: {
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
    //this.$store.commit('loaderActive');
    this.$store.dispatch('setMessagesUnreadCount');
    this.$store.dispatch('tasksDueAggregation');
    this.fillTasksSparkline();
    this.dataTable.push(
      { key:'Database server URL' ,value:this.$store.getters.urlDBRoot}
    )
    this.dataTable.push(
      { key:'Database name' ,value:this.$store.getters.dbName}
    )
    this.fillDataTable();
    //this.$store.commit('loaderInactive');
  },
  methods: {
    fillTasksSparkline: async function() {
      await this.$store.dispatch('getTaskStatuses');
      const ts = this.$store.getters.getTaskStatuses;
      for (let x of this.taskStatuses) {
        this.tasksStatuSparklineValues.push( ts[x] )
      }
    },
    fillDataTable: function() {
      const url = this.$store.getters.urlDB;
      fetch(url)
      .then((response) => response.json())
      .then((data) => {
        function formatBytes(bytes, decimals = 2) { //Thanks! => https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
            if (bytes === 0) return '0 Bytes';

            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }

        this.dataTable.push(
          { key:'Deleted documents' ,value: data.doc_del_count}
        )
        this.dataTable.push(
          { key:'Total documents' ,value: data.doc_count}
        )
        this.dataTable.push(
          { key:'DB disk Size' ,value: formatBytes(data.disk_size)}
        )
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }
}
</script>
