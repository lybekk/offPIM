<template lang="pug">
    v-treeview(
        :active.sync="active"
        :items="items"
        :load-children="fetchProjects"
        :open.sync="open"
        activatable
        color="warning"
        open-on-click
        transition
    )
        template(v-slot:label="{ item, active }")
            //<v-icon v-if="!item.children">mdi-account</v-icon>
            span(
                v-if="!item.children"
                @click="showProject(item.id)"
                :class="item.archived ? 'projectArchived' : ''"
                :title="projectTitle(item)"
            ) {{ item.name }}
                //- :to="`/tasks/project/${item.id}`"
            span(v-else) {{ item.name }}
</template>

<script>
export default {
  name: "projectList",
  data: () => ({
    closedProjects: [],
    openProjects: [],

    active: [],
    avatar: null,
    open: []
  }),
  computed: {
    items() {
      return [
        {
          id: "open",
          name: "Projects",
          children: this.openProjects
        },
        {
          id: "closed",
          name: "Closed projects",
          children: this.closedProjects
        }
      ];
    },
    closedProjectsSorted: function() {
      const proj = this.closedProjects;
      proj.sort(function(a, b) {
        var nameA = a.status.toUpperCase();
        var nameB = b.status.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      return proj;
    }
  },
  methods: {
    projectTitle(item) {
      if (item.archived) {
        return `(Archived) ${item.name}`
      } else {
        return item.name
      }
    },
    showProject(id) {
      this.$router.push(`/tasks/project/${id}`);
    },
    async fetchProjects(item) {
      let mango = {
        selector: {
          realm: "productivity",
          type: "project"
        },
        limit: 1000
      };
      if (item.id === "closed") {
        mango.selector["$nor"] = [
          { status: "wait" },
          { status: "plan" },
          { status: "todo" },
          { status: "next" },
          { status: "doing" }
        ];
      }
      if (item.id === "open") {
        mango.selector["$nor"] = [{ status: "cancelled" }, { status: "done" }];
      }
      return window.db
        .find(mango)
        .then(function(result) {
          result.docs.forEach(doc => {
            let obj = {
              id: doc._id,
              name: doc.project,
              archived: doc.archived
            };
            item.children.push(obj);
          });
        })
        .catch(function(err) {
          this.$store.commit("addAlert", { type: "error", text: err });
        });
    }
  }
};
</script>

<style scoped>
.projectArchived {
  opacity: 0.4;
}
</style>