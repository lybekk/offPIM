<template>
  <v-card
    v-if="statusList.length" 
    height="20vh"
  >
    <v-card-title>Status</v-card-title>
    <v-card-text>
      <v-progress-circular
        v-if="!total"
        indeterminate
      />
      <v-chip-group column>
        <v-chip
          v-for="status in statusList"
          :key="status"
          :to="`/tasks/list/status${status}`"
          color="secondary"
          class="text-capitalize"
          pill
        >
          <v-avatar 
            left
            :color="`${$store.getters.getStatusColors[status]} `"
          >
            <v-icon>
              {{ $store.getters.getStatusIcons[status] }}
            </v-icon>
          </v-avatar>
          {{ status }}
          <v-avatar
            right
            color="secondary darken-3"
          >
            <small> {{ statusCount(status) }} </small>
          </v-avatar>
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Metricsstatuses",
  data: () => ({}),
  computed: {
    statusList() {
      const list = ["doing", "next", "todo", "plan", "wait"];
      const s = this.$store.getters.getTaskStatuses;
      return list.filter(function(status) {
        return s[status];
      });
    },

    totalOpenTasks() {
      const s = this.$store.getters.getTaskStatuses;
      let sum = s.wait + s.plan + s.todo + s.next + s.doing;
      return sum;
    },

    total() {
      const s = this.$store.getters.getTaskStatuses
      return Object.values(s).reduce(
        (accumulator, currentValue) => accumulator + currentValue, 0
      )
    } 

  },
  mounted() {
    if (!this.total) {
      this.$store.dispatch("getTaskStatuses");
    }
  },
  methods: {
    statusCount: function(status) {
      let list = this.$store.getters.getTaskStatuses;
      return list[status];
    }
  }
};
</script>