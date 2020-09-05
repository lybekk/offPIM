<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    min-width="50vw"
    max-width="55vw"
    transition="scroll-y-transition"
  >
    <v-card 
      :disabled="doc._deleted"
    >
      <v-toolbar
        color="primary"
        dark
        flat
      >
        <v-toolbar-title>{{ infomaticator }}</v-toolbar-title>
        <v-spacer />
        <v-btn
          icon
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <template v-slot:extension>
          <p>{{ doc._id }}</p>
        </template>
      </v-toolbar>
      <v-card-text>
        <DoctypeBookmark v-if="doc['@type'] == 'webPage'" />
        <MainDeleteButton 
          :document-id="doc._id"
          :is-deleted="doc._deleted"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="secondary"
          @click="dialog = false"
        >
          Close
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";
import itemDetailedMixin from "@/mixins/itemDetailedMixin";
import MainDeleteButton from "@/components/MainDeleteButton.vue";
import DoctypeBookmark from "@/components/documentviewer/DoctypeBookmark.vue";

export default {
  name: "DocumentViewer",
  components: {
    DoctypeBookmark,
    MainDeleteButton
  },
  mixins: [pouchMixin, itemDetailedMixin],
  data: () => ({}),
  computed: {
    infomaticator() {
      let n;
      const d = this.doc;
      if (d['@type'] == 'webFeed') {
        n = 'Feed'
      }
      return n
    },
    dialog: {
      get() {
        return this.$store.getters.dialogDocumentViewer;
      },
      set(state) {
        this.$store.commit("setGenericStateString", {
          property: "dialogDocumentViewer",
          value: state,
        });
      },
    },
  },
  methods: {},
};
</script>
