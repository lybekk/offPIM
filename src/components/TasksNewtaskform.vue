<template lang="pug">
    v-list-item(link @click.stop="dialog = true")
        v-list-item-icon
            v-icon mdi-plus
        v-list-item-title
            v-row
                v-dialog(v-model="dialog" persistent max-width="50vw")
                    template(v-slot:activator="{ on }")
                        v-btn(block small color="primary" v-on="on") New
                    v-card
                        v-card-title
                            span(class="headline") Create new
                            v-col(cols="auto")
                                v-radio-group(v-model="newTask.type" row dense)
                                    v-radio(label="Task" value="task")
                                    v-radio(label="Project" value="project")
                            v-spacer
                            v-btn(color="error" text @click="dialog = false") Close
                            v-btn(color="primary" text @click="insertNewTask") Save
                        v-card-text
                            v-container
                                v-row(dense)
                                    v-col(cols="12")
                                        v-text-field(
                                            v-model="newTask.title"
                                            label="Title"
                                            dense
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
                                        v-combobox(
                                            v-model="newTask.tags"
                                            :items="tagsListItems"
                                            label="Tags"
                                            multiple
                                            chips
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
                                            editable
                                            item-value="text"
                                        )
                                    v-col(cols="auto")
                                        v-spacer
                                        v-text-field(
                                            v-model="newTask.context"
                                            label="Context"
                                        )
                                    v-col(cols="12")
                                        v-radio-group(v-model="newTaskPriority" label="Priority" dense)
                                            v-radio(label="1. Important - Urgent" value="1")
                                            v-radio(label="2. Important - Not urgent" value="2")
                                            v-radio(label="3. Not Important - Urgent" value="3")
                                            v-radio(label="4. Not Important - Not urgent" value="4")
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
                        v-card-actions
                            v-spacer
                            v-btn(color="error" text @click="dialog = false") Close
                            v-btn(color="primary" text @click="insertNewTask") Save
</template>

<script>
import newDocumentMixin from '@/mixins/newDocumentMixin'

export default {
    name: 'TasksNewtaskform',
    mixins: [newDocumentMixin],
    data: () => ({
        dialog: false,
        dateModal: null,
        timeModal: null,
        newTask: {
             title:'',
             description:null,
             realm:'productivity',
             type:'task',
             status:'plan',
             priority:4,
             tags:[],
             due: '2020-01-01T01:01:01',
             project:null,
             context:null
        },
        projectList: [
            /*
            { text: '100%' },
            { text: '0%' },
            */
        ]
    }),
    computed: {
        tagsListItems: function () {
            let tl = this.$store.getters.getTasksTagsList;
            
            let a = tl.map(obj => {
                return obj.key
            })

            return a;
        },
        pickerDate: {
            get () {
                let d = this.newTask.due.substring(0,10);
                return d
            },
            set (pickerValue) {
                let old = this.newTask.due.substring(0,10);
                var newDate = this.newTask.due.replace(old, pickerValue);
                this.newTask.due = newDate;
            }
        },
        pickerTime: {
            get () {
                let hhmm = this.newTask.due.substring(11,16);
                return hhmm
            },
            set (pickerValue) {
                let old = this.newTask.due.substring(11,16);
                var newTime = this.newTask.due.replace(old, pickerValue);
                this.newTask.due = newTime;
            }
        },
        newTaskPriority: {
            get () {
                //this.newTask.priority;
                return this.newTask.priority.toString()
            },
            set (radioValue) {
                this.newTask.priority = parseInt(radioValue);
            }
        }
    },
    watch: {
        dialog: function (d) {
            if (d) {
                let pl = this.$store.getters.getOpenProjects;
                let a = pl.map(obj => {
                    return obj.project
                })
                this.projectList = a;

                let dt = new Date();
                let n = this.newTask;
                n.type = 'task';
                n.due = dt.toISOString();
                n.title = '';
                n.description = '';
                n.status = 'plan';
                n.priority = 4;
                n.tags = [];
                n.project = null;
                n.context = null;
            }
        }
    },
    methods: {
        insertNewTask: async function () {
            var now = new Date().toISOString();
            let n = this.newTask;
            n._id = this.generateUUID();
            n.created = now;
            n.start = now;
            n.end = null;
            n.priority = parseInt(this.newTask.priority);

            if (n.type == 'project') {
                n.project = n.title
            }

            let result = await this.$store.dispatch(
                'insertDocument', { doc: n, snackbarText:'Added task: ' + n.title }
                );
            if (result.ok) {
                this.dialog = false;
            }
        },
    }
}
</script>