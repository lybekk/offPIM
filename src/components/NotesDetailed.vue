<template>
  <div class="text-center">
    <v-bottom-sheet v-model="isActive" inset>
      <v-sheet class="" height="auto" max-height="90vh" width="auto">
        <v-btn
            class="mt-6"
            text
            color="warning"
            @click="hideNote"
        >close</v-btn>
        <v-btn
            class="mt-6"
            text
            color="success"
            @click="saveNote"
        >Save</v-btn>
        <v-btn
            class="mt-6"
            text
            color="primary"
            @click="archiveNote"
        >Archive</v-btn>
        <v-btn
            class="mt-6"
            text
            color="error"
            @click="deleteNote"
        >Delete</v-btn>
        <v-container>
            <v-row>
                <v-col >
                    <v-form>
                        <v-container>
                            <v-row>
                                <v-col>
                                    <v-text-field
                                        v-model="selectedNote.title"
                                        label="Title"
                                    ></v-text-field>
                                    <v-textarea
                                        v-model="selectedNote.description"
                                        filled
                                        label="Description"
                                    ></v-textarea>
                                    <v-combobox
                                    v-model="tags"
                                    :items="tagsListItems"
                                    label="Tags"
                                    multiple
                                    chips
                                    ></v-combobox>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-col>
                <v-col>
                    <h3>Raw document:</h3>
                    <code class="grey darken-4 cyan--text" v-text="JSON.stringify(selectedNote, null, 2)"></code>
                </v-col>
            </v-row>
        </v-container>

      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
    name: 'NotesDetailed',
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
            let tl = this.$store.getters.getTagsList;
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
            let payload = { doc: this.selectedNote };
            let result = await this.$store.dispatch('insertDocument', payload);
            if (result.ok) {
                this.hideNote();
            }
        },
        archiveNote: function () {
            this.selectedNote.status = 'done';
            this.selectedNote.end = new Date().toISOString();
            this.selectedNote.archived = true;
            let payload = { doc: this.selectedNote };
            this.$store.dispatch('insertDocument', payload);
            this.hideNote();
        },
        deleteNote: function () {
            let x = confirm("Delete note?");
            if (x) {
                this.$store.commit('deleteNote', this.selectedNote._id);
                this.hideNote();
            }
        }
    }
}
</script>