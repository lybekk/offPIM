<template>
<v-list-item @click="showItemDetailed" :disabled="doc.deleted">
    <v-list-item-avatar :color="doc.deleted ? 'error' : 'info'">
        <v-icon v-if="doc['@type'] == 'Person'">mdi-account</v-icon>
        <v-icon v-else>mdi-domain</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
        <v-list-item-title class="title font-regular" v-text="displayedName"></v-list-item-title>
        <v-list-item-subtitle class="subtitle-1 font-weight-light" v-if="doc['@type'] == 'Person'" v-text="doc.familyName"></v-list-item-subtitle>
    </v-list-item-content>
</v-list-item>

</template>

<script>
import itemMixin from "@/mixins/itemMixin";

export default {
  name: "contactsitem",
  mixins: [itemMixin],
  props: ["doc"],
  computed: {
    displayedName() {
      const d = this.doc;
      if (d.deleted) {return 'Deleted'}
      if (d.givenName) {
        return [d.givenName, d.additionalName].join(" ");
      } else {
        return d.legalName;
      }
    }
  },
  methods: {}
};
</script>