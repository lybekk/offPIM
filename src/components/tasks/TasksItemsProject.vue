<template lang="pug">
    v-dialog(v-model="dialog" scrollable max-width="300px")
      template(v-slot:activator="{ on }")
        v-list-item(@click="")
          v-list-item-content(v-on="on")
            v-list-item-title Project
            v-list-item-subtitle(v-text="projectName")
      v-card
        v-card-text
          v-row(justify="center")
            v-col
              v-card
                v-card-title Set project
                v-card-text(v-if="task.project")
                  v-list(two-line)
                    v-list-item
                      v-list-item-content
                        v-list-item-title Current
                        v-list-item-subtitle(v-text="projectName")
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
                v-list-item-group(color="primary")
                  //- Filter list with input field
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
    showProject(id) {
      this.$router.push(`/tasks/project/${id}`);
    },
  }
};

</script>
