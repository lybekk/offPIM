<template lang="pug">
v-list-item(
  link
)
  v-list-item-icon(
    @click="readMessage"
  )
    v-icon(v-text="isRead(doc.dateRead)")
  v-list-item-content(
    @click="readMessage"
  )
    v-list-item-title(v-text="doc.sender.name" class="title font-weight-regular primary--text")
    v-list-item-subtitle(v-text="doc.messageAttachment.headline" class="subtitle-1")
    v-list-item-subtitle(v-text="doc.messageAttachment.text")
  v-list-item-action
    v-btn(
      v-if="isDeleted(doc._id)"
      text 
      x-small 
      disabled
    ) Deleted
    v-btn(
      v-else 
      text 
      icon 
      @click="deleteMsg(doc._id)"
    )
      v-icon mdi-delete
</template>

<script>
import itemMixin from "@/mixins/itemMixin";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "MessagesMessagelistItem",
  mixins: [pouchMixin, itemMixin],
  props: ["doc"],

  methods: {
    deleteMsg: function(id) {
      this.$store.dispatch("deleteDocument", id);
      this.$store.dispatch("populateTagsList", "offpim/messages-tag-count");
    },

    isRead: function(state) {
      return state ? "mdi-email-open" : "mdi-email";
    },

    isDeleted: function(id) {
      let list = this.$store.getters.getDeletedDocuments;
      if (list.includes(id)) {
        return true;
      }
      return false;
    },

    readMessage: async function() {
      this.showItemDetailed();
      this.$store.commit("setGenericStateBooleanTrue", "dialogItemDetailed");
      const d = this.doc;
      if (!d.dateRead && d._id) {
        d.dateRead = new Date().toISOString();
        this.putDoc(d, "silent");
        this.$store.dispatch("refreshDoc", d._id);
      }
    }
  }
};
</script>
