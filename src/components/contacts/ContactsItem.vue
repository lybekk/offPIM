<template>
  <v-list-item
    :disabled="doc._deleted"
    @click="showItemDetailed"
  >
    <v-list-item-avatar :color="doc._deleted ? 'error' : 'info'">
      <v-icon v-if="doc['@type'] == 'Person'">
        mdi-account
      </v-icon>
      <v-icon v-else>
        mdi-domain
      </v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title
        class="title font-regular"
        v-text="displayedName"
      />
      <v-list-item-subtitle
        v-if="doc['@type'] == 'Person'"
        class="subtitle-1 font-weight-light"
        v-text="doc.familyName"
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