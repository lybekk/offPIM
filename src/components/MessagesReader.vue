<template>
  <v-card 
    :disabled="isDeleted(msg._id)"
    height="100%"
  >
    <v-fade-transition>
      <v-overlay
        v-if="isDeleted(msg._id)"
        absolute
        color="error"
        z-index="3"
      >
        <v-btn text>Deleted</v-btn>
      </v-overlay>
    </v-fade-transition>

    <v-list-item>
      <v-list-item-avatar color="grey"></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline" v-text="msg.subject"></v-list-item-title>
        <v-list-item-subtitle>
          Sender:
          <span v-text="msg.sender"></span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          Recipient:
          <span v-text="msg.recipient"></span>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <pre v-text="msg.body"></pre>
      <br>
      <hr>
      <v-row>
        <v-col>
          Created: 
          <time v-text="msg.created"></time>
        </v-col>
        <v-col>
          ID: 
          <span v-text="msg._id"></span>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <!-- 
        Mark Unread
        Mark Read
        <a @click="activeMsgMarkRead">
            Mark as read
        </a> · 
        <a @click="deleteActiveMsg">
            Delete
        </a> · 
        <a onclick="notify('Archiving N/A yet', 'is-warning', 4000)">
            Archive
        </a>
      -->
      <MainDeleteButton 
        v-bind:document-id="msg._id"
      />
    </v-card-actions>

  </v-card>


</template>

<script>
import MainDeleteButton from '@/components/MainDeleteButton.vue'

export default {
  name: 'MessagesReader',
  components: {
    MainDeleteButton
  },
  props: ['msg'],
  data: () => ({
  }),
  computed: {
    /*
    msg: function () {
      return this.$store.getters.getActiveMessage
    },
    */
  },
  methods: {
    isDeleted: function(id) {
      let list = this.$store.getters.getDeletedDocuments;
      if ( list.includes(id) ) {return true}
      return false
    },
  }
};
</script>
