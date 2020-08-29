<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    min-width="50vw"
    max-width="80vw"
    transition="scroll-y-transition"
  >
    <!-- 
    -->
    <v-card>
      <v-toolbar
        color="cyan"
        dark
        flat
      >
        <v-toolbar-title>Document viewer</v-toolbar-title>
        <v-spacer />
        <v-btn
          icon
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn><template v-slot:extension>
          <p>Extension slot</p>
        </template>
      </v-toolbar>
      <v-card-title>
        Title
      </v-card-title>
      <v-card-text>
          <DoctypeWebfeed  v-if="doc['@type'] == 'webFeed'" />
          <!-- 
        <div v-if="doc.type == 'note' ">
          Another component {{ doc.description }}
        </div>
          -->
        <p>ID: <span>{{ doc._id}}</span></p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="secondary"
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
import itemDetailedMixin from "@/mixins/itemDetailedMixin";
//import DoctypeWebfeed from "@/components/documentviewer/DoctypeWebfeed";
//import DoctypeWebfeed from "@/components/documentviewer/DoctypeWebfeed";
import DoctypeWebfeed from "@/components/documentviewer/DoctypeWebfeed.vue";

export default {
  name: "DocumentViewer",
  components: {
    DoctypeWebfeed
  },
  mixins: [pouchMixin, itemDetailedMixin],
  data: () => ({}),
  computed: {
    /* Gives maximum call stack error
    doc() {
      return this.doc;
    },
    */
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
