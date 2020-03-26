<template lang="pug">
v-dialog(
    v-model="dialog" 
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    hide-overlay 
    transition="dialog-bottom-transition"
    width="500"
)
  //-may be needed <v-row justify="center">
  template(v-slot:activator="{ on }")
    v-btn(color="primary" v-on="on") Archive project
  v-card
    v-toolbar
      v-btn(icon dark @click="dialog = false")
        v-icon mdi-close
      v-toolbar-title Archive project
      v-spacer
      v-toolbar-items
        v-btn(text @click="dialog = false") Close
    v-container
      v-list(three-line subheader)
        v-subheader Archival makes it so that this project and its tasks will not be synced to pimpim after a full database resync, increassing performance.
        v-list-item
          v-list-item-content
            v-list-item-title Project: {{ project.project }}
            v-list-item-subtitle Project and Open tasks will be marked done (if not already done or cancelled) and archived
      v-divider
      div(class="text-center")
        v-btn(
          @click="executeArchival"
        ) Execute archival
          //-disabled?
      //-div(class="text-center")
        v-progress-circular(
          rotate="-90"
          size="100"
          width="15"
          :value="circularProgressValue"
          color="success"
        ) { circularProgressValue }}
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "tasksProjectArchival",
  mixins: [pouchMixin],
  props: ["project", "tasks"],
  data: () => ({
    dialog: false,
    circularProgressValue: 0
  }),
  methods: {
    executeArchival: async function() {
      console.log("Archiving project");
      await this.processDoc(this.project._id);

      for await (let t of this.tasks) {
        this.processDoc(t._id);
      }
      // calculate percentage between tasks archived successfully
      this.$emit("get-project");
      this.dialog = false;
    },
    processDoc: async function(docId) {
      let doc = await this.getDoc(docId);
      doc.archived = true;

      if (doc.end == null || !doc.end) {
        doc.end = new Date().toJSON();
      }

      if (["wait", "plan", "todo", "next", "doing"].includes(doc.status)) {
        doc.status = "done";
      }
      this.putDoc(doc);
    }
  }
};
</script>