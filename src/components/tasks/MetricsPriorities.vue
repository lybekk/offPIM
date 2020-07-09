<template>
<v-card v-if="priorityOpenTasks.length">
    <v-card-title> By priority</v-card-title>
    <v-card-text>
        <v-chip-group column active-class="primary--text">
          <v-chip
                v-for="btn in priorityOpenTasks"
                :key="btn.pri"
                :to="`/tasks/list/priority${btn.pri}`"
              class="text-capitalize"
                        :color="priorityStarColor[btn.pri]"
          >
            <v-avatar left>
              <v-icon>mdi-star</v-icon>
            </v-avatar>
            {{ btn.pri }}
            <v-avatar right :class="`${priorityStarColor[btn.pri]} darken-1`">
                <small> {{ priorityCount(btn.pri) }} </small>
            </v-avatar>            
          </v-chip>
        </v-chip-group>
    </v-card-text>
</v-card>
</template>

<script>
export default {
  name: "metricspriorities",
  data: () => ({
    priorityButtons: [
      { pri: 1, title: "Important & urgent" },
      { pri: 2, title: "Important, not urgent" },
      { pri: 3, title: "Not important, but urgent" },
      { pri: 4, title: "Not important & not urgent" }
    ],
    priorityStarColor: {
      1: "error",
      2: "warning",
      3: "primary",
      4: "secondary"
    }
  }),
  computed: {
    priorityOpenTasks() {
      const s = this.$store.getters.getTaskPriorities;
      return this.priorityButtons.filter(function(obj) {
        return s[obj.pri];
      });
    },
    /** TODO: Move to Vuex
     */
    totalOpenTasks() {
      const s = this.$store.getters.getTaskStatuses;
      let sum = s.wait + s.plan + s.todo + s.next + s.doing;
      return sum;
    },

    priorityValues() {
      return this.priorityOpenTasks.map(item => this.priorityCount(item.pri) )
    },
  },
  mounted() {
    const s = this.$store.getters.getTaskPriorities;
    let total = Object.values(s).reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    if (!total) {
      this.$store.dispatch("getTaskPriorities");
    }

  },
  methods: {
    priorityCount: function(priority) {
      let list = this.$store.getters.getTaskPriorities;
      return list[priority];
    }
  }
};
</script>