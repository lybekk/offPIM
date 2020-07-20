<template lang="pug">
    v-col(cols="12" sm="4")
        v-list
            v-list-item
                v-list-item-content
                    v-list-item-title Occupation
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
                                span(class="headline") Add occupation
                            v-card-text
                                v-container
                                    v-row
                                        v-col(
                                            cols="6" 
                                            sm="12"
                                            )
                                            v-text-field(
                                                label="Label"
                                                v-model="entry.label"
                                                hint="Label/Identifier"
                                                filled
                                            )
                                            v-text-field(
                                                label="Phone number"
                                                v-model="entry.telephone"
                                                hint="Phone number, including country code prefix"
                                                filled
                                            )
                            v-card-actions
                                v-spacer
                                    v-btn(color="blue darken-1" text @click="dialog = false") Cancel
                                    v-btn(color="blue darken-1" text @click="addNew") Add
            v-list-item(
                v-for="item,i in doc.telephones"
                :key="i"
                two-line
            )
                v-list-item-icon(
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
                    v-list-item-title {{ item.telephone }}
                    v-list-item-subtitle {{ item.label }}
                v-list-item-action
                    v-btn(
                        icon
                        @click="deleteTelephone(i)"
                    )
                        //- TODO: 'mdi-close'/delete icon when hovering
                        v-icon mdi-close
</template>

<script>
import itemDetailedMixin from "@/mixins/itemDetailedMixin";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "Contactsitemdetailedoccupations",
  mixins: [pouchMixin, itemDetailedMixin],
  data: () => ({
    dialog: false,
    entry: {}
  }),
  methods: {
    deleteTelephone: async function(index) {
      let d = this.doc;
      d.telephones.splice(index, 1);
      this.setDocField("telephones", d.telephones);
    },

    addNew: async function() {
      let d = this.doc;
      if (!d.telephones) {
        d.telephones = [];
      }
      d.telephones.push({ ...this.entry });

      this.setDocField("telephones", d.telephones);

      this.dialog = false;
    }
  }
};
</script>