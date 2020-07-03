<template lang="pug">
    v-list-item(
        @click="showItemDetailed"
        )
        v-list-item-avatar(color="info")
            v-icon(v-if="doc['@type'] == 'Person'") mdi-account
            v-icon(v-else) mdi-domain
        v-list-item-content
            v-list-item-title(
              class="title font-regular"
              v-text="displayedName"
            )
            v-list-item-subtitle(
              v-if="doc['@type'] == 'Person'"
              v-text="doc.familyName"
              class="subtitle-1 font-weight-light"
            )
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