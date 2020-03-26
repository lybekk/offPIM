<template lang="pug">
v-container(fluid)
    // Project stats
        Time since created
        Number of tasks in project
        tasks done/cancelled vs open tasks (pie chart?)
    //v-row
      v-col
        v-card
            v-card-text
              //-v-btn(
                small
                color="primary"
                @click.stop="drawer = !drawer"
                ) <
                v-icon mdi-menu
              span Displaying { tasks.length }} tasks
    v-card(elevation="0")
        v-card-title(
            class="headline"
        ) Project
            v-spacer
            v-row
              v-col(
                v-for="(value, key) in statuses"
                :class="[value == 0 ? 'fadedIfStatusZero': '']"
              )
                v-progress-circular(
                  size="100"
                  width="15"
                  :value="statusValuePercent(key)"
                  :color="$store.getters.getStatusColors[key]"
                ) {{ value }}
                //:indeterminate="statusesLoading"
                p(class="overline") {{ key }}
            v-spacer
            tasks-project-archival(
                v-bind:project="details"
                v-bind:tasks="tasks"
                @get-project="getProject"
            )
    v-row
        v-col
            TasksItem(
                v-if="details._id"
                v-bind:docid="details._id"
            )
    v-card(
      v-if="this.$store.getters.loaderState"
      elevation="0"
    )
        v-card-text
            v-row
                v-col(cols="1") Getting tasks
                v-col
                    v-progress-linear(
                      color="warning"
                      buffer-value="0"
                      stream
                    )
    v-card(
      v-else
      elevation="0"
    )
        v-card-title(
          class="headline"
        ) {{ tasks.length }} Tasks in project 
          span(class="font-weight-thin") {{ details.project }}
    v-skeleton-loader(
      :loading="this.$store.getters.loaderState"
      class="mx-auto"
      transition="scale-transition"
      type="article"
    )
        v-data-iterator(
            :items="tasks"
            :loading="this.$store.getters.loaderState"
            loading-text="Getting tasks"
            no-data-text="No tasks matching request"
        )
            //- don't use group-by="status". Reorders tasks on status change, making task lose fokus
            template(v-slot:default="props")
                v-row
                    v-col(
                    v-for="doc in props.items"
                    :key="doc._id"
                    cols="12"
                    sm="12"
                    md="12"
                    lg="6"
                    )
                        TasksItem(v-bind:docid="doc._id")
</template>

<script>
import TasksItem from "@/components/tasks/TasksItem.vue";
import TasksProjectArchival from "@/components/tasks/TasksProjectArchival.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "tasksProject",
  components: {
    TasksItem,
    TasksProjectArchival
  },
  mixins: [pouchMixin],
  props: ["projectid"],
  data: () => ({
    details: {
    },
    tasks: [],
    statuses: {
      wait: 0,
      plan: 0,
      todo: 0,
      next: 0,
      doing: 0,
      done: 0,
      cancelled: 0,
    },
    statusesLoading: true
  }),
  computed: {
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
      if ( x === 0) return 0;
      //const filteredArray = this.tasks.filter( obj => obj.status === key );
      return Math.floor(( x / this.tasks.length ) * 100)
    },
    fillCircles: async function() { //countStatuses
      const keys = Object.keys( this.statuses );

      for await (let key of keys) {
        const filteredArray = this.tasks.filter( obj => obj.status === key )
        this.statuses[key] = filteredArray.length
      }
      //consider charts.js or vuetify circular progress 
    },
    getProject: async function() {
      this.details = {};
      this.tasks = [];
      this.details = await this.getDoc(this.projectid);
      this.getTasks();
    },
    resetStatuses: function() {
      for (let x of Object.keys(this.statuses) ) {
        console.log(x);
        this.statuses[x] = 0
      }
    },
    getTasks: async function() {
      this.resetStatuses();
      this.$store.commit("loaderActive");
      let mango = {
        selector: {
          //realm: "productivity",
          productivity: true,
          type: "task",
          project: this.projectid
        },
        limit: 1000,
        //"use_index": "pimpim_mango_indexes",
        fields: ["_id","status"]
        /*
                "sort": [
                    { "due": "asc" },
                    { "priority": "asc" }
                ]
                */
      };
      try {
        let data = await window.db.find(mango);
        this.tasks = data.docs;
        this.fillCircles()
      } catch (error) {
        this.$store.commit("addAlert", { type: "error", text: error });
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