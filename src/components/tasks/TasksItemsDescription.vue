<template lang="pug">
v-dialog(v-model="dialog" scrollable max-width="400px")
  template(v-slot:activator="{ on }")
    v-list-item(v-on="on" )
      v-list-item-icon
        v-icon mdi-text
      v-list-item-content
        v-list-item-subtitle(
          v-text="taskDescription(task.description)" 
          )
  v-card
    v-card-title
    v-card-text
      v-container
        v-textarea(
          v-model="value"
          label="Description"
          autofocus
          rows="3"
          auto-grow
          dense
        )
    v-card-actions
      v-spacer
      v-btn(color="blue darken-1" text @click="dialog = false") Close
      v-btn(color="blue darken-1" text @click="setTaskField") Save
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "TasksItemsDescription",
  components: {},
  mixins: [pouchMixin],
  props: ["task"],
  data: () => ({
    dialog: false,
    newValue: null
  }),
  computed: {
    value: {
      get() {
        return this.task.description;
      },
      set(val) {
        this.newValue = val;
      }
    }
  },
  methods: {
    setTaskField: async function() {
      await this.setFieldGeneric({
        _id: this.task._id,
        field: "description",
        value: this.newValue
      });
      this.dialog = false;
      this.$emit("set-doc");
    },
    taskDescription: function(txt) {
      let t = txt;
      if (t == null || t.length == 0) {
        t = "No description";
      }
      return t;
    }
  }
};
</script>
