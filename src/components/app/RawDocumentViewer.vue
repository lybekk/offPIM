<template lang="pug">
v-dialog(
  v-model="dialog"
  :fullscreen="$vuetify.breakpoint.mdAndDown"
  width="50vw"
  )
  v-card
    v-toolbar(
      color="cyan"
      dark
      flat
    )
      v-toolbar-title Raw JSON document
      v-spacer
      v-btn(
          icon
          @click="dialog = false"
      )
        v-icon mdi-close
      template(v-slot:extension)
        v-tabs(
          v-model="tab"
          color="primary"
          :grow="$vuetify.breakpoint.smAndDown"
          :align-with-title="$vuetify.breakpoint.mdAndUp"
        )
          v-tabs-slider(color="yellow")
          v-tab(
            v-for="tab in tabs" 
            :key="tab"
            ) {{ tab }}
    v-tabs-items(v-model="tab")
      v-tab-item(
        v-for="tab in tabs" 
        :key="tab"
      )
        v-card(
          v-if="tab == 'Raw'"
          flat
          class="grey darken-4 info--text pa-2"
        )
          v-card-text
            code(
                v-text="JSON.stringify(doc, null, 2)"
                class="grey darken-4 info--text pa-2"
                style="width:100%"
            )
        v-card(
          v-if="tab == 'Iterated'"
          flat
          )
          v-card-text
            v-simple-table
              template(v-slot:default)
                  thead
                      tr
                          th(class="text-left") Key
                          th(class="text-left") Value
                  tbody
                      tr(v-for="(value, key) in doc")
                          td(v-text="key")
                          td {{ value }}
        v-card(
          v-if="tab == 'Editor'"
          flat
          )
          v-card-title
            v-spacer
            v-btn(
              color="primary"
              :disabled="!validateJSON"
              @click="saveDoc"
            ) {{ validateJSON ? 'Save' : 'Invalid JSON' }}
          v-card-text
            v-textarea(
              v-model="jsonInput"
              filled
              auto-grow
              class="jsonValid"
              :class="validateJSON ? 'jsonValid' : 'jsonInvalid'"
              label="Edit"
              spellcheck="false"
              required
            )
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "rawdocumentviewer",
  mixins: [pouchMixin],
  data: () => ({
    tab: 'Raw',
    tabs: ["Raw", "Iterated","Editor"],
    jsonInputData: true,
  }),
  computed: {
    doc() {
      return this.$store.getters.rawDocumentViewerDocument;
    },
    dialog: {
      get() {
        return this.$store.getters.rawDocumentViewerDialog;
      },
      set(state) {
        this.$store.commit("setGenericStateString", {
          property: "rawDocumentViewerDialog",
          value: state,
        });
      },
    },
    jsonInput: {
      get() {
        return JSON.stringify(this.doc, null, 2)
      },
      set(val) {
        this.jsonInputData = val;
      }
    },
    validateJSON() {
      try {
        JSON.parse(this.jsonInputData)
      } catch {
        return false
      }
      return true
    }
  },
  methods: {
    saveDoc: function() {
      if(this.validateJSON) {
        this.putDoc(
          JSON.parse(this.jsonInputData)
        );
      }
    },
  },
};
</script>

<style scoped>
.jsonValid {
  font-family: monospace !important;
  background-color: azure !important;
}
.jsonInvalid {
  font-family: monospace !important;
  background-color: salmon !important;
}
</style>