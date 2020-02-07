<template lang="pug">
v-dialog(v-model="dialog" scrollable max-width="400px")
  template(v-slot:activator="{ on }")
    span(
      v-text="task.title"
      v-on="on"
      :class="[ isDone(task._id) ? 'success--text' : '' ]"
    )
  v-card
    v-card-title
      span(class="headline") Edit title
    v-card-text
      v-container
        v-text-field(
          v-model="value"
          label="Title"
        )
    v-card-actions
      v-spacer
      v-btn(color="blue darken-1" text @click="dialog = false") Close
      v-btn(color="blue darken-1" text @click="setTaskField") Save
</template>

<script>

export default {
  name: 'TasksItemsTitle',
  components: {
  },
  props: ["task"],
  data: () => ({
    dialog:false,
    newValue: null
  }),
  computed: {
    value: {
        get () {
          return this.task.title
        },
        set (val) {
          this.newValue = val;
        }
    }
  },
  methods: {
    setTaskField: function () {
      const payload = {
        _id: this.task._id,
        field: 'title',
        value: this.newValue
      };
      this.$store.commit('setTaskField', payload);
      this.dialog = false;
    },
    isDone: function(id) {
      let task = this.$store.getters.getTask(id);
      if (task.status == 'done') {return true}
      return false
    },
  }
};

</script>
