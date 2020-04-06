<template lang="pug">
  v-dialog(
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    max-width="50vw"
    transition="dialog-bottom-transition"
  )
    //-scrollable ?
    v-card(
      :disabled="isDeleted(msg._id)"
    )
      v-fade-transition
        v-overlay(
          v-if="isDeleted(msg._id)"
          absolute
          color="error"
          z-index="3"
        )
          v-btn(text) Deleted
      v-list(two-line)
        v-list-item
          v-list-item-avatar(color="grey")
          v-list-item-content
            v-list-item-title(class="headline" v-text="msg.subject")
            v-list-item-subtitle Sender:
              span(v-text="msg.sender")
            v-list-item-subtitle Recipient:
              span(v-text="msg.recipient")
          v-list-item-action(@click="$store.commit('setReaderDialog', false)")
            v-btn(text)
              v-icon mdi-close
      v-card-text
        pre(v-text="msg.body")
        br
        hr
        v-row
          v-col Created: 
            time(v-text="msg.created")
          v-col ID: 
            span(v-text="msg._id")
      v-card-actions
        MainDeleteButton(
          v-bind:document-id="msg._id"
        )
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
    dialog: {
      get () {
        return this.$store.getters.isReaderDialogOpen
      },
      set (val) {
        this.$store.commit('setReaderDialog', val)
      }
    }
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
