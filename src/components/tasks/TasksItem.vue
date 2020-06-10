<template lang="pug">
  v-lazy(
    :options="{ threshold: .5 }"
    transition="slide-y-reverse-transition"
  )
    v-list-item(link)
      v-fade-transition
        v-overlay(
          v-if='isDeleted(doc._id)'
          absolute
          color='error'
          z-index='3'
        )
          v-btn(text) Deleted
      v-list-item-action
        v-fab-transition
          //- TODO: Evaluate replacing fab with icon. Cleaner
          v-btn(
            v-show="!isTaskClosed.visible"
            icon
            small
            :color="doc.status == 'done' ? 'success' : ''"
            @click="setTaskStatus('done')"
          )
            v-progress-circular(
              :value="taskProgress"
              :color="$store.getters.getStatusColors[doc.status]"
            )
      v-list-item-content(
        @click="sheet = !sheet"
      )
        v-list-item-subtitle(
          v-text="doc.title" 
          :class="isTaskClosed.classes"
          )
        v-list-item-subtitle
          //- INFO: Info chips used for quick (actionable?) details
          v-chip(
            v-if="doc.archived"
            color="info lighten-2"
            label
          ) Archived
          //- TODO - map to status-colors
          //-v-card-text v-if postponed x times and additional info
          v-tooltip(v-if='isOverdue' top)
            template(v-slot:activator='{ on }')
              v-icon(color='error' v-on='on') mdi-clock-alert
            span {{ overdueAmount(doc.due) }} Overdue 
          v-chip(
            v-if='isPostponed(doc._id)'
            small
            label
            color='info'
          ) Postponed
          v-tooltip(top)
            template(v-slot:activator='{ on }')
              v-icon(
                v-text="doc.description ? 'mdi-text' : '' "
                color="secondary"
                v-on='on'
              )
            span(v-text="doc.description")
      v-list-item-action
        tasks-items-priority(
          v-bind:task='doc'
          @set-doc="setDoc()"
        )
        //- TODO - Evaluate the need for this.
        v-tooltip(top)
          template(v-slot:activator='{ on }')
            v-btn(
              icon
              color='info'
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
          v-card
            v-card-title
              tasks-items-title(
                v-bind:id='doc._id'
                v-bind:title='doc.title'
                v-bind:status='doc.status'
                @set-doc="setDoc()"
              )
            v-card-text
              v-list
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
              div(
                v-for="field in ['due','start','end']"
                :key="field"
              )
                form-datetime(
                  v-bind:doc='doc'
                  :field-name="field"
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
                      v-if='isOverdue'
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

</template>

<script>
import TasksItemsStatus from "@/components/tasks/TasksItemsStatus.vue";
import TasksItemsTitle from "@/components/tasks/TasksItemsTitle.vue";
import TasksItemsDescription from "@/components/tasks/TasksItemsDescription.vue";
import TasksItemsProject from "@/components/tasks/TasksItemsProject.vue";
import TasksItemsTags from "@/components/tasks/TasksItemsTags.vue";
import TasksItemsPriority from "@/components/tasks/TasksItemsPriority.vue";
import TasksItemsDates from "@/components/tasks/TasksItemsDates.vue";
import FormDatetime from "@/components/form/formDatetime.vue";
import MainDeleteButton from "@/components/MainDeleteButton.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "tasksItem",
  components: {
    TasksItemsStatus,
    TasksItemsTitle,
    TasksItemsDescription,
    TasksItemsDates,
    MainDeleteButton,
    TasksItemsProject,
    TasksItemsTags,
    TasksItemsPriority,
    FormDatetime
  },
  mixins: [pouchMixin],
  props: ["docid"],
  data: () => ({
    doc: {
      title: "",
      tags: []
    },
    fab: false,
    sheet: false,
    statusList: ["cancelled", "plan", "wait", "todo", "next", "doing", "done"]
  }),
  computed: {
    isTaskClosed: function() {
      return {
        visible: ["done", "cancelled"].includes(this.doc.status),
        classes:
          this.doc.status == "done"
            ? "body-1 font-weight-regular success--text isDone"
            : "text--primary subtitle-1 font-weight-medium"
      };
    },

    taskProgress: function() {
      const s = this.doc.status;
      const progress =
        100 - 100 / this.statusList.findIndex(status => status === s);
      return s === "done" || s === "cancelled" ? 100 : progress;
    },

    isOverdue: function() {
      let d = new Date();
      d.setDate(d.getDate() - 1);
      let d_today = new Date();
      let date_today = d_today.toISOString().slice(0, 10);
      if (date_today > this.doc.due && this.doc.status != "done") {
        return true;
      }
      return false;
    }
  },
  mounted() {
    this.setDoc();
  },
  beforeDestroy() {},
  methods: {
    setDoc: async function() {
      this.doc = await this.getDoc(this.docid);
    },
    overdueAmount: function(due) {
      let dDue = new Date(due);
      let dNow = new Date();
      let diff = dNow - dDue;
      let hours = Math.floor(diff / (1000 * 60 * 60));
      let msg = hours + " hours ";
      return msg;
    },
    setTaskStatus: async function(newStatus) {
      let doc = await window.db.get(this.doc._id);
      doc.status = newStatus;
      if (["done", "cancelled"].includes(newStatus)) {
        doc.end = new Date().toJSON();
      }
      await this.putDoc(doc);
      this.setDoc();
      setTimeout(() => {
        this.$store.dispatch("getTaskStatuses");
      }, 4000);
    },
    getTaskStatus: function(id) {
      return this.$store.getters.getTaskStatus(id);
    },
    postponeTask: async function(id) {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      let tom = currentDate.toISOString().slice(0, 10);
      let payload = {
        _id: id,
        field: "due",
        value: tom
      };
      await this.setFieldDate(payload);
      this.$store.commit("addPostponed", id);
      this.setDoc();
    },
    isPostponed: function(id) {
      let list = this.$store.getters.getPostponedTasks;
      if (list.includes(id)) {
        return true;
      }
      return false;
    },
    isDeleted: function(id) {
      let list = this.$store.getters.getDeletedDocuments;
      if (list.includes(id)) {
        return true;
      }
      return false;
    },
    color: function(status) {
      return this.$store.getters.getStatusColors[status];
    }
  }
};
</script>

<style scoped>
.isDone {
  text-decoration: line-through;
}
</style>