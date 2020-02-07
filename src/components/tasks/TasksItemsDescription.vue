<template lang="pug">
v-dialog(v-model="dialog" scrollable max-width="400px")
  template(v-slot:activator="{ on }")
    span(v-text="taskDescription(task.description)" v-on="on")
  v-card
    v-card-title
      span(class="headline") Edit description
    v-card-text
      v-container
        v-textarea(
          v-model="value"
          label="Description"
          rows="3"
          auto-grow
          filled
          dense

        )
    v-card-actions
      v-spacer
      v-btn(color="blue darken-1" text @click="dialog = false") Close
      v-btn(color="blue darken-1" text @click="setTaskField") Save
</template>

<script>

export default {
  name: 'TasksItemsDescription',
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
          return this.task.description
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
        field: 'description',
        value: this.newValue
      };
      this.$store.commit('setTaskField', payload);
      this.dialog = false;
    },
    taskDescription: function(txt) {
      let t = txt;
      if (t == null || t.length == 0) {
          t = "No description";
      }
      return t
    }
  }
};

</script>
