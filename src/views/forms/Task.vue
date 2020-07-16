<template lang="pug">
  v-container
    v-card(flat)
        v-card-title
          v-radio-group(
            v-model="newTask.type"
            row
            hide-details
          )
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
                  filled
                  hide-details
                )
              v-col(cols="12")
                v-textarea(
                  v-model="newTask.description"
                  label="Description"
                  rows="3"
                  filled
                  hide-details
                )
              v-col(cols="6")
                v-radio-group(
                  v-model="newTask.status" 
                  label="Status" 
                  hide-details
                  )
                    v-radio(
                      v-for="status in statuses"
                      :key="status"
                      :label="status"
                      :value="status"
                      style="text-transform: capitalize"
                    )
              v-col(cols="6")
                v-radio-group(v-model="newTaskPriority" label="Priority" dense)
                  v-tooltip(
                    v-for="pri in priorities"
                    :key="pri[1]"
                    top
                  ) {{ pri[0] }}
                    template(v-slot:activator="{ on }")
                      v-radio(
                        :label="pri[1]"
                        :value="pri[1]"
                        v-on="on"
                      )
              v-col(v-if="newTask.type == 'task'" cols="12" sm="12")
                  v-select(
                      v-model="newTask.project"
                      :items="projectList"
                      label="Project"
                      item-text="text"
                      item-value="value"
                      filled
                      hide-details
                  )
              v-col(cols="12" sm="6" md="4")
                  //- TODO Consider using v-tabs for dates
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
                              outlined
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
                              outlined
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
              v-col(cols="12" sm="6")
                  v-combobox(
                      v-model="newTask.tags"
                      :items="tagsListItems"
                      label="Tags"
                      filled
                      multiple
                      chips
                      hide-details
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
      due: null,
      //due: new Date().toISOString(),
      end: null,
      project: null,
      context: null
    },
    priorities: [
      ["1. Important - Urgent", "1"],
      ["2. Important - Not urgent", "2"],
      ["3. Not Important - Urgent", "3"],
      ["4. Not Important - Not urgent", "4"],
    ],
    statuses: [
      "wait",
      "plan",
      "todo",
      "next",
      "doing",
    ]
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
        //let d = this.newTask.due.substring(0, 10);
        let d = this.newTask.due ? this.newTask.due.substring(0, 10) : null;
        return d;
      },
      set(pickerValue) {
        var due = this.newTask.due;
        if (due === null) { due = new Date().toISOString() ; console.log (this.newTask.due)}
        let old = due.substring(0, 10);
        var newDate = due.replace(old, pickerValue);
        this.newTask.due = newDate;
      }
    },
    pickerTime: {
      get() {
        //let hhmm = this.newTask.due.substring(11, 16);
        let hhmm = this.newTask.due ? this.newTask.due.substring(11, 16) : null;
        return hhmm;
      },
      set(pickerValue) {
        var due = this.newTask.due;
        if (due === null) { due = new Date().toISOString() }

        let old = due.substring(11, 16);
        var newTime = due.replace(old, pickerValue);
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