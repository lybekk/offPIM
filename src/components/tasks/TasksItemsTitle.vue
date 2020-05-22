<template lang="pug">
v-dialog(v-model="dialog" scrollable max-width="400px")
  template(v-slot:activator="{ on }")
    span(
      v-text="titleFormatted"
      v-on="on"
      :class="[ status == 'done' ? 'subheading success--text' : 'subheading font-weight-regular' ]"
    )
  v-card
    v-card-title
      span(class="headline") Edit title
    v-card-text
      v-container
        v-text-field(
          v-model="value"
          autofocus
          label="Title"
        )
    v-card-actions
      v-spacer
      v-btn(color="blue darken-1" text @click="dialog = false") Close
      v-btn(color="blue darken-1" text @click="setTaskField") Save
</template>

<script>
import pouchMixin from '@/mixins/pouchMixin'

export default {
  name: 'TasksItemsTitle',
  components: {
  },
  mixins: [pouchMixin],
  props: ["id","title","status"],
  data: () => ({
    dialog:false,
    newValue: null
  }),
  computed: {
    value: {
        get () {
          return this.title
        },
        set (val) {
          this.newValue = val;
        }
    },
    titleFormatted() {
      let t = this.title;
      if (t == null || t.length == 0) {
          t = "No title";
      }
      return t
    }
  },
  methods: {
    setTaskField: async function () {
      await this.setFieldGeneric({
        _id: this.id,
        field: 'title',
        value: this.newValue
      });
      this.dialog = false;
      this.$emit('set-doc')
    },
  }
};

</script>
