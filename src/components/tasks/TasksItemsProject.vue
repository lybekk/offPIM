<template lang="pug">
v-expansion-panel
  v-expansion-panel-header(v-slot="{ open }")
    v-row(no-gutters)
      v-col Project
      v-col(
        cols="8"
        class="text--secondary"
      )
        v-fade-transition(leave-absolute)
          span(v-if="open") Details
          v-row(
            v-else
            no-gutters
            style="width: 100%"
          )
            v-col.text-capitalize(v-text="projectName")
  v-expansion-panel-content
    v-container(fluid)
      v-row
        v-dialog(v-model="dialog" scrollable max-width="300px")
          template(v-slot:activator="{ on }")
            v-btn(
              text
              small
              v-on="on"
              v-text="projectName"
            )
          v-card
            v-card-text
              v-row(justify="center")
                v-col
                  v-card
                    v-card-title
                      p Current project
                  v-card-text
                    p(v-text="projectName")
                v-col
                  v-list
                    v-subheader Move task to project:
                    v-list-item-group(color="primary")
                      v-list-item(
                        v-for="(p) in openProjects"
                        :key="p"
                        @click="setTaskField(p)"
                      )
                        v-list-item-title(v-text="p")
</template>

<script>

export default {
  name: 'TasksItemsProject',
  components: {
  },
  props: ["task"],
  data: () => ({
    dialog:false,
  }),
  computed: {
    projectName: function () {
      const p = this.task.project;
      if (!p || p==null || p=='') {return 'No project asssigned'}
      return p
    },
    openProjects: function () {
      const proj = this.$store.getters.getOpenProjects;
      const arr = [];
      proj.forEach(p => {
        arr.push(p.project)
      });
      arr.sort();
      return arr
    }
  },
  methods: {
    setTaskField: function (project) {
      const payload = {
         _id: this.task._id,
         field: 'project',
         value: project
         };
      this.$store.commit('setTaskField', payload);
      this.dialog = false;
    },
  }
};

</script>
