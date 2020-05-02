<template lang="pug">
div(v-if="!hideTask")
    v-card(
      :color="isPostponed(doc._id) ? 'secondary darken-2' : ''"
    )
      v-card-title(
        :class="[ doc.status == 'done' ? 'body-1 success--text' : 'body-1 font-weight-regular' ]"
        @click="sheet = !sheet"
      ) {{ doc.title }}
      v-progress-linear(
        active
        rounded
        absolute
        top
        background-color="none"
        :value="taskProgress"
        :color="$store.getters.getStatusColors[doc.status]"
        )
          //- TODO - map to status-colors
      v-fade-transition
        v-overlay(
          v-if='isDeleted(doc._id)'
          absolute
          color='error'
          z-index='3'
        )
          v-btn(text) Deleted
      v-fade-transition
        v-overlay(
          v-if="doc.archived"
          absolute
          color="info lighten-2"
          z-index="3"
        )
          v-btn(text) Archived
      //-v-card-subtitle Use v-if overdue here
      //-v-card-text v-if postponed x times and additional info
      v-card-actions
        div(class="text-center")
          v-fab-transition
            v-btn(
              v-show="doc.status != 'done'"
              fab
              small
              :color="doc.status == 'done' ? 'success' : ''"
              bottom
              left
              @click="setTaskStatus('done')"
            )
              v-icon mdi-check
        tasks-items-priority(
          v-bind:task='doc'
          @set-doc="setDoc()"
        )
        v-spacer
        v-tooltip(top)
          template(v-slot:activator='{ on }')
            v-icon(
              v-text="doc.description ? 'mdi-comment' : '' "
              color="secondary"
              v-on='on'
            )
          span(v-text="doc.description")
        v-tooltip(top)
          template(v-slot:activator='{ on }')
            v-btn(
              icon
              color='info'
              class="ma-2"
              :disabled="isPostponed(doc._id)"
              v-on='on'
              @click='postponeTask(doc._id)'
            )
              v-icon mdi-update
          span Postpone until tomorrow
        v-bottom-sheet(
          v-model="sheet" 
          :inset="$vuetify.breakpoint.mdAndUp"
          scrollable
        )
          template(v-slot:activator="{ on }")
            v-btn(
              icon
              v-on="on"
            )
              v-icon mdi-dots-vertical-circle
          v-card
            v-card-title(class="secondary")
              tasks-items-title(
                v-bind:id='doc._id'
                v-bind:title='doc.title'
                v-bind:status='doc.status'
                @set-doc="setDoc()"
              )
            v-card-text
              v-list
                v-list-item
                  v-list-item-content
                    tasks-items-description(
                      v-bind:task='doc'
                      @set-doc="setDoc()"
                    )
                tasks-items-project(
                  v-if="doc.type != 'project'"
                  v-bind:task='doc'
                  @set-doc="setDoc()"
                )
                v-list-item
                  v-list-item-content
                    tasks-items-status(
                      v-bind:task='doc'
                      @set-status="setTaskStatus"
                    )
              v-divider(inset width="80%")
              tasks-items-dates(
                v-bind:task='doc'
                v-bind:is-overdue='isOverdue(doc)'
                v-bind:is-deleted='isDeleted(doc._id)'
                @set-doc="setDoc()"
              )
              v-divider(inset width="80%")
              tasks-items-tags(
                v-bind:task='doc'
                @set-doc="setDoc()"
              )
              v-divider
                v-col
                  div
                    span
                      v-chip(
                        v-if='isOverdue(doc)'
                        small
                        label
                        color='error'
                      ) {{ overdueAmount(doc.due) }} Overdue 
                      v-chip(
                        v-if="doc.status == 'done'"
                        small
                        label
                        color='success'
                      ) Done
                      v-chip(
                        v-if='isPostponed(doc._id)'
                        small
                        label
                        color='info'
                      ) Postponed
                    //- (TODO) x-Small btn with brackets for viewing raw document (tied to app - general tool for editing json)
              v-row
                v-col
                  tr(class="font-weight-thin")
                    td ID: 
                    td(v-text="doc._id")
                v-col
                  main-delete-button(v-bind:document-id='doc._id')
            v-card-actions
              div(class="text-left")
                v-tooltip(top)
                  template(v-slot:activator='{ on }')
                    v-btn(
                      fab
                      small
                      :outlined="doc.status != 'done'"
                      class="ma-2"
                      :color="color(doc.status)"
                      v-on='on'
                      @click="setTaskStatus('done')"
                    )
                      v-icon mdi-check
                  span Mark done
                v-tooltip(top)
                  template(v-slot:activator='{ on }')
                    v-btn(
                      fab
                      small
                      :outlined="!isPostponed(doc._id)"
                      color='info'
                      class="ma-2"
                      v-on='on'
                      @click='postponeTask(doc._id)'
                    )
                      v-icon mdi-update
                  span Postpone until tomorrow
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
import pouchMixin from '@/mixins/pouchMixin'

export default {
  name: 'tasksItem',
  components: {
    TasksItemsStatus,
    TasksItemsTitle,
    TasksItemsDescription,
    TasksItemsDates,
    MainDeleteButton,
    TasksItemsProject,
    TasksItemsTags,
    TasksItemsPriority,
  },
  mixins: [pouchMixin],
  props: ['docid'],
  data: () => ({
    doc: {
      title:'',
      tags:[],
    },
    fab:false,
    sheet: false,
    hideTask: false,
    statusList: [
      'cancelled',
      'plan',
      'wait',
      'todo',
      'next',
      'doing',
      'done'
    ],
  }),
  computed: {
    taskProgress: function () {
      const s = this.doc.status;
      const progress = 100 - ( 100 / this.statusList.findIndex(status => status === s ) );
      return ( s === 'done' ? 100 : progress )
      
      //return
    }

  },
  mounted () {
    this.setDoc()
  },
  beforeDestroy() {
  },
  methods: {
    setDoc: async function() {
      this.doc = await this.getDoc(this.docid)
    },
    // TODO copied from former component. For rewrite
    overdueAmount: function (due) {
      let dDue = new Date(due);
      let dNow = new Date();
      let diff = dNow - dDue;
      let hours = Math.floor(diff / (1000 * 60 * 60))
      let msg = hours + ' hours '
      return msg
    },
    setTaskStatus: async function(newStatus) {
      let doc = await window.db.get(this.doc._id);
      doc.status = newStatus;
      if ( ['done','cancelled'].includes(newStatus) ) {
          doc.end = new Date().toJSON();
      }
      await this.putDoc(doc)
      this.setDoc()
      setTimeout(()=>{
          this.$store.dispatch('getTaskStatuses');
        }, 4000);

    },
    getTaskStatus: function(id) {
      return this.$store.getters.getTaskStatus(id)
    },
    postponeTask: async function(id) {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      let tom = currentDate.toISOString().slice(0,10);
      let payload = {
        _id:id, 
        field:'due', 
        value: tom
      };
      await this.setFieldDate(payload)
      this.$store.commit('addPostponed', id);
      this.setDoc();
      setTimeout(() => {
        this.hideTask = true;
      }, 400);
    },
    isOverdue: function(doc) {
      let d = new Date();
      d.setDate(d.getDate() - 1);
      let d_today = new Date();
      let date_today = d_today.toISOString().slice(0,10);
      if (date_today > doc.due && doc.status != "done" ) {
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
    },
  }
}

</script>