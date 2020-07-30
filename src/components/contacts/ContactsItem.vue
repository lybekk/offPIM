<template>
  <v-list-item
    :disabled="doc._deleted"
    three-line
    @click="showItemDetailed"
  >
    <v-list-item-icon>
      <v-icon
        :color="doc._deleted ? 'error' : 'secondary'"
        v-text="doc['@type'] == 'Person' ? 'mdi-account' : 'mdi-domain'"
      />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title
        v-if="doc['@type'] == 'Person'"
        v-text="displayedName"
      />
      <v-list-item-subtitle
        :class="doc['@type'] == 'Person' ? '' : 'title font-regular'"
        v-text="doc['@type'] == 'Person' ? doc.familyName : displayedName"
      />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import itemMixin from "@/mixins/itemMixin";

export default {
  name: "Contactsitem",
  mixins: [itemMixin],
  props: {
    doc: {
      type: Object,
      default: () => {},
    }
  },
  computed: {
    displayedName() {
      const d = this.doc;
      if (d._deleted) {
        return "Deleted";
      }
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