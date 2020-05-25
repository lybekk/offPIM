<template lang="pug">
    v-bottom-sheet(
        v-model="dialogItemDetailed"
        :inset="$vuetify.breakpoint.mdAndUp"
        scrollable
    )
        v-card
            v-card-text
                v-container
                    v-row
                        v-col(cols="12" sm="4")
                            v-text-field(
                                label="Given name"
                                class="title"
                                :value="doc.givenName"
                                @change="setDocField('givenName',$event)"
                                filled
                            )
                        v-col(cols="12" sm="4")
                            v-text-field(
                                label="Additional/middle name"
                                class="title"
                                :value="doc.additionalName"
                                @change="setDocField('additionalName',$event)"
                                filled
                            )
                        v-col(cols="12" sm="4")
                            v-text-field(
                                label="Family/last name"
                                class="title"
                                :value="doc.familyName"
                                @change="setDocField('familyName',$event)"
                                filled
                            )
                        v-col(cols="12" sm="4")
                            v-text-field(
                                label="Gender"
                                :value="doc.gender"
                                @change="setDocField('gender',$event)"
                                filled
                            )
                        v-col(cols="12" sm="4")
                            v-text-field(
                                label="Nationality"
                                :value="doc.nationality"
                                @change="setDocField('nationality',$event)"
                                filled
                            )
                        v-col(cols="12" sm="4")
                            v-combobox(
                                :value="doc.tags"
                                label="Tags/labels"
                                filled
                                multiple
                                chips
                                deletable-chips
                                @change="setDocField('tags',$event)"
                            )
                        v-col(cols="12" sm="4")
                            v-combobox(
                                :value="doc.knowsAbout"
                                label="Expertise/skills"
                                filled
                                multiple
                                chips
                                deletable-chips
                                @change="setDocField('knowsAbout',$event)"
                            )
                                //- TODO: Get tags from loaded items in array
                        v-col(cols="12" sm="4")
                            v-date-picker(
                                :value="birthDateComputed"
                                @change="setDate('birthDate',$event)"
                            )
                        v-col(cols="12" sm="4")
                            v-textarea(
                                :value="doc.description"
                                rows="2"
                                filled
                                auto-grow
                                label="Notes/Description"
                                @change="setDocField('description',$event)"
                            )
                        v-col(cols="12" sm="4")
                            v-text-field(
                                label="Spouse ID"
                                hint="Insert document ID for spouse to enable lookup"
                                :value="spouseId"
                                @change="setSpouse('identifier',$event)"
                                :error-messages="spouseIdMatch ? '' : 'Spouse document not found'"
                                filled
                                clearable
                            )
                        v-col(cols="12" sm="4")
                            v-text-field(
                                label="Spouse name"
                                :value="spouseName"
                                @change="setSpouse('name',$event)"
                                filled
                            )
                    v-row
                        v-col
                            p {{ doc._id }}
            v-card-actions
                v-btn(
                    icon
                    @click="$store.dispatch('setRawDocumentViewerDocument', doc._id)"
                )
                    v-icon mdi-code-braces-box
</template>

<script>
import itemDetailedMixin from "@/mixins/itemDetailedMixin";
import pouchMixin from "@/mixins/pouchMixin";

export default {
    name: 'contactsitemdetailed',
    mixins: [
        pouchMixin,
        itemDetailedMixin
    ],
    data: () => ({
        spouseIdMatch: true,
    }),
    computed: {

        spouseName() {
            try {
                return this.doc.spouse.name
            } catch {
                return null
            }
        },

        spouseId() {
            try {
                return this.doc.spouse.identifier
            } catch {
                return null;
            }

        },

        birthDateComputed() {
            const d = this.doc.birthDate;
            if(d) {
                return new Date(d).toISOString().substr(0, 10)
            } else {
                return false
            }
        }
    },
    methods: {
        setDate: function (key, value) {
            const dateValue = new Date(value).toISOString();
            this.setDocField(key, dateValue);
        },
        setSpouse: async function (key, value) {
            // TODO: Needs code optimization/minifying
            let freshDoc = await this.getDoc(this.doc._id);
            if (!freshDoc.spouse) { freshDoc.spouse = {} }

            if (key == 'identifier') {
                try {
                    if (value) {
                        let spouseDoc = await this.getDoc(value, true);

                        freshDoc.spouse = {
                            identifier: value,
                            name: [spouseDoc.givenName, spouseDoc.familyName].join(' ')
                        };
    
                        this.spouseIdMatch = true;
                    } else {
                        freshDoc.spouse = {
                            identifier: null,
                            name: null
                        };
                        this.spouseIdMatch = true;
                    }
                        this.setDocField('spouse', freshDoc.spouse)
                } catch {
                    this.spouseIdMatch = false;
                }
            }
            if (key == 'name') {
                freshDoc.spouse.name = value;
                this.setDocField('spouse', freshDoc.spouse)
            }

        },

    }
}
</script>