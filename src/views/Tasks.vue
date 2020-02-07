<template>
<v-content>
  <v-container fluid>

    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list
          nav
          dense
      >
        <tasks-newtaskform />
        <v-list-item link v-on:click="todaysTasks">
            <v-list-item-icon>
            <v-icon>mdi-timer-sand-empty</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Today & Overdue</v-list-item-title>
            <v-list-item-action>
              <v-list-item-action-text v-text="this.$store.getters.getTasksAggregate.today"></v-list-item-action-text>
            </v-list-item-action>
        </v-list-item>
        <v-list-item link v-on:click="tomorrowsTasks">
            <v-list-item-icon>
            <v-icon>mdi-timer-sand</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Tomorrow</v-list-item-title>
            <v-list-item-action>
              <v-list-item-action-text v-text="this.$store.getters.getTasksAggregate.tomorrow"></v-list-item-action-text>
            </v-list-item-action>
        </v-list-item>
        <v-list-item link v-on:click="postponedTasks">
            <v-list-item-icon>
            <v-icon>mdi-calendar-arrow-right</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Postponed > 5x</v-list-item-title>
        </v-list-item>
        <v-divider inset></v-divider>

        <v-list-group
          no-action
        >
        <template v-slot:activator>
          <v-list-item-title title="Open projects">Projects</v-list-item-title>
        </template>
          <v-list-item 
            v-for="proj in openProjects" 
            :key="proj._id"
            dense
            link
            @click="getTasks('project' + proj.project)"
          >
            <v-list-item-content :title="proj.project">
                <v-list-item-title v-text="proj.project"></v-list-item-title>
                <v-list-item-subtitle 
                  class="text-capitalize"
                  v-text="proj.status" 
                ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

      </v-list>
    </v-navigation-drawer>

    <v-row>
      <v-col>
          <v-card>
              <v-card-text>
                  Displaying {{ this.$store.getters.countDisplayedTasks }} tasks
              </v-card-text>
          </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-toolbar>

          <v-toolbar-title>Get by status</v-toolbar-title>
          <v-btn-toggle
          v-model="icon"
          rounded
          dense
          >
              <v-btn v-for="status in ['wait','plan','todo','next','doing']"
                  :key="status"
                  :value="status" @click="getTasks('status' + status)"
              >
                  <v-badge
                  v-if="statusCount(status) != 0"
                  :content="statusCount(status)"
                  inline
                  >
                      <span class="hidden-sm-and-down" v-text="status"></span>
                  </v-badge>
                  <span v-else class="hidden-sm-and-down" v-text="status"></span>
              </v-btn>
          </v-btn-toggle>          
          <v-spacer></v-spacer>
          <v-toolbar-title>By priority</v-toolbar-title>
          <v-badge
            v-for="btn in priorityButtons"
            :key="btn.pri"
            :content="priorityCount(btn.pri)"
            :value="priorityCount(btn.pri) != 0"
            bordered
            overlap
          >
            <v-btn
              :title="btn.title"
              class="ma-2"
              small 
              v-text="btn.pri"
              @click="getTasksByPriority(btn.pri)"
            >
            </v-btn>
          </v-badge>

        </v-toolbar>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
          <TasksItems />
      </v-col>
    </v-row>

  </v-container>
</v-content>
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
