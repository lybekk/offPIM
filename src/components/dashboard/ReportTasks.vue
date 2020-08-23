<template>
  <v-list-item
    v-if="today || overdue"
    :to="{ name: 'tasksList', params: { list: 'today' } }"
  >
    <v-list-item-icon>
      <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>
        <span
          v-text="encouragement"
        />
        <span
          v-if="today"
          v-text="` ${today}`"
        />
        <span>
          <span
            v-if="overdue"
            class="error--text font-weight-black"
          > {{ overdue.count }}
          </span>
          <span>
            {{ overdue.text }}
          </span>
        </span>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "ReportTasks",
  computed: {
    ...mapGetters({
      ta: 'getTasksAggregate'
    }),
    today() {
        let tod = this.ta.today;
        return tod == 0 ? null
            : tod == 1 ? `Only ${tod} task due today.`
            : tod >= 10 ? `$${tod} tasks ahead.`
            : tod < 10 ? `You have ${tod} tasks due today.`
            : null;
    },

    encouragement() {
      const encouragements = [
        "Buckle up!",
        "Strap up!",
        "Roll up your sleeves.",
      ];
      return encouragements[Math.floor(Math.random() * encouragements.length)];
    },

    overdue() {
        let tov = this.ta.overdue;
        if (tov != 0) {
            return {
              count: tov,
              text: 'overdue',
            }
        } else {
            return null;
        }
    },
  },
};
</script>