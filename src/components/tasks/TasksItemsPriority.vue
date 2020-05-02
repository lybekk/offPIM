<template lang="pug">
div(class="text-center")
  v-menu(
    v-model="menu"    
    left
    offset-y
  )
    template(v-slot:activator="{ on }")
      v-btn(
        icon
        v-on="on"
      )
        v-icon(:color="priorityStarColor[task.priority]") mdi-star
    v-card
      v-container(fluid)
        v-radio-group(v-model="radioGroup")
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
import pouchMixin from '@/mixins/pouchMixin'

export default {
  name: 'TasksItemsPriority',
  components: {
  },
  mixins: [pouchMixin],
  props: ["task"],
  data: () => ({
    menu: false,
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
    setTaskField: async function (pri) {
      await this.setFieldGeneric({
        _id: this.task._id,
        field: 'priority',
        value: pri
      });
      this.$emit('set-doc')
    },

  }
};

</script>
