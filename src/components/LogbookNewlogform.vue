<template>
    <v-list-item link @click.stop="dialog = true">
        <v-list-item-icon>
            <v-icon>mdi-pen</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
            <v-row>
                <v-dialog v-model="dialog" persistent max-width="50vw">
                <template v-slot:activator="{ on }">
                    <v-btn block small color="primary" v-on="on">New entry</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                    <span class="headline">Create a new log entry</span>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="dialog = false">Close</v-btn>
                    <v-btn color="primary" text @click="insertNewEntry">Save</v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row dense>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="newEntry.title"
                                        label="Title"
                                        dense
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="newEntry.category"
                                        label="Category"
                                        dense
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" >
                                    <v-textarea
                                        v-model="newEntry.description"
                                        label="Details/Description"
                                        rows="3"
                                        filled
                                        dense
                                    ></v-textarea>
                                </v-col>
                                <v-col cols="12">
                                    <v-combobox
                                    v-model="newEntry.tags"
                                    :items="tagsListItems"
                                    label="Tags"
                                    multiple
                                    chips
                                    dense
                                    ></v-combobox>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-menu
                                        v-model="startDateModal"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="pickerStartDate"
                                            label="Start date"
                                            prepend-icon="mdi-calendar"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="pickerStartDate" @input="startDateModal = false">
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="11" sm="5">
                                    <v-menu
                                        ref="starttimemodal"
                                        v-model="startTimeModal"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        :return-value.sync="pickerStartTime"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="pickerStartTime"
                                            label="Due time"
                                            prepend-icon="mdi-clock"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                        </template>
                                        <v-time-picker
                                        v-if="startTimeModal"
                                        v-model="pickerStartTime"
                                        format="24hr"
                                        full-width
                                        @click:minute="$refs.starttimemodal.save(pickerStartTime)"
                                        ></v-time-picker>
                                    </v-menu>
                                </v-col>

                                <v-col cols="12" sm="6" md="4">
                                    <v-menu
                                        v-model="endDateModal"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="pickerEndDate"
                                            label="End date"
                                            prepend-icon="mdi-calendar"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="pickerEndDate" @input="endDateModal = false">
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="11" sm="5">
                                    <v-menu
                                        ref="endtimemodal"
                                        v-model="endTimeModal"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        :return-value.sync="pickerEndTime"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="pickerEndTime"
                                            label="End time"
                                            prepend-icon="mdi-clock"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                        </template>
                                        <v-time-picker
                                        v-if="endTimeModal"
                                        v-model="pickerEndTime"
                                        format="24hr"
                                        full-width
                                        @click:minute="$refs.endtimemodal.save(pickerEndTime)"
                                        ></v-time-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </v-container>

                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="dialog = false">Close</v-btn>
                    <v-btn color="primary" text @click="insertNewEntry">Save</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-row>
        </v-list-item-title>
    </v-list-item>
</template>

<script>
import newDocumentMixin from '@/mixins/newDocumentMixin'

export default {
    name: 'TasksNewtaskform',
    mixins: [newDocumentMixin],
    data: () => ({
        dialog: false,
        startDateModal: null,
        startTimeModal: null,
        endDateModal: null,
        endTimeModal: null,
        newEntry: {
             title:'',
             description:null,
             realm:'logs',
             tags:[],
             start: '2020-01-01T01:01:01',
             end: '2020-01-01T01:01:01',
             category:null,
        }
    }),
    computed: {
        tagsListItems: function () {
            return ["work in progress"]; // TEMP
        },
        pickerStartDate: {
            get () {
                return this.newEntry.start.substring(0,10);
            },
            set (pickerValue) {
                let old = this.newEntry.start.substring(0,10);
                var newDate = this.newEntry.start.replace(old, pickerValue);
                this.newEntry.start = newDate;
            }
        },
        pickerStartTime: {
            get () {
                return this.newEntry.start.substring(11,16); //hhmm
            },
            set (pickerValue) {
                let old = this.newEntry.start.substring(11,16);
                var newTime = this.newEntry.start.replace(old, pickerValue);
                this.newEntry.start = newTime;
            }
        },
        pickerEndDate: {
            get () {
                return this.newEntry.end.substring(0,10);
            },
            set (pickerValue) {
                let old = this.newEntry.end.substring(0,10);
                var newDate = this.newEntry.end.replace(old, pickerValue);
                this.newEntry.end = newDate;
            }
        },
        pickerEndTime: {
            get () {
                return this.newEntry.end.substring(11,16);
            },
            set (pickerValue) {
                let old = this.newEntry.end.substring(11,16);
                var newTime = this.newEntry.end.replace(old, pickerValue);
                this.newEntry.end = newTime;
            }
        }
    },
    watch: {
        dialog: function (d) {
            if (d) {
                let dt = new Date();
                let n = this.newEntry;
                n.start = dt.toISOString();
                n.end = dt.toISOString();
                n.title = '';
                n.description = '';
                n.tags = [];
            }
        }
    },
    created () {
    },
    methods: {
        insertNewEntry: async function () {
            var now = new Date().toISOString();
            let n = this.newEntry;
            n._id = this.generateUUID();
            n.created = now;

            let result = await this.$store.dispatch(
                'insertDocument', { doc: n, snackbarText:'Added log entry: ' + n.title }
                );
            if (result.ok) {
                this.dialog = false;
            }
        }
    }
}
</script>