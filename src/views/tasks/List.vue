<template>
  <TasksDataIteratorList :tasks="tasks" />
</template>

<script>
import TasksDataIteratorList from "@/components/tasks/TasksDataIteratorList.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "TasksList",
  components: {
    TasksDataIteratorList
  },
  mixins: [pouchMixin],
  data: () => ({
    tasks: []
  }),
  watch: {
    $route(to) {
      if (to) {
        this.getTaskList();
      }
    }
  },
  mounted() {
    this.getTaskList();
  },
  methods: {
    getTaskList: async function() {
      this.tasks = [];
      let list = this.$route.params.list;
      this.$store.commit("loaderActive");
      let mango = {
        selector: {
          productivity: true,
          type: "task"
        },
        limit: 100,
        use_index: "offpim_mango_indexes"
      };

      if (list.slice(0, 6) == "status") {
        this.processQuery(
          "offpim/task-status-count",
          list.slice(6),
          list.slice(6)
        );
        return;
      /* WAIT: May be redundant code. Further testing required
        } else if (list.slice(0, 7) == "project") {
          mango.selector["$nor"] = [{ status: "cancelled" }, { status: "done" }];
          mango.selector.project = list.slice(7);
      */
      } else if (list.slice(0, 8) == "priority") {
        const pri = parseInt(list.slice(8));
        this.processQuery("offpim/task-priority-count", pri, pri);
        return;
      } 

      switch(list) {
        case "postponed":
          mango.selector["$nor"] = [{ status: "cancelled" }, { status: "done" }];
          mango.selector.postponed = { $gt: 5 };
          delete mango.use_index;
          break;          
        case "tomorrow": {
          let today = new Date();
          let dayAfterTomorrowMilli = new Date().setDate(today.getDate() + 2);
          let dayAfterTomorrow = new Date(dayAfterTomorrowMilli);
          this.processQuery(
            "offpim/tasks-due",
            today.toISOString().slice(0, 10),
            dayAfterTomorrow.toISOString().slice(0, 10)
          );
          return;
        }
        case 'noproject':
          mango.selector["$nor"] = [{ status: "cancelled" }, { status: "done" }];
          mango.selector["project"] = null;
          delete mango.use_index;
          break
        default: {
          let d = new Date();
          d.setDate(d.getDate() + 1);
          this.processQuery(
            "offpim/tasks-due",
            "2000-01-01",
            d.toISOString().slice(0, 10)
          );
          return;
        }
      }

      let data = await this.getMango(mango);
      this.tasks = data.docs;
      if (this.tasks.length == 0) {
        this.returnToOverview();
      }
    },

    processQuery: function(view, startKey, endKey) {
      let context = this;
      window.db
        .query(view, {
          startkey: startKey,
          endkey: endKey,
          limit: 200,
          reduce: false,
          include_docs: true
        })
        .then(function(data) {
          if (data.rows.length == 0) {
            context.returnToOverview();
          } else {
            data.rows.forEach(row => {
              context.tasks.push(row.doc);
            });
          }
          context.$store.commit("loaderInactive");
        })
        .catch(function(error) {
          context.$store.dispatch("infoBridge", {
            color: "error",
            text: error,
            level: "error"
          });
        });
    },

    returnToOverview: function() {
      this.$router.push({ name: "tasksOverview" });
      this.$store.dispatch("infoBridge", {
        color: "info",
        text: "No tasks in list"
      });
    }
  }
};
</script>
