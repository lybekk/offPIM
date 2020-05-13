<template lang="pug">
    v-dialog(
        v-model="dialog"
        :fullscreen="$vuetify.breakpoint.mdAndDown"
        width="50vw"
    )
        v-card
            v-card-title(class="headline") Raw JSON document
            v-card-subtitle(class="subtitle-1") {{ doc._id }}
            v-card-text
                v-container(fluid)
                    v-container
                        v-tabs(
                            color="primary"
                        )
                            v-tab(href="#tab-raw") Raw
                            v-tab(href="#tab-iterated") Iterated
                            v-tab-item#tab-raw
                                v-card(flat)
                                    v-card-text
                                        code(
                                            v-text="JSON.stringify(doc, null, 2)"
                                            class="grey darken-4 info--text pa-2"
                                            style="width:100%"
                                        )
                            v-tab-item#tab-iterated
                                v-card(flat)
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
                                        br
            v-card-actions
                v-spacer
                v-btn(
                    color="green darken-1"
                    text
                    @click="dialog = false"
                ) Close
</template>

<script>
export default {
  name: "rawdocumentviewer",
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
  },
};
</script>
