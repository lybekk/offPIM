<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span
              v-if="totalOpenTasks"
              class="headline"
            >{{ totalOpenTasks }} <span class="title">open tasks</span></span><span
              v-else
              class="headline"
            >No open tasks</span>
            <v-spacer />
            <div class="text-center">
              <v-chip
                v-for="chip in chipsFiltered"
                :key="chip.aggregate"
                class="ma-2"
                :to="chip.to"
                :color="chip.color"
                :text-color="chip.textColor"
                label
              >
                <span>{{ chip.text }}</span>
                <v-avatar
                  right
                  :class="`${chip.color} darken-2`"
                >
                  {{ getTasksAggregate[chip.aggregate] }}
                </v-avatar>
              </v-chip>
            </div>
            <v-spacer />
            <v-btn
              color="secondary"
              @click="$store.commit('setRightDrawer', true)"
            >
              Projects
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <MetricsStatuses />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <MetricsPriorities />
      </v-col>
      <v-col cols="12">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title font-regular">
                Other task lists
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset />
          <v-list-item
            link
            to="/tasks/completed_projectless"
          >
            <v-list-item-icon>
              <v-icon>mdi-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Completed & projectless</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            link
            to="/tasks/list/noproject"
          >
            <v-list-item-icon>
              <v-icon>mdi-folder-alert</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>No project</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12">
        <DoneToday />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MetricsStatuses from "@/components/tasks/MetricsStatuses.vue";
import MetricsPriorities from "@/components/tasks/MetricsPriorities.vue";
import DoneToday from "@/components/tasks/DoneToday.vue";

import { mapGetters } from "vuex";

export default {
  name: "Tasksoverview",
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