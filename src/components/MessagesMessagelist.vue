<template lang="pug">
  v-container
    v-data-table(
      v-model="selectedMessages"
      :search="search"
      :headers="headers"
      :items="messageList"
      :items-per-page="10"
      class="elevation-1"
      no-data-text="No messages"
      item-key="_id"
      show-select
      dense
    )
      template(v-slot:item.read="{ item }")
        v-icon(v-text="isRead(item.read)")
      template(v-slot:item.subject="{ item }")
        div(class="msgLink" @click="$emit('read-message', item)")
          a {{ item.subject }}
      template(v-slot:item.sender="{ item }")
        div(class="msgLink" @click="$emit('read-message', item)")
          a {{ item.sender }}
      template(v-slot:item.actions="{ item }")
        v-btn(
          v-if="isDeleted(item._id)" 
          text 
          x-small 
          disabled
        ) Deleted
        v-btn(
          v-else 
          text 
          icon 
          @click="deleteMsg(item._id)"
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