<template lang="pug">
v-container(fluid)
    v-row
      v-col
        v-card
            v-card-text
              span Displaying {{ tasks.length }} tasks
    div(v-text="list")
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
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "tasksList",
  components: {
    TasksItem,
  },
  mixins: [pouchMixin],
  props: {
    source: String,
  },
  data: () => ({
    tasks: [],
  }),
  computed: {
    list: function() {
      let x = this.$route.params.list;
      if (x) {
        return x;
      }
      return "";
    },
  },
  watch: {
    $route(to) {
      if (to) {
        this.getTaskList();
      }
    },
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
          type: "task",
        },
        limit: 50,
        use_index: "pimpim_mango_indexes",
        fields: ["_id"],
      };
      if (list.slice(0, 6) == "status") {
        this.processQuery(
          "pimpim/task-status-count",
          list.slice(6),
          list.slice(6)
        );
        return;
      } else if (list.slice(0, 7) == "project") {
        mango.selector["$nor"] = [{ status: "cancelled" }, { status: "done" }];
        mango.selector.project = list.slice(7);
      } else if (list.slice(0, 8) == "priority") {
        const pri = parseInt(list.slice(8));
        this.processQuery("pimpim/task-priority-count", pri, pri);
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
          "pimpim/tasks-due",
          today.toISOString().slice(0, 10),
          dayAfterTomorrow.toISOString().slice(0, 10)
        );
        return;
      } else {
        let d = new Date();
        d.setDate(d.getDate() + 1);

        this.processQuery(
          "pimpim/tasks-due",
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
        })
        .then(function(data) {
          data.rows.forEach((row) => {
            context.tasks.push({ _id: row.id });
          });
          context.$store.commit("loaderInactive");
        })
        .catch(function(err) {
          context.$store.commit("showSnackbar", { text: err });
          console.log(err);
        });
    },
  },
};
</script>
