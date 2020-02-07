<template lang="pug">
v-expansion-panel
  v-expansion-panel-header(v-slot="{ open }")
    v-row(no-gutters)
      v-col Priority
      v-col(
        cols="8"
        class="text--secondary"
      )
        v-fade-transition(leave-absolute)
          span(v-if="open") Choose new priority
          v-row(
            v-else
            no-gutters
            style="width: 100%"
          )
            v-col.text-capitalize {{ task.priority }}
              v-icon(:color="priorityStarColor[task.priority]") mdi-star
  v-expansion-panel-content
    v-container(fluid)
      v-radio-group(row v-model="radioGroup")
        v-tooltip(
          v-for="n in 4" 
          top
          :key="n"
        )
          template(v-slot:activator="{ on }")
            v-radio(
              :label="`${n}`"
              :value="n"
              :color="priorityStarColor[n]"
              on-icon="mdi-star"
              off-icon="mdi-star-outline"
              v-on="on"
            )
          span(v-text="priorityTooltip[n]")

</template>

<script>

export default {
  name: 'TasksItemsPriority',
  components: {
  },
  props: ["task"],
  data: () => ({
    priorityStarColor: {
      1:'error',
      2:'warning',
      3:'primary',
      4:'secondary'
    },
    priorityTooltip: {
      1: 'Important and urgent',
      2: 'Important but not urgent',
      3: 'Not important but urgent',
      4: 'Not important and not urgent'
    }
  }),
  computed: {
    radioGroup: {
        get () {
          return this.task.priority
        },
        set (pri) {
          this.setTaskField(pri)
        }
    },
  },
  methods: {
    setTaskField: function (pri) {
      const payload = {
        _id: this.task._id,
        field: 'priority',
        value: pri
      };
      this.$store.commit('setTaskField', payload);
    },
  }
};

</script>
