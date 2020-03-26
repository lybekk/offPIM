<template lang="pug">
v-container(fluid)
  v-row
    v-dialog(v-model="dialog" scrollable max-width="300px")
      template(v-slot:activator="{ on }")
        div(class="text-center" text v-on="on")
          p(v-if="task.tags.length == 0") No tags
          v-chip(
            v-for="tag in task.tags"
            v-else
            :key="tag"
            class="ma-2"
            small
            v-text="tag"
          )
      v-card
        v-card-title Edit tags
        v-divider
        v-card-text
          v-col(cols="12")
            v-combobox(
              v-model="taskTags"
              :items="tagsListItems"
              label="Tags"
              multiple
              chips
              dense
            )
        v-divider
        v-card-actions
          v-btn(color="blue darken-1" text @click="dialog = false") Close
          v-btn(color="blue darken-1" text @click="setTaskField") Save
</template>

<script>
import pouchMixin from '@/mixins/pouchMixin'

export default {
  name: 'TasksItemsTags',
  components: {
  },
  mixins: [pouchMixin],
  props: ["task"],
  data: () => ({
    dialog:false,
    updatedTags: null
  }),
  computed: {
    tagsListItems: function () {
      let tl = this.$store.getters.getTagList;
        
      let a = tl.map(obj => {
        return obj.key
      })

      return a;
    },
    taskTags: {
        get () {
          return this.task.tags
        },
        set (tags) {
          this.updatedTags = tags;
        }
    },
  },
  methods: {
    setTaskField: async function () {
      await this.setFieldGeneric({
        _id: this.task._id,
        field: 'tags',
        value: this.updatedTags
      });
      this.dialog = false;
      this.$emit('set-doc')
    },
  }
};

</script>
