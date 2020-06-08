<template lang="pug">
v-card(v-if="priorityOpenTasks.length")
    v-card-title Tasks by priority
    v-card-text
        v-list
            v-list-item(
                v-for="btn in priorityOpenTasks"
                :key="btn.pri"
                :to="`/tasks/list/priority${btn.pri}`"
                @click="prioritySheet = false"
            )
                v-list-item-avatar
                  v-tooltip(bottom)
                    template(v-slot:activator="{ on }")
                      v-icon(
                        v-on="on"
                        :color="priorityStarColor[btn.pri]"
                        ) mdi-star
                    span {{ btn.title }}
                v-list-item-content
                    v-badge(
                        :color="priorityStarColor[btn.pri]"
                        :content="priorityCount(btn.pri)"
                        inline
                    )
                      v-list-item-title
                        span.subtitle-2(
                          :class="`${priorityStarColor[btn.pri]}--text`"                                
                        ) {{ btn.pri }})
                    v-list-item-subtitle
                        v-progress-linear(
                            :color="priorityStarColor[btn.pri]"
                            :value="priorityCount(btn.pri) * 100 / totalOpenTasks"
                            rounded
                        )

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
    }
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