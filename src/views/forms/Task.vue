<template lang="pug">
  v-container
    v-card(flat)
        v-card-title
            v-radio-group(v-model="newTask.type" row dense)
                v-radio(label="Task" value="task")
                v-radio(label="Project" value="project")
            v-spacer
            submitButton(:doc="doc")
        v-card-text
            v-container
                v-row
                    v-col(cols="12")
                      v-text-field(
                        v-model="newTask.title"
                        autofocus
                        label="Title"
                      )
                    v-col(cols="12")
                      v-textarea(
                        v-model="newTask.description"
                        label="Description"
                        rows="3"
                        filled
                        dense
                      )
                    v-col(cols="12")
                        v-radio-group(v-model="newTask.status" label="Status" row)
                            v-radio(label="Wait" value="wait")
                            v-radio(label="Plan" value="plan")
                            v-radio(label="Todo" value="todo")
                            v-radio(label="Next" value="next")
                            v-radio(label="Doing" value="doing")
                    v-col(v-if="newTask.type == 'task'" cols="6")
                        v-overflow-btn(
                            v-model="newTask.project"
                            class="my-2"
                            :items="projectList"
                            label="Project"
                            item-text="text"
                            item-value="value"
                            editable
                        )
                    v-col(cols="6")
                        v-combobox(
                            v-model="newTask.tags"
                            :items="tagsListItems"
                            label="Tags"
                            outlined
                            multiple
                            chips
                        )
                    v-col(cols="12")
                        v-radio-group(v-model="newTaskPriority" label="Priority" dense)
                            v-radio(label="1. Important - Urgent" value="1")
                            v-radio(label="2. Important - Not urgent" value="2")
                            v-radio(label="3. Not Important - Urgent" value="3")
                            v-radio(label="4. Not Important - Not urgent" value="4")
                //- TODO Consider using v-tabs for dates
                v-row(dense)
                    v-col(cols="12" sm="6" md="4")
                        v-menu(
                            v-model="dateModal"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                        )
                            template(v-slot:activator="{ on }")
                                v-text-field(
                                    v-model="pickerDate"
                                    label="Due date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                                )
                            v-date-picker(v-model="pickerDate" @input="dateModal = false")
                    v-col(cols="11" sm="5")
                        v-menu(
                            ref="timemodal"
                            v-model="timeModal"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="pickerTime"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                        )
                            template(v-slot:activator="{ on }")
                                v-text-field(
                                    v-model="pickerTime"
                                    label="Due time"
                                    prepend-icon="mdi-clock"
                                    readonly
                                    v-on="on"
                                )
                            v-time-picker(
                                v-if="timeModal"
                                v-model="pickerTime"
                                format="24hr"
                                full-width
                                @click:minute="$refs.timemodal.save(pickerTime)"
                            )
                //- WAIT - Implement after project lookup by context has been implemented
                //-v-row
                  v-col(cols="6")
                    v-text-field(
                      v-model="newTask.context"
                      label="Context"
                    )

</template>

<script>
import SubmitButton from "@/components/form/submit";

export default {
  name: "formsNewTask",
  components: {
    SubmitButton
  },
  data: () => ({
    dialog: false,
    dateModal: null,
    timeModal: null,
    newTask: {
      title: "",
      description: null,
      productivity: true,
      type: "task",
      status: "plan",
      priority: 4,
      tags: [],
      due: new Date().toISOString(),
      end: null,
      project: null,
      context: null
    }
  }),
  computed: {
    doc() {
      var now = new Date().toISOString();
      const doc = { ...this.newTask };
      doc.created = now;
      doc.start = now;
      doc.priority = parseInt(this.newTask.priority); // TODO - use Vue's built-in number handling

      if (doc.type == "project") {
        delete doc.project;
      }

      return doc;
    },
    tagsListItems: function() {
      let tl = this.$store.getters.getTagList;

      let a = tl.map(obj => {
        return obj.key;
      });

      return a;
    },
    pickerDate: {
      get() {
        let d = this.newTask.due.substring(0, 10);
        return d;
      },
      set(pickerValue) {
        let old = this.newTask.due.substring(0, 10);
        var newDate = this.newTask.due.replace(old, pickerValue);
        this.newTask.due = newDate;
      }
    },
    pickerTime: {
      get() {
        let hhmm = this.newTask.due.substring(11, 16);
        return hhmm;
      },
      set(pickerValue) {
        let old = this.newTask.due.substring(11, 16);
        var newTime = this.newTask.due.replace(old, pickerValue);
        this.newTask.due = newTime;
      }
    },
    // TODO - use Vue's built-in number handling
    newTaskPriority: {
      get() {
        return this.newTask.priority.toString();
      },
      set(radioValue) {
        this.newTask.priority = parseInt(radioValue);
      }
    },
    projectList: function() {
      let pl = this.$store.getters.getOpenProjects;
      let arr = pl.map(obj => {
        return { text: obj.title, value: obj._id };
      });
      return arr.sort((a, b) => (a.text > b.text) - (a.text < b.text));
    }
  },
  mounted() {
    if (!this.$store.getters.getOpenProjects.length) {
      this.$store.dispatch("populateOpenProjects");
    }
  }
};
</script>