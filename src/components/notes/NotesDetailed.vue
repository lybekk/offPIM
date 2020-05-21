<template lang="pug">
    v-bottom-sheet(
        v-model="dialog"
        :inset="$vuetify.breakpoint.mdAndUp"
        scrollable
    )
        v-card
            v-card-title
                v-btn(
                    class="mt-6"
                    text
                    color="warning"
                    @click="hideNote"
                ) close
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
            v-card-text
                v-container
                    v-row
                        v-col
                            v-text-field(
                                :value="selectedNote.title"
                                label="Title"
                                @change="setTitle"
                            )
                            v-textarea(
                                :value="selectedNote.description"
                                filled
                                label="Description"
                                @change="setDescription"
                            )
                            v-combobox(
                                v-model="tags"
                                :items="tagsListItems"
                                label="Tags"
                                multiple
                                chips
                                @change="setTags"
                            )
                    v-row
                        v-col
                            p(v-text="selectedNote._id")

</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "NotesDetailed",
  mixins: [pouchMixin],
  computed: {
    selectedNote() {
      return this.$store.getters.selectedNote;
    },
    dialog: {
      get: function() {
        return this.$store.getters.dialogItemDetailed;
      },
      set: function(val) {
        const mutation = val
          ? "dialogItemDetailedShow"
          : "dialogItemDetailedHide";
        this.$store.commit(mutation, "dialogItemDetailed");
      }
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
    },

    setTitle: function(text) {
      this.setField("title", text);
    },

    setDescription: function(text) {
      this.setField("description", text);
    },

    setTags: function(tags) {
      this.setField("tags", tags);
    },

    setField: async function(key, value) {
      let doc = await this.getDoc(this.selectedNote._id);
      doc[key] = value;
      await this.putDoc(doc);
      this.$store.dispatch("refreshDoc", this.selectedNote._id);
    }
  }
};
</script>
