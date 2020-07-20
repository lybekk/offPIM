<template>
  <v-list-item link>
    <v-list-item-icon @click="readMessage">
      <v-icon v-text="isRead(doc.dateRead)" />
    </v-list-item-icon>
    <v-list-item-content @click="readMessage">
      <v-list-item-title
        class="title font-weight-regular primary--text"
        v-text="doc.sender.name"
      />
      <v-list-item-subtitle
        class="subtitle-1"
        v-text="doc.messageAttachment.headline"
      />
      <v-list-item-subtitle v-text="doc.messageAttachment.text" />
    </v-list-item-content>
    <v-list-item-action>
      <v-btn
        v-if="isDeleted(doc._id)"
        text
        x-small
        disabled
      >
        Deleted
      </v-btn>
      <v-btn
        v-else
        text
        icon
        @click="deleteMsg(doc._id)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import itemMixin from "@/mixins/itemMixin";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "MessagesMessagelistItem",
  mixins: [pouchMixin, itemMixin],
  props: {
      doc: {
          type: Object,
          default: () => {},
      },
  },
  methods: {
    deleteMsg: function(id) {
      this.deleteDoc(id);
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
