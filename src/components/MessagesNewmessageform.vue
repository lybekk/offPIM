<template lang="pug">
    v-dialog(
        v-model="dialog" 
        persistent 
        :fullscreen="$vuetify.breakpoint.mdAndDown"
        max-width="50vw"
        transition="dialog-bottom-transition"
    )
        template(v-slot:activator="{ on }")
            v-btn(
                color="primary"
                fab
                small
                absolute
                bottom
                right
                v-on="on"
            )
                v-icon mdi-plus
        v-card
            v-card-title
                span(class="headline") Create a new message
                v-spacer
                v-btn(color="error" text @click="dialog = false") Cancel
                v-btn(color="primary" text @click="insertNewEntry") Send
            v-card-text
                v-container
                    v-row(dense)
                        v-col(cols="6")
                            v-text-field(
                                v-model="newEntry.sender"
                                label="Sender"
                                dense
                            )
                        v-col(cols="6")
                            v-text-field(
                                v-model="newEntry.recipient"
                                label="Recipient"
                                dense
                            )
                        v-col(cols="12")
                            v-text-field(
                                v-model="newEntry.subject"
                                label="Subject"
                                dense
                            )
                        v-col(cols="12")
                            v-textarea(
                                v-model="newEntry.body"
                                label="Message body"
                                rows="3"
                                filled
                                dense
                            )
                        v-col(cols="12")
                            v-combobox(
                                v-model="newEntry.tags"
                                :items="tagsListItems"
                                label="Tags"
                                multiple
                                chips
                                dense
                            )
            v-card-actions
                v-spacer
                v-btn(color="error" text @click="dialog = false") Cancel
                v-btn(color="primary" text @click="insertNewEntry") Send
</template>

<script>
import newDocumentMixin from '@/mixins/newDocumentMixin'

export default {
    name: 'MessagesNewmessageform',
    mixins: [newDocumentMixin],
    data: () => ({
        dialog: false,
        newEntry: {
            message: true,
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