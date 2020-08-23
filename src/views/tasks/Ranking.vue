<template>
  <div>
    <TasksDataIteratorList
      v-if="itemsLoaded"
      :tasks="rankedItems"
    />
    <v-progress-circular
      v-else
      indeterminate
    />
  </div>
</template>

<script>
import TasksDataIteratorList from "@/components/tasks/TasksDataIteratorList.vue";
import taskRanker from "@/components/tasks/taskRanker";
import pouchMixin from "@/mixins/pouchMixin";

export default {
    name: 'TaskRanking',
      components: {
    TasksDataIteratorList,
  },
  mixins: [pouchMixin],
  data: () => ({
    itemsLoaded: false,
    rankedItems: [],
  }),
  mounted() {
    this.tasks()
  },
  methods: {

    tasks: async function() {
      let options = {
          limit: 2000, // consider controlling this value with vuex
          reduce: false,
          include_docs: true,
          keys: ['doing','next','todo','plan','wait'],
      };
      let items = await window.db.query('offpim/task-status-count', options);
        const rankedItems = await taskRanker( items.rows )
        this.itemsLoaded = true;
        this.rankedItems = rankedItems;
      },

  }

}
</script>