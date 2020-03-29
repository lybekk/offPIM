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
    TasksItem
  },
  mixins: [pouchMixin],
  props: {
    source: String
  },
  data: () => ({
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
        use_index: "pimpim_mango_indexes",
        fields: ["_id"]
      };
      if (list.slice(0, 6) == "status") {
        //mango.selector.status = list.slice(6);
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
        mango.selector["$nor"] = [{ status: "cancelled" }, { status: "done" }];
        const pri = list.slice(8);
        mango.selector.priority = parseInt(pri);
      } else if (list.slice(0, 11) == "postponed") {
        mango.selector["$nor"] = [{ status: "cancelled" }, { status: "done" }];
        mango.selector.postponed = { $gt: 5 };
        delete mango.use_index;
      } else if (list.slice(0, 8) == "tomorrow") {
        /*
                mango.selector["$nor"] = [
                    {"status": "cancelled"},
                    {"status": "done"},
                    {"due": null}
                ];
                */
        let today = new Date();
        let dayAfterTomorrowMilli = new Date().setDate(today.getDate() + 2);
        let dayAfterTomorrow = new Date(dayAfterTomorrowMilli);
        /*
                mango.selector.due = {
                    "$gt": today.toISOString().slice(0,10),
                    "$lt": dayAfterTomorrow.toISOString().slice(0,10)
                };
                */
        this.processQuery(
          "pimpim/tasks-due",
          today.toISOString().slice(0, 10),
          dayAfterTomorrow.toISOString().slice(0, 10)
        );
        return;
      } else {
        /*
                mango.selector["$nor"] = [
                    {"status": "cancelled"},
                    {"status": "done"},
                    {"due": null}
                ];
                */
        let d = new Date();
        d.setDate(d.getDate() + 1);
        //mango.selector.due = {"$lt": d.toISOString().slice(0,10)};

        this.processQuery(
          "pimpim/tasks-due",
          "2000-01-01",
          d.toISOString().slice(0, 10)
        );
        return;
      }

      let data = await this.getMango(mango);
      //this.$store.commit('loaderInactive');
      this.tasks = data.docs;
      /*
            try {
                //let data = await window.db.find(mango);
                //console.log(data)
            } catch (error) {
                //this.$store.commit('addAlert', {type:'error',text:error})
            }
            */

      /* old CouchDB code
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(mango)
            })
            .then((resp) => resp.json())
            .then(function(dbData) {
                dbData.docs.forEach( (doc, index) => {
                    vstore.commit('addTask', doc)
                    if (index + 1 == dbData.docs.length) {
                        vstore.commit('toggleLoader');
                    }
                });
                if (dbData.docs.length == 0) {vstore.commit('toggleLoader');}
            })
            .catch(function(error) {
                this.commit('toggleLoader');
                this.commit('addAlert', {type:'error',text: error})
            });
            */
    },
    processQuery: function(view, startKey, endKey) {
      let context = this;
      window.db
        .query(view, {
          startkey: startKey,
          endkey: endKey,
          limit: 50,
          reduce: false
        })
        .then(function(data) {
          data.rows.forEach(row => {
            context.tasks.push({ _id: row.id });
          });
          context.$store.commit("loaderInactive");
        })
        .catch(function(err) {
          context.$store.commit("showSnackbar", { text: err });
          console.log(err);
        });
    }
  }
};
</script>