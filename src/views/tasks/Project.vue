<template>
  <v-container fluid>
    <v-card elevation="0">
      <v-card-title class="headline">
        Project
        <v-spacer />
        <v-row>
          <v-col
            v-for="(value, key) in statuses"
            :key="key"
            :class="[value == 0 ? 'fadedIfStatusZero': '']"
          >
            <v-progress-circular
              size="100"
              width="15"
              :value="statusValuePercent(key)"
              :color="$store.getters.getStatusColors[key]"
            >
              {{ value }}
            </v-progress-circular>
            <v-switch
              v-model="tasksFilter"
              class="overline"
              :value="key"
              :label="key"
              color="secondary"
            />
          </v-col>
        </v-row>
        <v-spacer />
        <TasksProjectArchival
          :project="details"
          :tasks="tasks"
          @get-project="getProject"
        />
      </v-card-title>
    </v-card>
    <v-row>
      <v-col cols="12">
        <TasksItem
          v-if="details._id"
          :docid="details._id"
        />
      </v-col>
    </v-row>
    <v-skeleton-loader
      class="mx-auto"
      :loading="this.$store.getters.loaderState"
      transition="slide-y-reverse-transition"
      type="sentences"
    >
      <v-card elevation="0">
        <v-card-title class="headline">
          {{ tasks.length }} Tasks in <span class="primary--text font-weight-thin ml-1">{{ details.title }}</span>
        </v-card-title>
        <v-card-subtitle class="subtitle font-weight-thin">
          Showing {{ filteredTasks.length }}
        </v-card-subtitle>
      </v-card>
    </v-skeleton-loader>
    <TasksDataIteratorList :tasks="filteredTasks" />
  </v-container>
</template>

<script>
import TasksItem from "@/components/tasks/TasksItem.vue";
import TasksProjectArchival from "@/components/tasks/TasksProjectArchival.vue";
import TasksDataIteratorList from "@/components/tasks/TasksDataIteratorList.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "TasksProject",
  components: {
    TasksItem,
    TasksProjectArchival,
    TasksDataIteratorList
  },
  mixins: [pouchMixin],
  props: {
    projectid: {
      type: String,
      default: null,
    }
  },
  data: () => ({
    showClosedTasks: false,
    tasksFilter: ["wait", "plan", "todo", "next", "doing"],
    details: {},
    tasks: [],
    statuses: {
      wait: 0,
      plan: 0,
      todo: 0,
      next: 0,
      doing: 0,
      done: 0,
      cancelled: 0
    },
    statusesLoading: true
  }),
  computed: {
    filteredTasks: function() {
      const t = this.tasksFilter;
      return this.tasks.filter(function(el) {
        return t.includes(el.status);
      });
    }
  },
  watch: {
    $route(to) {
      if (to) {
        this.getProject();
      }
    }
  },
  created() {},
  mounted() {
    this.getProject();
  },
  beforeDestroy() {},
  methods: {
    statusValuePercent: function(key) {
      const x = this.statuses[key];
      if (x === 0) return 0;
      return Math.floor((x / this.tasks.length) * 100);
    },
    fillCircles: async function() {
      const keys = Object.keys(this.statuses);

      for await (let key of keys) {
        const filteredArray = this.tasks.filter(obj => obj.status === key);
        this.statuses[key] = filteredArray.length;
      }
    },
    getProject: async function() {
      this.details = {};
      this.tasks = [];
      this.details = await this.getDoc(this.projectid);
      this.getTasks();
    },
    resetStatuses: function() {
      for (let x of Object.keys(this.statuses)) {
        this.statuses[x] = 0;
      }
    },
    getTasks: async function() {
      this.resetStatuses();
      this.$store.commit("loaderActive");
      let mango = {
        selector: {
          productivity: true,
          type: "task",
          project: this.projectid
        },
        limit: 1000
      };
      try {
        let data = await window.db.find(mango);
        this.tasks = data.docs;
        this.fillCircles();
      } catch (error) {
        this.$store.dispatch("infoBridge", {
          text: "Getting tasks failed",
          color: "error",
          error: error
        });
      }
      this.$store.commit("loaderInactive");
    }
  }
};
</script>

<style scoped>
.fadedIfStatusZero {
  opacity: 0.2;
}
</style>