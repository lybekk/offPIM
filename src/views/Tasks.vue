<template lang="pug">
v-content
  v-container(fluid)
    v-navigation-drawer(
      v-model="drawer"
      app
    )
      v-list(
        nav
        dense
      )
        tasks-newtaskform
        v-list-item(link v-on:click="todaysTasks")
            v-list-item-icon
              v-icon mdi-timer-sand-empty
            v-list-item-title Today & Overdue
            v-list-item-action
              v-list-item-action-text(v-text="this.$store.getters.getTasksAggregate.today")
        v-list-item(link v-on:click="tomorrowsTasks")
            v-list-item-icon
              v-icon mdi-timer-sand
            v-list-item-title Tomorrow
            v-list-item-action
              v-list-item-action-text(v-text="this.$store.getters.getTasksAggregate.tomorrow")
        v-list-item(link v-on:click="postponedTasks")
            v-list-item-icon
              v-icon mdi-calendar-arrow-right
            v-list-item-title Postponed > 5x
        v-divider(inset)

        v-list-group(no-action)
          template(v-slot:activator)
            v-list-item-title(title="Open projects") Projects
          v-list-item(
            v-for="proj in openProjects" 
            :key="proj._id"
            dense
            link
            @click="getTasks('project' + proj.project)"
          )
            v-list-item-content(:title="proj.project")
              v-list-item-title(v-text="proj.project")
              v-list-item-subtitle(
                class="text-capitalize"
                v-text="proj.status" 
              )
    v-bottom-navigation(
      app
      :input-value="showBottomNav"
      grow
    )
      v-menu(top offset-y)
        //- open-on-hover removed
        template(v-slot:activator="{ on }")
          v-btn(
            text
            color="primary"
            v-on="on"
          ) 
            span By status
            v-icon mdi-progress-check
        v-list
          v-list-item(
            v-for="status in ['wait','plan','todo','next','doing']"
            :key="status"
            @click="getTasks('status' + status)"
          )
            v-list-item-content
              v-list-item-title(
                v-text="status"
                class="text-capitalize"
              )
            v-list-item-action
              v-list-item-action-text(
                v-if="statusCount(status) != 0"
                v-text="statusCount(status)"
              )
      v-menu(top offset-y)
        //-open-on-hover removed
        template(v-slot:activator="{ on }")
          v-btn(
            text
            color="primary"
            v-on="on"
          )
            span By priority
            v-icon mdi-star
        v-list
          v-list-item(
            v-for="btn in priorityButtons"
            :key="btn.pri"
            @click="getTasksByPriority(btn.pri)"
          )
            v-list-item-content
              v-list-item-title(
                :title="btn.title"
                v-text="btn.pri"
              )
            v-list-item-action
              v-list-item-action-text(
                v-if="priorityCount(btn.pri) != 0"
                v-text="priorityCount(btn.pri)"
              )
    v-row
      v-col
        v-card
            v-card-text Displaying {{ this.$store.getters.countDisplayedTasks }} tasks
    v-row
      v-col
        TasksItems
</template>

<script>
import TasksItems from '@/components/TasksItems.vue'
import TasksNewtaskform from '@/components/TasksNewtaskform.vue'

export default {
  name: 'tasks',
  components: {
    TasksItems,
    TasksNewtaskform
  },
  props: {
    source: String,
  },
  data: () => ({
    drawer: false,
    showBottomNav: false,
    icon: 'justify',
    priorityButtons: [
      { pri: 1, title:'Important and urgent'},
      { pri: 2, title:'Important but not urgent'},
      { pri: 3, title:'Not important but urgent'},
      { pri: 4, title:'Not important and not urgent'}
    ]
  }),
  computed: {
    openProjects: function () {
      const proj = this.$store.getters.getOpenProjects
      proj.sort(function(a, b) {
        var nameA = a.status.toUpperCase();
        var nameB = b.status.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      return proj;
    }
  },
  mounted () {
    this.$store.commit('flushTasks');
    setTimeout(()=>{
      this.drawer = true; 
      this.showBottomNav = true;
      this.$store.dispatch('getTaskStatuses');
      this.$store.dispatch('getTaskPriorities');
    }, 300);
    setTimeout(()=>{
      this.$store.dispatch('getTasks', 'today');
    }, 600);
    setTimeout(()=>{
      this.$store.dispatch('populateOpenProjects');
      this.$store.dispatch('tasksDueAggregation');
    }, 800);
  },
  beforeDestroy() {
    this.drawer = false;
    this.showBottomNav = true;
  },
  methods: {
    todaysTasks: function() {
        this.$store.dispatch('getTasks', 'today');
    },
    tomorrowsTasks: function() {
        this.$store.dispatch('getTasks', 'tomorrow');
    },
    postponedTasks: function() {
        this.$store.dispatch('getTasks', 'postponed5x');
    },
    getTasks: function(list) {
        this.$store.dispatch('getTasks', list);
    },
    statusCount: function(status) {
        let list = this.$store.getters.getTaskStatuses;
        return list[status]
    },
    priorityCount: function(priority) {
        let list = this.$store.getters.getTaskPriorities;
        if (list[priority] == 0) {return 0}
        if (list[priority] > 10) {
          return '+10'
        }
        return list[priority]
    },
    getTasksByPriority: function(pri) {
      this.$store.dispatch('getTasks', 'priority' + pri);
    }
  }
}

</script>
