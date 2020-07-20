<template>
  <v-container>
    <v-card flat>
      <v-card-title>
        <v-spacer />
        <SubmitButton :doc="doc" />
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="newNote.title"
                label="Title"
                autofocus
                filled
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="newNote.description"
                label="Description"
                filled
              />
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="newNote.tags"
                :items="tagsListItems"
                label="Tags"
                multiple
                chips
                filled
              />
            </v-col>
          </v-row>
        </v-container><small>*indicates required field</small>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import SubmitButton from "@/components/form/submit";

export default {
  name: "FormsNewNote",
  components: {
    SubmitButton
  },
  data: () => ({
    newNote: {
      title: "",
      description: "",
      tags: [],
      productivity: true,
      type: "note",
      priority: 4,
      status: "plan",
      project: null,
      due: null,
      end: null,
      context: null
    }
  }),
  computed: {
    tagsListItems: function() {
      let tl = this.$store.getters.getTagList;
      let a = tl.map(obj => {
        return obj.key;
      });
      return a;
    },
    doc() {
      const doc = { ...this.newNote };
      doc.created = new Date().toISOString();
      doc.start = new Date().toISOString();
      return doc;
    }
  },
  mounted() {
    if (!this.$store.getters.getTagList.length) {
      this.$store.dispatch("populateTagsList", 'offpim/note-tag-count');
    }
  }
};
</script>