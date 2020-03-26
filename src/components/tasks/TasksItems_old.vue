<template lang="pug">
//- moving in process 
v-container(fluid)
  v-data-iterator(
    :items="this.$store.getters.getData"
    :loading="this.$store.getters.loaderState"
    loading-text="Getting tasks"
    no-data-text="No tasks matching request"
  )
    //- don't use group-by="status". Reorders tasks on status change, making task lose fokus
    template(v-slot:default="props")
      v-row
        v-col(
          v-for="task,i in props.items"
          :key="task._id"
          v-bind:index="i"
          cols="12"
          sm="12"
          md="12"
          lg="6"
        )
          v-card
            v-card-title(
              class="subheading"
            )
              v-row
                v-col
                  tasks-items-title(v-bind:task='task')
                v-col(cols="1")
                  v-speed-dial(
                    right
                    direction='left'
                    transition='scale-transition'
                  )
                    //- removed - open-on-hover
                    template(v-slot:activator)
                      v-btn(
                        color='primary'
                        fab
                        small
                      )
                        v-icon(v-if="fab") mdi-close
                        v-icon(v-else) mdi-menu
                    v-tooltip(top)
                      template(v-slot:activator='{ on }')
                        v-btn(
                          fab
                          small
                          color='success'
                          v-on='on'
                          @click="setTaskStatus(task._id, 'done')"
                        )
                          v-icon mdi-check
                          // OUTLINED if not done. Filled&disabled if done. Put button outside fab?
                      span Mark done
                    v-tooltip(top)
                      template(v-slot:activator='{ on }')
                        v-btn(
                          fab
                          small
                          color='info'
                          v-on='on'
                          @click='postponeTask(task._id)'
                        )
                          v-icon mdi-update
                      span Postpone until tomorrow
              //-v-spacer
            v-fade-transition
              v-overlay(
                v-if='isDeleted(task._id)'
                absolute
                color='error'
                z-index='3'
              )
                v-btn(text) Deleted
            v-card-subtitle
              tasks-items-description(v-bind:task='task')
            div
              span
                //v-if='isOverdue(task._id)'
                v-chip(
                  v-if='isOverdue(task)'
                  small
                  label
                  color='error'
                ) {{ overdueAmount(task.due) }} Overdue 
                v-chip(
                  v-if="task.status == 'done'"
                  small
                  label
                  color='success'
                ) Done
                v-chip(
                  v-if='isPostponed(task._id)'
                  small
                  label
                  color='info'
                ) Postponed
            v-divider(inset width="80%")
            v-card-text
              v-expansion-panels(
                hover
                flat
                tile
              )
                tasks-items-status(v-bind:task='task')
                tasks-items-priority(v-bind:task='task')
                tasks-items-project(v-bind:task='task')
                //-v-bind:is-overdue='isOverdue(task._id)'
                tasks-items-dates(
                  v-bind:task='task'
                  v-bind:is-overdue='isOverdue(task)'
                  v-bind:is-deleted='isDeleted(task._id)'
                )
                v-row
                  v-col
                    tasks-items-tags(v-bind:task='task')
                  v-col
                    tr(class="font-weight-thin")
                      td ID:
                      td(v-text="task._id")
                  v-col
                    main-delete-button(v-bind:document-id='task._id')
                  v-col
                    v-tooltip(top)
                      template(v-slot:activator='{ on }')
                        v-btn(
                          fab
                          small
                          :outlined="task.status != 'done'"
                          :color="color(task.status)"
                          v-on='on'
                          @click="setTaskStatus(task._id, 'done')"
                        )
                          v-icon mdi-check
                          // OUTLINED if not done. Filled&disabled if done. Put button outside fab?
                            :class="[ isDone(task._id) ? 'success--text' : '' ]"
                            color='success'
                      span Mark done
                    //--v-tooltip(top)
                      template(v-slot:activator='{ on }')
                        v-btn(
                          fab
                          small
                          color='success'
                          v-on='on'
                          @click="setTaskStatus(task._id, 'done')"
                        )
                          v-icon mdi-check
                          // OUTLINED if not done. Filled&disabled if done. Put button outside fab?
                      span Mark done
                    //- (TODO) x-Small btn with brackets for viewing raw document (tied to app - general tool for editing json)
                //main-delete-button(v-bind:document-id='task._id')

</template>

<script>
import TasksItemsStatus from '@/components/tasks/TasksItemsStatus.vue'
import TasksItemsTitle from '@/components/tasks/TasksItemsTitle.vue'
import TasksItemsDescription from '@/components/tasks/TasksItemsDescription.vue'
import TasksItemsProject from '@/components/tasks/TasksItemsProject.vue'
import TasksItemsTags from '@/components/tasks/TasksItemsTags.vue'
import TasksItemsPriority from '@/components/tasks/TasksItemsPriority.vue'
import TasksItemsDates from '@/components/tasks/TasksItemsDates.vue'
import MainDeleteButton from '@/components/MainDeleteButton.vue'

export default {
  name: 'TasksItems',
  components: {
    TasksItemsStatus,
    TasksItemsTitle,
    TasksItemsDescription,
    TasksItemsDates,
    MainDeleteButton,
    TasksItemsProject,
    TasksItemsTags,
    TasksItemsPriority
  },
  data: () => ({
    fab:false,
    //statusList: ['cancelled','wait','plan','todo','next','doing','done'], // Remove after component OK
  }),
  computed: {
  },
  methods: {
    overdueAmount: function (due) {
      let dDue = new Date(due);
      let dNow = new Date();
      let diff = dNow - dDue;
      let hours = Math.floor(diff / (1000 * 60 * 60))
      let msg = hours + ' hours '
      return msg
    },
    statusClass: function(status) {
      let sc = {
        cancelled: 'grey--text',
        wait: 'white',
        plan: 'grey darken-4 white--text',
        todo: 'info',
        next: 'warning',
        doing: 'primary',
        done: 'success'
      };
      return sc[status]
    },
    setTaskStatus: function(id,newStatus) {
      this.$store.commit('setTaskStatus', { _id:id, status:newStatus });
    },
    getTaskStatus: function(id) {
      return this.$store.getters.getTaskStatus(id)
    },
    postponeTask: function(id) {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      let tom = currentDate.toISOString().slice(0,10);
      let payload = { _id:id, key:'due', value: tom };
      this.$store.commit('setTaskDate', payload);
      this.$store.commit('addPostponed', id);
    },
    isOverdue: function(task) {
      //let task = this.$store.getters.getTask(key);
      let d = new Date();
      d.setDate(d.getDate() - 1);
      let d_today = new Date();
      let date_today = d_today.toISOString().slice(0,10);
      if (date_today > task.due && task.status != "done" ) {
          return true
      }
      return false
    },
    isPostponed: function(id) {
      let list = this.$store.getters.getPostponedTasks;
      if ( list.includes(id) ) {return true}
      return false
    },
    isDeleted: function(id) {
      let list = this.$store.getters.getDeletedDocuments;
      if ( list.includes(id) ) {return true}
      return false
    },
    color: function (status) {
      return this.$store.getters.getStatusColors[status]
    }
  }
};

</script>