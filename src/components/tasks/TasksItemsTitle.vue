<template>
  <div style="width:80%;">
    <v-text-field
      v-if="editable"
      v-model="value"
      autofocus
      label="Edit title"
      @change="setTaskField"
      @blur="editable = false"
    />
    <span
      v-else
      :class="[status == 'done' ? 'subheading success--text' : 'subheading font-weight-regular']"
      @click="editable = true"
      v-text="titleFormatted"
    />
  </div>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "TasksItemsTitle",
  components: {},
  mixins: [pouchMixin],
  props: {
    id: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    dialog: false,
    newValue: null,
    editable: false,
  }),
  computed: {
    value: {
      get() {
        return this.title;
      },
      set(val) {
        this.newValue = val;
      },
    },
    titleFormatted() {
      let t = this.title;
      if (t == null || t.length == 0) {
        t = "No title";
      }
      return t;
    },
  },
  methods: {
    setTaskField: async function () {
      await this.setFieldGeneric({
        _id: this.id,
        field: "title",
        value: this.newValue,
      });
      this.dialog = false;
      this.$emit("set-doc");
    },
  },
};
</script>
