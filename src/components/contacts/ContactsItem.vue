<template lang="pug">
    v-list-item(
        @click="showItemDetailed"
        )
        v-list-item-avatar(color="secondary")
            v-icon(v-if="doc.type == 'person'") mdi-account
            v-icon(v-else) mdi-domain
        v-list-item-content
            v-list-item-title(v-text="displayedName")
    
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
        return [d.givenName, d.additionalName, d.familyName].join(" ");
      } else {
        return d.legalName;
      }
    }
  },
  methods: {}
};
</script>