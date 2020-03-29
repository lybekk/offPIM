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
                      p Set project
                  v-card-text
                    p Current:
                    p(v-text="projectName")
                v-col
                  v-btn(
                    block
                    @click="setTaskField(null)"
                  ) Clear project
                v-col
                  v-list
                    v-subheader Move task to project:
                    v-list-item-group(color="primary")
                      v-list-item(
                        v-for="(value, key) in openProjects"
                        :key="key"
                        @click="setTaskField(value)"
                      )
                        v-list-item-title(v-text="key")
</template>

<script>
import pouchMixin from '@/mixins/pouchMixin'

export default {
  name: 'TasksItemsProject',
  components: {
  },
  mixins: [pouchMixin],
  props: ["task"],
  data: () => ({
    dialog:false,
    projectName: null
  }),
  computed: {
    openProjects: function () {
      console.log('Getting project list. Runs multiple times... Optimize')
      const proj = this.$store.getters.getOpenProjects;
      const arr = {};
      proj.forEach(p => {
        arr[ p.title ] = p._id
      });
      //arr.sort();
      return arr
    }
  },
  mounted () {
    this.getProjectName()
  },
  methods: {
    getProjectName: async function () {
      if (this.task.type == 'project') {return}
      const p = this.task.project;
      if (!p || p==null || p=='' || p==='undefined') {
        this.projectName = 'No project asssigned';
      } else {
        try {
          const projectDoc = await this.getDoc( p );
          this.projectName = projectDoc.title
        } catch {
          this.projectName = 'Assigned: ' + p + ', but unable to lookup project'
        }
      }
    },
    setTaskField: async function (project) {

      await this.setFieldGeneric({
        _id: this.task._id,
        field: 'project',
        value: project
      });

      this.dialog = false;
      this.$emit('set-doc')
    },
  }
};

</script>
