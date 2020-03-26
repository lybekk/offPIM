<template lang="pug">
v-expansion-panel
  v-expansion-panel-header(v-slot="{ open }")
    v-row(no-gutters)
      v-col Status
      v-col(
        cols="8"
        class="text--secondary"
      )
        v-fade-transition(leave-absolute)
          span(v-if="open") Pick new status
          v-row(
            v-else
            no-gutters
            style="width: 100%"
          )
            v-col
              span.text-capitalize(
                :class="color+'--text'"
              ) {{ task.status }}
  v-expansion-panel-content
    v-slider.text-capitalize(
      :tick-labels="statusList"
      v-model="value"
      :color="color"
      :track-color="colorLighter"
      max="6"
      ticks="always"
      tick-size="4"
      vertical
    )
</template>

<script>

export default {
  name: 'TasksItemsStatus',
  components: {
  },
  props: ["task"],
  data: () => ({
    statusList: [
      'cancelled',
      'wait',
      'plan',
      'todo',
      'next',
      'doing',
      'done'
    ],
  }),
  computed: {
    value: {
      get () {
        const index = this.statusList.findIndex(status => status === this.task.status);
        return index
      },
      set (val) {
        this.$emit('set-status', this.statusList[val])
      }
    },
    color: function () {
      return this.$store.getters.getStatusColors[this.task.status]
    },
    colorLighter: function () {
      return this.$store.getters.getStatusColors[this.task.status] + ' lighten-4'
    }
  },
  methods: {
  }
};

</script>
