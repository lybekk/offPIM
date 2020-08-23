<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    hide-overlay
    transition="dialog-bottom-transition"
    width="500"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-if="project.archived"
        disabled
      >
        Project archived
      </v-btn><v-btn
        v-else
        color="primary"
        v-on="on"
      >
        Archive project
      </v-btn>
    </template>
    <v-card>
      <v-toolbar>
        <v-btn
          icon
          dark
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Archive project</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-list
          three-line
          subheader
        >
          <v-subheader>Archival makes it so that this project and its tasks will not be synced to offPIM after a full database resync, increasing performance.</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Project: {{ project.project }}</v-list-item-title>
              <v-list-item-subtitle>Project and Open tasks will be marked done (if not already done or cancelled) and archived</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
        <div class="text-center">
          <v-btn @click="executeArchival">
            Execute archival
          </v-btn>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "TasksProjectArchival",
  mixins: [pouchMixin],
  props: {
      project: {
          type: Object,
          default: () => {},
      },
      tasks: {
          type: Array,
          default: () => [],
      },
  },

  data: () => ({
    dialog: false,
    circularProgressValue: 0,
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
    },
  },
};
</script>
