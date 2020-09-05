<template>
  <v-container fluid="fluid">
    <v-row>
      <v-dialog
        v-model="dialog"
        scrollable
        max-width="300px"
      >
        <template v-slot:activator="{ on }">
          <div
            class="text-center"
            text
            v-on="on"
          >
            <v-divider />
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-tag</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle v-if="task.tags.length == 0">
                  No tags
                </v-list-item-subtitle>
                <v-list-item-subtitle v-else>
                  <v-chip
                    v-for="tag in task.tags"
                    :key="tag"
                    class="ma-1"
                    v-text="tag"
                  />
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>
        </template>
        <v-card>
          <v-card-title>
            Edit tags
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-col cols="12">
              <v-combobox
                v-model="taskTags"
                :items="tagsListItems"
                label="Tags"
                multiple
                chips
                dense
              />
            </v-col>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn
              color="blue darken-1"
              text
              @click="dialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="setTaskField"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "TasksItemsTags",
  components: {},
  mixins: [pouchMixin],
  props: {
    task: {
      type: Object,
      default: () => {},
    }
  },
  data: () => ({
    dialog: false,
    updatedTags: null,
  }),
  computed: {
    tagsListItems: function () {
      let tl = this.$store.getters.getTagList;

      let a = tl.map((obj) => {
        return obj.key;
      });

      return a;
    },
    taskTags: {
      get() {
        return this.task.tags;
      },
      set(tags) {
        this.updatedTags = tags;
      },
    },
  },
  methods: {
    setTaskField: async function () {
      await this.setFieldGeneric({
        _id: this.task._id,
        field: "tags",
        value: this.updatedTags,
      });
      this.dialog = false;
      this.$emit("set-doc");
    },
  },
};
</script>
