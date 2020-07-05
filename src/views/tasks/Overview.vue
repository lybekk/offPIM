<template lang="pug">
v-container
    v-row
        v-col(cols="12")
            v-card
                v-card-title 
                    span.headline(
                        v-if="totalOpenTasks"
                    ) {{ totalOpenTasks }} 
                        span.title open tasks
                    span.headline(v-else) No open tasks
                    v-spacer
                    div.text-center
                      v-chip(
                        v-for="chip in chipsFiltered"
                        :key="chip.aggregate"
                        class="ma-2"
                        :to="chip.to"
                        :color="chip.color"
                        :text-color="chip.textColor"
                        label
                      )
                        v-avatar(
                          left
                          :class="`${chip.color} darken-2`"
                        ) {{ getTasksAggregate[chip.aggregate] }}
                        span {{ chip.text }}
                    v-spacer
                    v-btn(
                        color="secondary"
                        @click="$store.commit('setRightDrawer', true)"
                    ) Projects
        v-col(cols="12" sm="6")
          metrics-statuses
        v-col(cols="12" sm="6")
          metrics-priorities
        v-col(cols="12")
          v-list
              v-list-item
                  v-list-item-content
                      v-list-item-title.title.font-regular Other task lists
              v-divider(inset)
              v-list-item(link to="/tasks/completed_projectless")
                  v-list-item-icon
                      v-icon mdi-check
                  v-list-item-content
                      v-list-item-title Completed & projectless
              v-list-item(link to="/tasks/list/noproject")
                  v-list-item-icon
                      v-icon mdi-folder-alert
                  v-list-item-content
                      v-list-item-title No project
        v-col(cols="12")
          DoneToday
</template>

<script>
import MetricsStatuses from "@/components/tasks/MetricsStatuses.vue";
import MetricsPriorities from "@/components/tasks/MetricsPriorities.vue";
import DoneToday from "@/components/tasks/DoneToday.vue";

import { mapGetters } from "vuex";

export default {
  name: "tasksoverview",
  components: {
    MetricsStatuses,
    MetricsPriorities,
    DoneToday
  },
  data: () => ({
    chips: [
      {
        aggregate: "today",
        text: "Due today",
        color: "warning",
        textColor: "white",
        to: { name: "tasksList", params: { list: "today" } }
      },
      {
        aggregate: "overdue",
        text: "Overdue",
        color: "error",
        textColor: "white",
        to: { name: "tasksList", params: { list: "today" } }
      },
      {
        aggregate: "tomorrow",
        text: "Due tomorrow",
        color: "info",
        textColor: "white",
        to: { name: "tasksList", params: { list: "tomorrow" } }
      }
    ]
  }),
  computed: {
    ...mapGetters(["getTasksAggregate"]),
    totalOpenTasks() {
      const s = this.$store.getters.getTaskStatuses;
      let sum = s.wait + s.plan + s.todo + s.next + s.doing;
      return sum;
    },

    chipsFiltered() {
      return this.chips.filter(chip => {
        return this.getTasksAggregate[chip.aggregate] > 0;
      });
    }
  }
};
</script>