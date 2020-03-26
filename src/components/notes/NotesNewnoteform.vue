<template>
  <v-list-item link @click.stop="dialog = true">
    <v-list-item-icon>
      <v-icon>mdi-pen</v-icon>
    </v-list-item-icon>
    <v-list-item-title>
      <v-row>
        <v-dialog v-model="dialog" persistent max-width="50vw">
          <template v-slot:activator="{ on }">
            <v-btn block small color="primary" v-on="on">New note</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Create a new note</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="newNote.title" label="Title"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="newNote.description" label="Description" filled></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-combobox
                      v-model="newNote.tags"
                      :items="tagsListItems"
                      label="Tags"
                      multiple
                      chips
                    ></v-combobox>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="dialog = false">Close</v-btn>
              <v-btn color="primary" text @click="insertNewNote">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import newDocumentMixin from "@/mixins/newDocumentMixin";

export default {
  name: "NotesNewnoteform",
  mixins: [newDocumentMixin],
  data: () => ({
    dialog: false,
    newNote: {
      title: "",
      description: "",
      tags: [],
      productivity: true,
      type: "note",
      priority: 4,
      status: "plan"
    }
  }),
  computed: {
    tagsListItems: function() {
      let tl = this.$store.getters.getTagList;
      let a = tl.map(obj => {
        return obj.key;
      });
      return a;
    }
  },
  methods: {
    insertNewNote: async function() {
      var now = new Date().toISOString();
      let n = this.newNote;
      n._id = this.generateUUID();
      n.created = now;
      n.start = now;
      n.created = now;
      n.project = null;
      n.end = null;
      n.due = null;
      n.context = null;

      let payload = { doc: n, snackbarText: "Added note: " + n.title };
      let result = await this.$store.dispatch("insertDocument", payload);
      if (result.ok) {
        this.dialog = false;
      }
    }
  }
};
</script>