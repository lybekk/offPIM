<template>
  <v-container fluid>
    <v-card height="100%">
      <v-card-title>
        Messages
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-email-search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
    </v-card>
    
    <br>

    <v-data-table
      v-model="selectedMessages"
      :search="search"
      :headers="headers"
      :items="this.$store.getters.getMessages"
      :items-per-page="5"
      class="elevation-1"
      no-data-text="No messages"
      item-key="_id"
      show-select
      dense
    >

      <template v-slot:item.read="{ item }">
        <v-icon v-text="isRead(item.read)"></v-icon>
      </template>

      <template v-slot:item.subject="{ item }">
        <div 
          class="msgLink" 
          @click="readMessage(item)"
        >
          <a>{{ item.subject }}</a>
        </div>
      </template>

      <template v-slot:item.sender="{ item }">
        <div 
          class="msgLink" 
          @click="readMessage(item)"
        >
          <a>{{ item.sender }}</a>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn 
          v-if="isDeleted(item._id)"
          text 
          x-small
          disabled
        >
          Deleted
        </v-btn>
        <v-btn v-else text icon
          @click="deleteMsg(item._id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

    </v-data-table>

  </v-container>
</template>

<script>

export default {
  name: 'MessagesMessagelist',
  components: {
  },
  data: () => ({
    search: '',
    headers: [
      {
        text: 'Read',
        align: 'left',
        sortable: false,
        value: 'read',
      },
      { text: 'From', value: 'sender' },
      { text: 'Subject', value: 'subject' },
      { text: 'Actions', value: 'actions' },
    ],
    selectedMessages: []
  }),
  computed: {
  },
  methods: {
    deleteMsg: function(id) {
      this.$store.dispatch('deleteDocument', id);
      this.$store.dispatch('getMessagesTagList');
    },
    readMessage: function(msg) {
      this.$store.commit('setActiveMessage', msg._id)
      if (!msg.read) {
        this.$store.commit('setRead', msg._id);
      }
    },
    isRead: function(state) {
      if (state) {
        return 'mdi-email-open'
      }
      return 'mdi-email'
    },
    isDeleted: function(id) {
      let list = this.$store.getters.getDeletedDocuments;
      if ( list.includes(id) ) {return true}
      return false
    },
  }
};
</script>

<style scoped>
.msgLink {
  cursor: pointer;
}
</style>