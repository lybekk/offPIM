<template lang="pug">
v-container(
  :fluid="$vuetify.breakpoint.mdAndDown"
  )
  v-skeleton-loader(
      :loading="this.$store.getters.loaderState"
      class="mx-auto"
      transition="scroll-y-reverse-transition"
      type="list-item-avatar-two-line"
      
  )
    //- INFO - don't use group-by="status". Reorders tasks on status change, making task lose fokus
    v-data-iterator(
        :items="tasks"
        item-key="_id"
        :search="search"
        :loading="this.$store.getters.loaderState"
        loading-text="Getting tasks"
        no-data-text="No tasks matching request"
        :sort-by="sortBy.toLowerCase()"
    )
      template(v-slot:header)
        v-toolbar(
          color="transparent"
          class="mb-1"
          flat
          )
          v-text-field(
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Filter list"
          )
          v-spacer
          v-select(
            v-model="sortBy"
            flat
            solo-inverted
            hide-details
            :items="keys"
            prepend-inner-icon="mdi-sort-variant"
            label="Sort by"
          )
            //-darken-3
      template(v-slot:default="props")
        v-list(three-line)
          tasks-item(
            v-for="doc in props.items"
            :key="doc._id"
            v-bind:docid="doc._id"
            )
</template>

<script>
import TasksItem from "@/components/tasks/TasksItem.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "tasksList",
  components: {
    TasksItem
  },
  mixins: [pouchMixin],
  props: {
    source: String
  },
  data: () => ({
    search: "",
    sortBy: "due",
    keys: ["Due", "Status", "Priority", "Project"],
    tasks: []
  }),
  computed: {
    list: function() {
      let x = this.$route.params.list;
      if (x) {
        return x;
      }
      return "";
    }
  },
  watch: {
    $route(to) {
      if (to) {
        this.getTaskList();
      }
    }
  },
  created() {},
  mounted() {
    this.getTaskList();
  },
  beforeDestroy() {},
  methods: {
    getTaskList: async function() {
      this.tasks = [];
      let list = this.list;
      this.$store.commit("loaderActive");
      let mango = {
        selector: {
          productivity: true,
          type: "task"
        },
        limit: 50,
        use_index: "offpim_mango_indexes",
        fields: ["_id"]
      };
      if (list.slice(0, 6) == "status") {
        this.processQuery(
          "offpim/task-status-count",
          list.slice(6),
          list.slice(6)
        );
        return;
      } else if (list.slice(0, 7) == "project") {
        mango.selector["$nor"] = [{ status: "cancelled" }, { status: "done" }];
        mango.selector.project = list.slice(7);
      } else if (list.slice(0, 8) == "priority") {
        const pri = parseInt(list.slice(8));
        this.processQuery("offpim/task-priority-count", pri, pri);
        return;
      } else if (list.slice(0, 11) == "noproject") {
        mango.selector["$nor"] = [{ status: "cancelled" }, { status: "done" }];
        mango.selector["project"] = null;
        delete mango.use_index;
      } else if (list.slice(0, 11) == "postponed") {
        mango.selector["$nor"] = [{ status: "cancelled" }, { status: "done" }];
        mango.selector.postponed = { $gt: 5 };
        delete mango.use_index;
      } else if (list.slice(0, 8) == "tomorrow") {
        let today = new Date();
        let dayAfterTomorrowMilli = new Date().setDate(today.getDate() + 2);
        let dayAfterTomorrow = new Date(dayAfterTomorrowMilli);
        this.processQuery(
          "offpim/tasks-due",
          today.toISOString().slice(0, 10),
          dayAfterTomorrow.toISOString().slice(0, 10)
        );
        return;
      } else {
        let d = new Date();
        d.setDate(d.getDate() + 1);

        this.processQuery(
          "offpim/tasks-due",
          "2000-01-01",
          d.toISOString().slice(0, 10)
        );
        return;
      }

      let data = await this.getMango(mango);
      this.tasks = data.docs;
    },
    processQuery: function(view, startKey, endKey) {
      let context = this;
      window.db
        .query(view, {
          startkey: startKey,
          endkey: endKey,
          limit: 50,
          reduce: false,
          include_docs: true
        })
        .then(function(data) {
          data.rows.forEach(row => {
            context.tasks.push(row.doc);
          });
          context.$store.commit("loaderInactive");
        })
        .catch(function(error) {
          this.$store.dispatch("infoBridge", {
            color: "error",
            text: error,
            level: "error"
          });
        });
    }
  }
};
</script>
