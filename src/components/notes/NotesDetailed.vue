<template lang="pug">
  div(class="text-center")
    v-bottom-sheet(
        v-model="isActive"
        inset
    )
        v-sheet(
            class="" 
            height="auto" 
            max-height="90vh" 
            width="auto"
        )
            v-btn(
                class="mt-6"
                text
                color="warning"
                @click="hideNote"
            ) close
            v-btn(
                class="mt-6"
                text
                color="success"
                @click="saveNote"
            ) Save
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
            v-container
                v-row
                    v-col
                        v-form
                            v-container
                                v-row
                                    v-col
                                        v-text-field(
                                            v-model="selectedNote.title"
                                            label="Title"
                                        )
                                        v-textarea(
                                            v-model="selectedNote.description"
                                            filled
                                            label="Description"
                                        )
                                        v-combobox(
                                            v-model="tags"
                                            :items="tagsListItems"
                                            label="Tags"
                                            multiple
                                            chips
                                        )
                    v-col
                        h3 Raw document:
                        code(
                            class="grey darken-4 cyan--text" 
                            v-text="JSON.stringify(selectedNote, null, 2)"
                        )

</template>

<script>
import pouchMixin from '@/mixins/pouchMixin'

export default {
    name: 'NotesDetailed',
    mixins: [pouchMixin],
    props: ["selectedNote"],
    data: () => ({
    }),
    computed: {
        isActive: {
            get: function() {
                return this.$store.getters.noteSheetState
            },
            set: function() {
                this.$store.commit('hideNoteSheet');
            }
        },
        tags: {
            get: function() {
                return this.selectedNote.tags
            },
            set: function(tags) {
                this.selectedNote.tags = tags;
            }
        },
        tagsListItems: function () {
            let tl = this.$store.getters.getTagList;
            let arr = [];
            for (let t of tl) {
                arr.push(t.key)
            }
            return arr
        }
    },
    methods: {
        hideNote: function () {
            this.$store.commit('hideNoteSheet');
        },
        saveNote: async function () {
            let result = await this.putDoc(this.selectedNote);
            if (result.ok) {
                this.$emit('refresh-doc', this.selectedNote._id)
                this.hideNote();
            }
        },
        archiveNote: async function () {
            this.selectedNote.status = 'done';
            this.selectedNote.end = new Date().toISOString();
            this.selectedNote.archived = true;
            let result = await this.putDoc(this.selectedNote);
            if (result.ok) {
                this.$emit('refresh-doc', this.selectedNote._id)
                this.hideNote();
            }
        },
        deleteNote: function () {
            let x = confirm("Delete note?");
            if (x) {
                this.deleteDoc(this.selectedNote._id)
                this.hideNote();
            }
        }
    }
}
</script>