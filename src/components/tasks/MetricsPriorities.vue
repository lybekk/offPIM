<template>
  <v-card
    v-if="priorityOpenTasks.length"
    flat
  >
    <v-card-title>Priority</v-card-title>
    <v-divider inset />
    <v-card-text>
      <v-progress-circular
        v-if="!total"
        indeterminate
      />
      <v-chip-group
        column
        active-class="primary--text"
      >
        <v-chip
          v-for="btn in priorityOpenTasks"
          :key="btn.pri"
          :to="`/tasks/list/priority${btn.pri}`"
          class="text-capitalize"
          color="secondary"
          pill
        >
          <v-avatar 
            left
            :color="`${priorityStarColor[btn.pri]} lighten-2`"
          >
            <v-icon>
              mdi-star
            </v-icon>
          </v-avatar>
          {{ btn.pri }}
          <v-avatar
            right
            color="secondary darken-3"
          >
            <small>{{ priorityCount(btn.pri) }}</small>
          </v-avatar>
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Metricspriorities",
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
      return this.priorityOpenTasks.map(item => this.priorityCount(item.pri));
    },

    total() {
    return Object.values(this.$store.getters.getTaskPriorities).reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    )
    }


  },
  mounted() {
    if (!this.total) {
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