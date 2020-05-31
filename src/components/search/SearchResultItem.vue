<template lang="pug">
    v-lazy(
        :options="{ threshold: .5 }"
        transition="slide-y-reverse-transition"
    )
        v-list-item(@click="itemLookup(doc._id)")
            v-list-item-icon
                v-icon(v-text="icon")
            v-list-item-content
                v-list-item-title(v-text="title" class="primary--text")
                v-list-item-subtitle(class="text--primary" v-text="description")
                v-list-item-subtitle(v-text="doc._id")
        //- TODO Action-button for raw JSON-view
</template>

<script>
export default {
  name: "searchitem",
  props: ["doc", "score"],
  data: () => ({
    title: "",
    description: "",
    icon: "mdi-report"
  }),
  computed: {},
  mounted() {
    this.formatResult();
  },
  methods: {
    itemLookup: function(id) {
      console.log("Clicked ID: ", id);
      // TODO - If supported item (task,note,logbook) open in relevant app, else show json
      this.$store.dispatch("setRawDocumentViewerDocument", id);
    },

    formatResult: function() {
      const d = this.doc;
      if (d.productivity || d.logbook) {
        this.title = d.title;
        this.description = d.description
          ? d.description.slice(0, 150) + "..."
          : "";

        this.icon = d.logbook
          ? "mdi-book"
          : d.type == "task"
          ? "mdi-check"
          : d.type == "project"
          ? "mdi-check"
          : d.type == "note"
          ? "mdi-note"
          : "mdi-report";
      }
      if (d.message) {
        this.title = d.subject;
        this.description = d.body.slice(0, 150) + "...";
        this.icon = "mdi-email";
      }

      if (d["@type"]) {
        let t = d["@type"];

        this.title =
          t == "Person" ? d.givenName + " " + d.familyName : d.legalName;
        this.description = d.description
          ? d.description.slice(0, 150) + "..."
          : "Contact";
        this.icon = t == "Person" ? "mdi-account" : "mdi-domain";
      }

      // TODO - if icon remains mdi-info, send to debug-log
    }
  }
};
</script>
