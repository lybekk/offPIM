<template>
  <v-menu
    offset-y 
    absolute
  >
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-on="on">
        <v-list-item-icon>
          <v-icon
            :color="$store.getters.getStatusColors[task.status]"
            large
            v-text="$store.getters.getStatusIcons[task.status]"
          />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            <v-chip 
              label
              disabled
              :color="$store.getters.getStatusColors[task.status]"
              class="text-capitalize"
              v-text="task.status"
            />
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-slider
              v-model="value"
              readonly
              :color="color"
              :track-color="colorLighter"
              max="6"
              hide-details
            />
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in statusList"
        :key="index"
        @click="$emit('set-status', item)"
      >
        <v-list-item-avatar>
          <v-icon
            :color="$store.getters.getStatusColors[item]"
            v-text="$store.getters.getStatusIcons[item]"
          />
        </v-list-item-avatar>
        <v-list-item-title class="text-capitalize">
          {{ item }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>

export default {
  name: 'TasksItemsStatus',
  components: {
  },
  props: {
    task: {
      type: Object,
      default: () => {}
    }
  },
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
        const reversedStatusList = [...this.statusList].reverse()
        const index = reversedStatusList.findIndex(status => status === this.task.status);
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
