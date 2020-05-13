<template lang="pug">
    v-dialog(v-model="dialog" scrollable max-width="300px")
      template(v-slot:activator="{ on }")
        v-list-item(@click="")
          v-list-item-content(v-on="on")
            v-list-item-title Project
            v-list-item-subtitle(v-text="projectName")
      v-card
        v-card-title Set project
        v-card-subtitle(v-if="task.project") Current: {{ projectName }}
        v-card-text
          v-row(justify="center")
            v-col(v-if="task.project")
              v-btn(
                block
                @click="showProject(task.project)"
              ) Go to project
            v-col(v-if="task.project")
              v-btn(
                block
                @click="setTaskField(null)"
              ) Clear project from task
            v-col
              v-list
                v-subheader Move task to project:
                v-data-iterator(
                  :items="openProjects"
                  :search="search"
                  sort-by="title"
                )
                  template(v-slot:header)
                    v-text-field(
                      v-model="search"
                      clearable
                      hide-details
                      prepend-inner-icon="mdi-magnify"
                      label="Search"
                    )
                  template(v-slot:default="props")
                    v-list-item-group(color="primary")
                      v-list-item(
                        v-for="item in props.items"
                        :key="item._id"
                        @click="setTaskField(item._id)"
                      )
                        v-list-item-title(v-text="item.title")
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "TasksItemsProject",
  components: {},
  mixins: [pouchMixin],
  props: ["task"],
  data: () => ({
    dialog: false,
    projectName: null,
    search: "",
  }),
  computed: {
    openProjects: function() {
      // TODO - Getting project list. Runs multiple times... Optimize. Hand off project list & getter to Vuex
      return this.$store.getters.getOpenProjects;
    },
  },
  mounted() {
    this.getProjectName();
  },
  methods: {
    getProjectName: async function() {
      if (this.task.type == "project") {
        return;
      }
      const p = this.task.project;
      if (!p || p == null || p == "" || p === "undefined") {
        this.projectName = "No project asssigned";
      } else {
        try {
          const projectDoc = await this.getDoc(p);
          this.projectName = projectDoc.title;
        } catch {
          this.projectName =
            "Assigned: " + p + ", but unable to lookup project";
        }
      }
    },
    setTaskField: async function(project) {
      await this.setFieldGeneric({
        _id: this.task._id,
        field: "project",
        value: project,
      });

      this.dialog = false;
      this.$emit("set-doc");
    },
    showProject(id) {
      this.$router.push(`/tasks/project/${id}`);
    },
  },
};
</script>
