<template lang="pug">
  v-container
    br
    v-data-iterator(
      :search="search"
      :items="messageList"
      :loading="$store.getters.loaderState"
      loading-text="Looking..."
      :items-per-page="10"
      no-data-text="No messages"
      item-key="_id"
    )
      template(v-slot:default="props")
        v-list(two-line)
          v-list-item(
            v-for="doc in props.items"
            :key="doc._id"
            link
            )
            v-list-item-icon(
              @click="$emit('read-message', doc)"
            )
              v-icon(v-text="isRead(doc.read)")
            v-list-item-content(
              @click="$emit('read-message', doc)"
            )
              v-list-item-title(v-text="doc.sender" class="title font-weight-regular primary--text")
              v-list-item-subtitle(v-text="doc.subject" class="subtitle-1")
              v-list-item-subtitle(v-text="doc.body")
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
export default {
  name: "MessagesMessagelist",
  components: {},
  props: ['messageList', 'search'],
  data: () => ({
    headers: [
      {
        text: "Read",
        align: "left",
        sortable: false,
        value: "read"
      },
      { text: "From", value: "sender" },
      { text: "Subject", value: "subject" },
      { text: "Actions", value: "actions" }
    ],
    selectedMessages: []
  }),
  computed: {},
  methods: {
    deleteMsg: function(id) {
      this.$store.dispatch("deleteDocument", id);
      this.$emit('get-messages-tag-list')
    },
    isRead: function(state) {
      return ( state ? "mdi-email-open": "mdi-email" )
    },
    isDeleted: function(id) {
      let list = this.$store.getters.getDeletedDocuments;
      if (list.includes(id)) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style scoped>
.msgLink {
  cursor: pointer;
}
</style>