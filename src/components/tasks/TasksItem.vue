<template>
  <v-lazy
    :options="{ threshold: .5 }"
    transition="slide-y-reverse-transition"
  >
    <v-list-item link>
      <v-fade-transition>
        <v-overlay
          v-if="isDeleted(doc._id) || doc._deleted"
          absolute="absolute"
          color="error"
          z-index="3"
        >
          <v-btn text="text">
            Deleted
          </v-btn>
        </v-overlay>
      </v-fade-transition>
      <v-list-item-action>
        <v-fab-transition>
          <!-- TODO: Evaluate replacing fab with icon. Cleaner -->
          <v-btn
            :key="activeFab.icon"
            icon
            small
            @click="!isTaskClosed.visible ? setTaskStatus('done') : setTaskStatus('doing')"
          >
            <v-progress-circular
              v-if="!isTaskClosed.visible"
              :value="taskProgress"
              :color="$store.getters.getStatusColors[doc.status]"
            />
            <v-icon
              v-else
              :color="$store.getters.getStatusColors[doc.status]"
              class="isDone"
              v-text="$store.getters.getStatusIcons[doc.status]"
            />
            <!-- 
              :color="activeFab.color"
            -->
          </v-btn>
        </v-fab-transition>
      </v-list-item-action>
      <v-list-item-content @click="sheet = !sheet">
        <v-list-item-subtitle
          :class="isTaskClosed.classes"
          v-text="doc.title"
        />
        <!-- INFO: Info chips used for quick (actionable?) details -->
        <v-list-item-subtitle>
          <v-chip
            v-if="doc.archived"
            color="info lighten-2"
            label="label"
          >
            Archived
          </v-chip>
          <!--
            TODO - map to status-colors
            v-card-text v-if postponed x times and additional info
          -->
          <v-tooltip
            v-if="isOverdue"
            top
          >
            <template v-slot:activator="{ on }">
              <v-icon
                color="error"
                v-on="on"
              >
                mdi-clock-alert
              </v-icon>
            </template>
            <span>{{ overdueAmount(doc.due) }} Overdue</span>
          </v-tooltip>
          <v-chip
            v-if="isPostponed(doc._id)"
            small
            label
            color="info"
          >
            Postponed
          </v-chip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon
                color="secondary"
                v-on="on"
                v-text="doc.description ? 'mdi-text' : ''"
              />
            </template>
            <span v-text="doc.description" />
          </v-tooltip>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <TasksItemsPriority
          :task="doc"
          @set-doc="setDoc()"
        />
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="info"
              :disabled="isPostponed(doc._id)"
              v-on="on"
              @click="postponeTask(doc._id)"
            >
              <v-icon>mdi-update</v-icon>
            </v-btn>
          </template>
          <span>Postpone until tomorrow</span>
        </v-tooltip>
        <v-bottom-sheet
          v-model="sheet"
          :inset="$vuetify.breakpoint.mdAndUp"
          scrollable
        >
          <v-card>
            <v-card-title>
              <TasksItemsTitle
                :id="doc._id"
                :title="doc.title"
                :status="doc.status"
                @set-doc="setDoc()"
              />
            </v-card-title>
            <v-card-text>
              <v-list>
                <TasksItemsDescription
                  :task="doc"
                  @set-doc="setDoc()"
                />
                <TasksItemsProject
                  v-if="doc.type != 'project'"
                  :task="doc"
                  @set-doc="setDoc()"
                />
                <v-list-item>
                  <v-list-item-content>
                    <TasksItemsStatus
                      :task="doc"
                      @set-status="setTaskStatus"
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-divider
                inset
                width="80%"
              />

              <v-tabs background-color="primary">
                <v-tab
                  v-for="field in ['due','start','end']"
                  :key="field"
                >
                  <v-icon left>
                    mdi-calendar
                  </v-icon>
                  <span style="text-transform: capitalize;">{{ field }}</span>
                </v-tab>
                <v-tab-item
                  v-for="field in ['due','start','end']"
                  :key="field"
                >
                  <v-card flat>
                    <v-card-text>
                      <FormDatetime
                        :doc="doc"
                        :field-name="field"
                        @set-doc="setDoc()"
                      />
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs>
              <TasksItemsTags
                :task="doc"
                @set-doc="setDoc()"
              />
              <v-row>
                <v-col>
                  <div>
                    <span>
                      <v-chip
                        v-if="isOverdue"
                        small
                        label
                        color="error"
                      >{{ overdueAmount(doc.due) }} Overdue</v-chip>
                      <v-chip
                        v-if="doc.status == 'done'"
                        small
                        label
                        color="success"
                      >Done</v-chip>
                      <v-chip
                        v-if="isPostponed(doc._id)"
                        small
                        label
                        color="info"
                      >Postponed</v-chip>
                    </span>
                  </div>
                </v-col>
                <!-- 
                (TODO) x-Small btn with brackets for viewing raw document (tied to app - general tool for editing json)
                -->
                <v-col>
                  <tr class="font-weight-thin">
                    <td>ID:</td>
                    <td v-text="doc._id" />
                  </tr>
                </v-col>
                <v-col>
                  <MainDeleteButton :document-id="doc._id" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-bottom-sheet>
      </v-list-item-action>
    </v-list-item>
  </v-lazy>
</template>

<script>
import TasksItemsStatus from "@/components/tasks/TasksItemsStatus.vue";
import TasksItemsTitle from "@/components/tasks/TasksItemsTitle.vue";
import TasksItemsDescription from "@/components/tasks/TasksItemsDescription.vue";
import TasksItemsProject from "@/components/tasks/TasksItemsProject.vue";
import TasksItemsTags from "@/components/tasks/TasksItemsTags.vue";
import TasksItemsPriority from "@/components/tasks/TasksItemsPriority.vue";
//import TasksItemsDates from "@/components/tasks/TasksItemsDates.vue";
import FormDatetime from "@/components/form/formDatetime.vue";
import MainDeleteButton from "@/components/MainDeleteButton.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "TasksItem",
  components: {
    TasksItemsStatus,
    TasksItemsTitle,
    TasksItemsDescription,
    //TasksItemsDates,
    MainDeleteButton,
    TasksItemsProject,
    TasksItemsTags,
    TasksItemsPriority,
    FormDatetime
  },
  mixins: [pouchMixin],
  props: {
    docid: {
      type: String,
      default: null,
    },
  },
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
      let s = this.doc.status;
      return {
        visible: ["done", "cancelled"].includes(s),
        classes:
          s == "done"
            ? "body-1 font-weight-regular success--text isDone"
            : s == "cancelled"
            ? "body-1 font-weight-regular error--text isDone"
            : "text--primary subtitle-1 font-weight-medium"
      };
    },

      activeFab () {
        switch (this.doc.status) {
          case 'done': return { icon: 'mdi-check' }
          case 'cancelled': return { icon: 'mdi-close' }
          default: return {}
        }
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
  /*
  text-decoration: line-through;
  */
  opacity: 0.4;
}
</style>