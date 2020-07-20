<template>
  <v-dialog
    v-model="dialog"
    max-width="25vw"
    overlay-opacity="0.9"
    overlay-color="secondary"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :persistent="importInProgress"
  >
    <template v-slot:activator="{ on }">
      <v-list-item v-on="on">
        <v-list-item-icon><v-icon>mdi-database-import</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>Import to local database</v-list-item-title><v-list-item-subtitle>Pick a backup file previously exported from offPIM, or a json file containing an array of objects.</v-list-item-subtitle></v-list-item-content>
      </v-list-item>
    </template>
    <v-card
      :disabled="importInProgress"
    >
      <v-card-text>
        <v-row>
          <v-col>Import to local database</v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-file-input
              v-model="file"
              label="File input"
              prepend-icon="mdi-file-code"
              accept=".json"
              show-size="show-size"
            />
          </v-col>
        </v-row>
        <v-row v-if="file">
          <v-col cols="12">
            <span>File received</span>
          </v-col>
          <v-col cols="12">
            <v-btn @click="importFile">
              Begin import
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="importStatus">
          <v-col cols="12">
            <p>Docs total: {{ docsTotal }}</p>
          </v-col>
          <v-col cols="12">
            <p>Docs inserted: {{ docsInserted }}</p>
          </v-col>
          <v-col cols="12">
            <p>Docs failed: {{ docsFailed }}</p>
          </v-col>
          <v-col cols="12">
            <p>Docs exists: {{ docsExists }}</p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "Localdatabaseimport",
  components: {},
  mixins: [pouchMixin],
  data: () => ({
    dialog: false,
    file: null,
    importInProgress: false,
    docsInserted: 0,
    docsFailed: 0,
    docsExists: 0,
    docsTotal: 0,
    importStatus: false,
  }),
  computed: {},
  methods: {
    //- TODO - Test uploading a png or other unupported format
    //- TODO - Test a json file not passing the format
    importFile: async function() {
      this.importInProgress = true;
      this.importStatus = true;
      this.docsInserted = 0;
      this.docsFailed = 0;
      this.docsExists = 0;
      this.docsTotal = 0;

      try {
        const text = await this.file.text();

        const items = await JSON.parse(text);
        this.docsTotal = items.length;
        // bulkDocs does not show progress:
        // await window.db.bulkDocs(items);
        for await (let item of items) {
          try {
            if (item._rev) {
              delete item._rev;
            }
            let result = await this.putDoc(item, "silent");
            if (result.status == "409") {
              this.docsExists++;
            } else {
              this.docsInserted++;
            }
          } catch (error) {
            this.docsFailed++;
          }
        }
      } catch (error) {
        console.log("Outer error: ", error);
        this.importInProgress = false;
      }
      this.importInProgress = false;
    },
  },
};
</script>
