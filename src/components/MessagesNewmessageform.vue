<template>
    <v-list-item link @click.stop="dialog = true">
        <v-list-item-icon>
            <v-icon>mdi-pen</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
            <v-row>
                <v-dialog v-model="dialog" persistent max-width="50vw">
                <template v-slot:activator="{ on }">
                    <v-btn block small color="primary" v-on="on">New message</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                    <span class="headline">Create a new message</span>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="dialog = false">Cancel</v-btn>
                    <v-btn color="primary" text @click="insertNewEntry">Send</v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row dense>

                                <v-col cols="6">
                                    <v-text-field
                                        v-model="newEntry.sender"
                                        label="Sender"
                                        dense
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field
                                        v-model="newEntry.recipient"
                                        label="Recipient"
                                        dense
                                    ></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field
                                        v-model="newEntry.subject"
                                        label="Subject"
                                        dense
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea
                                        v-model="newEntry.body"
                                        label="Message body"
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
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="dialog = false">Cancel</v-btn>
                    <v-btn color="primary" text @click="insertNewEntry">Send</v-btn>
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
    name: 'MessagesNewmessageform',
    mixins: [newDocumentMixin],
    data: () => ({
        dialog: false,
        newEntry: {
            realm:'messages',
            sender:'',
            recipient:'',
            subject:'',
            body:'',
            tags:[],
            read:false
        }
    }),
    computed: {
        tagsListItems: function () {
            return ["work in progress"];
        }
    },
    watch: {
        dialog: function (d) {
            if (d) {
                let n = this.newEntry;
                n.sender = 'Reporting system';
                n.recipient = 'That machine';
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
                'insertDocument', { doc: n, snackbarText:'Added message: ' + n.subject }
                );
            if (result.ok) {
                this.dialog = false;
            }
        }
    }
}
</script>