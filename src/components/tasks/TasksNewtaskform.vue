<template lang="pug">
    v-list-item(link @click.stop="dialog = true")
        v-list-item-icon
            v-icon mdi-plus
        v-list-item-title
            v-row
                v-dialog(
                    v-model="dialog" persistent max-width="50vw"
                    :fullscreen="$vuetify.breakpoint.mdAndDown"
                    transition="dialog-bottom-transition"
                )
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
                                    form-textfield(
                                        v-model="newTask.title"
                                        label="Title"
                                    )
                                    form-textareafield(
                                        v-model="newTask.description"
                                        label="Description"
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
                                    form-textfield(
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
import formTextfield from '@/components/form/text'
import formTextareafield from '@/components/form/textarea'

export default {
    name: 'TasksNewtaskform',
    components: {
        formTextfield,
        formTextareafield
    },
    mixins: [newDocumentMixin],
    data: () => ({
        dialog: false,
        dateModal: null,
        timeModal: null,
        newTask: {
             title:'',
             description:null,
             //realm:'productivity', // removed in favor of boolean below
             productivity: true,
             type:'task',
             status:'plan',
             priority:4,
             tags:[],
             due: '2020-01-01T01:01:01',
             project:null,
             context:null
        }
    }),
    computed: {
        tagsListItems: function () {
            let tl = this.$store.getters.getTagList;
            
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
                return this.newTask.priority.toString()
            },
            set (radioValue) {
                this.newTask.priority = parseInt(radioValue);
            }
        },
        projectList: function () {
            let pl = this.$store.getters.getOpenProjects;
            let a = pl.map(obj => {
                return obj.project
            })
            return a.sort();
        }
    },
    watch: {
        dialog: function (d) {
            if (d) {
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
                n.project = null; // not needed. Wasting disk space
                console.log('Fix project entry form') // consider using classes
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