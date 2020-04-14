<template lang="pug">
v-content
  v-container(fluid)
    v-navigation-drawer(
      v-model="drawer"
      app
      right
    )
      v-list(
        nav
        dense
      )
        tasks-newtaskform
        v-list-item(link to="/tasks/list/today")
            v-list-item-icon
              v-icon mdi-timer-sand-empty
            v-list-item-title Today & Overdue
            v-list-item-action
              v-list-item-action-text(v-text="this.$store.getters.getTasksAggregate.today")
        v-list-item(link to="/tasks/list/tomorrow")
            v-list-item-icon
              v-icon mdi-timer-sand
            v-list-item-title Tomorrow
            v-list-item-action
              v-list-item-action-text(v-text="this.$store.getters.getTasksAggregate.tomorrow")
        v-list-item(link to="/tasks/list/postponed")
            v-list-item-icon
              v-icon mdi-calendar-arrow-right
            v-list-item-title Postponed > 5x
        v-divider(inset)
        v-subheader.subtitle-1 Projects
        project-list
        v-divider(inset)
        v-list-item(link to="/tasks/completed_projectless")
            v-list-item-icon
              v-icon mdi-check
            v-list-item-title Completed & projectless
        v-list-item(link to="/tasks/list/noproject")
            v-list-item-icon
              v-icon mdi-folder-alert
            v-list-item-title No project
    v-bottom-navigation(
      app
      :input-value="showBottomNav"
      grow
    )
      v-spacer
      v-bottom-sheet(v-model="statusSheet" inset)
        template(v-slot:activator="{ on }")
          v-btn(
            text
            color="primary"
            v-on="on"
          ) 
            span By status
            v-icon mdi-progress-check
        v-list
          v-subheader Get tasks by status
          v-list-item(
            v-for="status in ['wait','plan','todo','next','doing']"
            :key="status"
            :to="`/tasks/list/status${status}`"
            @click="statusSheet = false"
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
      //v-menu(top offset-y)
      v-bottom-sheet(v-model="prioritySheet" inset)
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
            :to="`/tasks/list/priority${btn.pri}`"
            @click="prioritySheet = false"
          )
            v-list-item-content
              v-list-item-title(
                :title="btn.title"
              ) ({{ btn.pri }}) {{ btn.title }}
            v-list-item-action
              v-list-item-action-text(
                v-if="priorityCount(btn.pri) != 0"
                v-text="priorityCount(btn.pri)"
              )
      v-spacer
      v-app-bar-nav-icon(@click.stop="drawer = !drawer")
    v-row
      v-col
        router-view
        
</template>

<script>
import ProjectList from '@/components/tasks/ProjectList.vue'
import TasksNewtaskform from '@/components/tasks/TasksNewtaskform.vue'

export default {
  name: 'tasks',
  components: {
    TasksNewtaskform,
    ProjectList
  },
  props: {
    source: String,
  },
  data: () => ({
    drawer: false,
    statusSheet: false,
    prioritySheet: false,
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
    this.$store.commit('flushData');
    setTimeout(()=>{
      this.drawer = true; 
      this.showBottomNav = true;
      this.$store.dispatch('getTaskStatuses');
      this.$store.dispatch('getTaskPriorities');
    }, 300);
    setTimeout(()=>{
      this.$store.dispatch('populateOpenProjects');
      this.$store.dispatch('tasksDueAggregation');
      this.$store.dispatch('getTasksTagList');
    }, 800);
  },
  beforeDestroy() {
    this.drawer = false;
    this.showBottomNav = true;
  },
  methods: {
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
    }
  }
}

</script>
