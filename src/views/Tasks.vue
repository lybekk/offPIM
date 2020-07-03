<template lang="pug">
v-main
  v-navigation-drawer(
    v-model="drawer"
    app
    temporary
    right
  )
    project-list
  v-scroll-x-transition(mode="out-in")
    router-view

</template>

<script>
import ProjectList from "@/components/tasks/ProjectList.vue";

export default {
  name: "tasks",
  components: {
    ProjectList
  },
  props: {
    source: String
  },
  data: () => ({
    icon: "justify",
    navTabs: [
      {
        name: "Overview",
        to: "tasksOverview",
        icon: "mdi-eye"
      },
      {
        name: "Today & Overdue",
        to: "tasksList",
        params: { list: "today" },
        icon: "mdi-timer-sand-empty"
      },
      {
        name: "Tomorrow",
        to: "tasksList",
        params: { list: "tomorrow" },
        icon: "mdi-timer-sand"
      },
      {
        name: "Postponed > 5x",
        to: "tasksList",
        params: { list: "postponed" },
        icon: "mdi-calendar-arrow-right"
      }
    ]
  }),
  computed: {
    drawer: {
      get() {
        return this.$store.getters.isRightDrawerOpen;
      },
      set(state) {
        this.$store.commit("setRightDrawer", state);
      }
    },
    openProjects: function() {
      const proj = this.$store.getters.getOpenProjects;
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
  mounted() {
    this.$store.commit("appBarTabs", this.navTabs);
    this.$store.commit("flushData");
    setTimeout(() => {
      this.$store.dispatch("getTaskStatuses");
      this.$store.dispatch("getTaskPriorities");
    }, 300);
    setTimeout(() => {
      this.$store.dispatch("populateOpenProjects");
      this.$store.dispatch("tasksDueAggregation");
      this.$store.dispatch("getTasksTagList");
    }, 800);
  },
  beforeDestroy() {
    this.$store.commit("appBarTabs", []);
  },
  methods: {
    getTasks: function(list) {
      this.$store.dispatch("getTasks", list);
    },
    statusCount: function(status) {
      let list = this.$store.getters.getTaskStatuses;
      return list[status];
    }
  }
};
</script>
