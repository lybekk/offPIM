<template lang="pug">
v-slider(
  v-model="value"
  readonly
  :color="color"
  :track-color="colorLighter"
  max="6"
  left
)
  template(v-slot:prepend)
    v-menu(offset-y)
      template(v-slot:activator="{ on }")
        v-btn(
          rounded
          v-on="on"
          :color="$store.getters.getStatusColors[task.status]"
        ) {{ task.status }}
      v-list
        v-list-item(
          v-for="(item, index) in statusList"
          :key="index"
          @click="$emit('set-status', item)"
        )
          v-list-item-avatar
            v-icon(
              v-text="$store.getters.getStatusIcons[item]"
              :color="$store.getters.getStatusColors[item]"
            )
          v-list-item-title.text-capitalize {{ item }}
</template>

<script>

export default {
  name: 'TasksItemsStatus',
  components: {
  },
  props: ["task"],
  data: () => ({
    menu: false,
    statusList: [
      'done',
      'doing',
      'next',
      'todo',
      'plan',
      'wait',
      'cancelled',
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
