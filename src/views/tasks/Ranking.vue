<template>
  <v-container>
    <h2>Task ranking</h2>
    <v-row>
      <v-col>
        <v-card v-if="mostImportant._id">
          <v-card-title>
            Most important task
          </v-card-title>
          <v-card-text>
            <v-divider />
            <TasksItem
              :docid="mostImportant._id"
              :task-score="mostImportant.score"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>    
    <TasksDataIteratorList
      v-if="itemsLoaded"
      :tasks="rankedItems"
    />
    <v-progress-circular
      v-else
      indeterminate
    />
  </v-container>
</template>

<script>
import TasksDataIteratorList from "@/components/tasks/TasksDataIteratorList.vue";
import taskRanker from "@/components/tasks/taskRanker";
import TasksItem from "@/components/tasks/TasksItem.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
    name: 'TaskRanking',
      components: {
    TasksDataIteratorList,
    TasksItem
  },
  mixins: [pouchMixin],
  data: () => ({
    itemsLoaded: false,
    rankedItems: [],
    mostImportant: {
      score: null,
      _id: null,
    },
  }),
  mounted() {
    this.tasks()
  },
  methods: {

    sortArray: async function(a, b) {
      const bandA = a.score;
      const bandB = b.score;

      let comparison = 0;
      if (bandA > bandB) {
        comparison = 1;
      } else if (bandA < bandB) {
        comparison = -1;
      }
      return comparison;
    },

    tasks: async function() {
      let options = {
          limit: 2000, // consider controlling this value with vuex
          reduce: false,
          include_docs: true,
          keys: ['doing','next','todo','plan','wait'],
      };
      let items = await window.db.query('offpim/task-status-count', options);
        const rankedItems = await taskRanker( items.rows )
        rankedItems.sort(this.sortArray);
        this.mostImportant._id = rankedItems[0]._id;
        this.mostImportant.score = rankedItems[0].score;
        this.itemsLoaded = true;
        this.rankedItems = rankedItems;
      },

  }

}
</script>