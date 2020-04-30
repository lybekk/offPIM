<template lang="pug">
    v-treeview(
        :active.sync="active"
        :items="items"
        :load-children="fetchProjects"
        :open.sync="open"
        expand-icon="mdi-chevron-down"
        activatable
        color="warning"
        open-on-click
        transition
        dense
    )
        template(v-slot:label="{ item, active }")
            span(
                v-if="!item.children"
                @click="showProject(item.id)"
                :class="item.archived ? 'projectArchived' : ''"
                :title="projectTitle(item)"
            ) {{ item.name }}
            span(v-else) {{ item.name }}
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "projectList",
  mixins: [pouchMixin],
  data: () => ({
    closedProjects: [],
    openProjects: [],
    projects: {
      doing: [],
      next: [],
      todo: [],
      plan: [],
      wait: [],
      done: [],
      cancelled: []
    },
    active: [],
    avatar: null,
    open: []
  }),
  computed: {
    items() {
      let arr = [];
      const keys = Object.keys( this.projects );
      for (let k of keys) {
        arr.push({
          id: k,
          name: k.charAt(0).toUpperCase() + k.slice(1),
          children: this.projects[k]
        })
      }
      return arr
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
      const projects = await this.getQuery('offpim/tasks-projects', item.id, item.id, true);
      projects.forEach(doc => {
        let obj = {
          id: doc._id,
          name: doc.title,
          archived: doc.archived
        };
        item.children.push(obj);
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