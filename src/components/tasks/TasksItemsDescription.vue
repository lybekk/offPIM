<template>
  <v-list-item>
    <v-list-item-icon @click="editable = true">
      <v-icon>mdi-text</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-textarea
        v-if="editable"
        v-model="value"
        label="Edit description"
        autofocus
        rows="3"
        auto-grow
        dense
        @change="setTaskField"
        @blur="editable = false"
      />
      <v-list-item-subtitle
        v-else
        @click="editable = true"
        v-text="taskDescription(task.description)"
      />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "TasksItemsDescription",
  components: {},
  mixins: [pouchMixin],
  props: {
    task: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    newValue: null,
    editable: false,
  }),
  computed: {
    value: {
      get() {
        return this.task.description;
      },
      set(val) {
        this.newValue = val;
      },
    },
  },
  methods: {
    setTaskField: async function () {
      await this.setFieldGeneric({
        _id: this.task._id,
        field: "description",
        value: this.newValue,
      });
      this.$emit("set-doc");
    },
    taskDescription: function (txt) {
      let t = txt;
      if (t == null || t.length == 0) {
        t = "No description";
      }
      return t;
    },
  },
};
</script>
