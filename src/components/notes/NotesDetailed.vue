<template lang="pug">
    v-bottom-sheet(
        v-model="dialogItemDetailed"
        :inset="$vuetify.breakpoint.mdAndUp"
        scrollable
    )
        v-card
            v-card-text
                v-container
                    v-row
                        v-col
                            v-text-field(
                                :value="selectedNote.title"
                                label="Title"
                                class="title"
                                @change="setDocField('title',$event)"
                            )
                            v-textarea(
                                :value="selectedNote.description"
                                rows="2"
                                auto-grow
                                label="Description"
                                @change="setDocField('description',$event)"
                            )
                            v-combobox(
                                v-model="tags"
                                :items="tagsListItems"
                                label="Tags"
                                multiple
                                chips
                                @change="setDocField('tags',$event)"
                            )
                              //- TODO: Implement another setDocField for arrays, like tags, with validation
                    v-row
                        v-col
                            p(v-text="selectedNote._id")
            v-card-actions
              v-spacer
              v-btn(
                  class="mt-6"
                  text
                  color="primary"
                  @click="archiveNote"
              ) Archive
              v-btn(
                  class="mt-6"
                  text
                  color="error"
                  @click="deleteNote"
              ) Delete
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";
import itemDetailedMixin from "@/mixins/itemDetailedMixin";

export default {
  name: "NotesDetailed",
  mixins: [pouchMixin, itemDetailedMixin],
  computed: {
    selectedNote() {
      return this.$store.getters.selectedDoc;
    },
    tags: {
      get: function() {
        return this.selectedNote.tags;
      },
      set: function(tags) {
        this.selectedNote.tags = tags;
      }
    },
    tagsListItems: function() {
      let tl = this.$store.getters.getTagList;
      let arr = [];
      for (let t of tl) {
        arr.push(t.key);
      }
      return arr;
    }
  },
  methods: {
    hideNote: function() {
      this.$store.commit("dialogItemDetailedHide");
    },
    archiveNote: async function() {
      let doc = await this.getDoc(this.selectedNote._id);
      doc.status = "done";
      doc.end = new Date().toISOString();
      doc.archived = true;
      await this.putDoc(doc);
      this.$store.dispatch("refreshDoc", this.selectedNote._id);
      this.hideNote();
    },

    deleteNote: function() {
      let x = confirm("Delete note?");
      if (x) {
        this.deleteDoc(this.selectedNote._id);
        this.hideNote();
      }
    }
  }
};
</script>
