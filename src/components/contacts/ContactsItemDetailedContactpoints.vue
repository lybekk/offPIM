<template lang="pug">
    v-col(cols="12" sm="4")
        v-list
            v-list-item
                v-list-item-content
                    //- TODO: Subheader/sublist to expand
                    v-list-item-title Additional
                v-list-item-action
                    v-dialog(v-model="dialog" max-width="350px")
                        template(v-slot:activator="{ on }")
                            v-btn(
                                icon
                                color="primary"
                                v-on="on"
                            )
                                v-icon mdi-plus
                        v-card
                            v-card-title
                                span(class="headline") Add additional
                            v-card-text
                                v-container
                                    v-row
                                        v-col(
                                            cols="6" 
                                            sm="12"
                                            )
                                            v-radio-group(
                                                v-model="chosenType"
                                                row
                                            )
                                                v-radio(
                                                    label="Email"
                                                    value="email"
                                                )
                                                v-radio(
                                                    label="Phone"
                                                    value="phone"
                                                )
                                        v-col(
                                            cols="12"
                                        )
                                            v-text-field(
                                                v-if="chosenType == 'email'"
                                                label="Email address"
                                                v-model="emailNew"
                                                hint="name@example.com"
                                                persistent-hint
                                                filled
                                            )
                                            v-text-field(
                                                v-if="chosenType == 'phone'"
                                                label="Phone number"
                                                v-model="phoneNew"
                                                filled
                                            )
                                        v-col(
                                            cols="12"
                                        )
                                            v-text-field(
                                                label="Label/Type"
                                                v-model="contactTypeNew"
                                                hint="Home, Work or other identifier"
                                                persistent-hint
                                                filled
                                            )
                            v-card-actions
                                v-spacer
                                    v-btn(color="blue darken-1" text @click="dialog = false") Cancel
                                    v-btn(color="blue darken-1" text @click="addNewContactPoint") Add
            v-list-item(
                v-for="item,i in doc.contactPoint"
                :key="i"
                dense
            )
                v-list-item-icon(
                    v-if="item.email"
                )
                    v-btn(
                        icon
                        color="primary"
                        :href="'mailto:' + item.email"
                    )
                        v-icon mdi-email
                v-list-item-icon(
                    v-if="item.telephone"
                )
                    v-btn(
                        icon
                        color="primary"
                        :href="'tel:' + item.telephone"
                    )
                        v-icon mdi-phone
                    v-btn(
                        icon
                        color="primary"
                        :href="'sms:' + item.telephone"
                    )
                        v-icon mdi-message
                v-list-item-content
                    v-list-item-title(
                        v-if="item.email"
                        v-text="item.email"
                        )
                    v-list-item-title(
                        v-if="item.telephone"
                        v-text="item.telephone"
                        )
                    v-list-item-subtitle(v-text="item.contactType")
                v-list-item-action
                    v-btn(
                        icon
                        @click="deleteContactPoint(i)"
                    )
                        //- TODO: Delete icon when hovering
                        v-icon mdi-close
</template>

<script>
import itemDetailedMixin from "@/mixins/itemDetailedMixin";
import pouchMixin from "@/mixins/pouchMixin";

export default {
    name: 'contactsitemdetailedemail',
    mixins: [
        pouchMixin,
        itemDetailedMixin
    ],
    data: () => ({
        dialog: false,
        chosenType: 'email',
        emailNew: '',
        phoneNew: '',
        contactTypeNew: '',
    }),
    methods: {

        deleteContactPoint: function (index) {
            let d = this.doc;
            d.contactPoint.splice(index, 1);
            this.setDocField('contactPoint', d.contactPoint);
        },

        addNewContactPoint: async function () {
            let d = this.doc;
            if (!d.contactPoint) {
                 d.contactPoint = []; 
            }
            let item = {
                contactType: this.contactTypeNew
            };
            let c = this.chosenType;
            if (c == 'email') { item.email = this.emailNew }
            if (c == 'phone') { item.telephone = this.phoneNew }
            d.contactPoint.push( item );
            // TODO: Sort list first.

            console.log(this.doc)
            this.setDocField('contactPoint', d.contactPoint);

            this.dialog = false

        },

    }
}
</script>