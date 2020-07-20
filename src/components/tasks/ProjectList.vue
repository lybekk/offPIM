<template>
  <v-sheet>
    <v-sheet class="pa-4 primary lighten-2">
      <v-text-field
        v-model="filter"
        label="Filter projects"
        dark
        flat
        solo-inverted
        hide-details
        clearable
      />
    </v-sheet>
    <v-sheet class="pa-1">
      <v-list>
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="$store.getters.getStatusIcons[item.title]"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title
                style="text-transform: capitalize;"
                v-text="item.title"
              />
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="subItem in item.children"
            :key="subItem.title"
            @click="showProject(subItem._id)"
          >
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-sheet>
  </v-sheet>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "ProjectList",
  mixins: [pouchMixin],
  data: () => ({
    closedProjects: [],
    active: [],
    avatar: null,
    open: ["doing"],
    filter: ""
  }),
  computed: {
    items() {
      const statuses = [
        "doing",
        "next",
        "todo",
        "plan",
        "wait",
        "done",
        "cancelled"
      ];

      const obj = {};

      for (let key of statuses) {
        obj[key] = {
          _id: key,
          title: key,
          children: [],
          active: key == "doing" ? true : undefined
        };
      }

      for (let p of this.$store.getters.getOpenProjects) {
        // TODO: Implement filter
        if (this.filter.length > 0) {
          if (p.title.includes(this.filter)) {
            obj[p.status].children.push(p);
          }
        } else {
          obj[p.status].children.push(p);
        }
      }

      for (let key in obj) {
        if (!obj[key].children.length) {
          delete obj[key];
        }
      }

      return Object.values(obj);
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
        return `(Archived) ${item.name}`;
      } else {
        return item.name;
      }
    },
    showProject(id) {
      this.$router.push(`/tasks/project/${id}`);
    },

    async fetchProjects(item) {
      const projects = await this.getQuery(
        "offpim/tasks-projects",
        item.id,
        item.id,
        true
      );
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