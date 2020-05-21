<template lang="pug">
  v-dialog(
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    max-width="50vw"
    transition="dialog-bottom-transition"
  )
    v-card(
      :disabled="isDeleted(msg._id)"
    )
      v-card-title(v-text="msg.subject")
      v-fade-transition
        v-overlay(
          v-if="isDeleted(msg._id)"
          absolute
          color="error"
          z-index="3"
        )
          v-btn(
            text
            @click="$store.commit('setGenericStateBooleanFalse', 'dialogItemDetailed');"
          ) Deleted
            v-icon mdi-close
      v-list(three-line)
        v-list-item
          v-list-item-avatar(color="grey")
            v-icon mdi-account
          v-list-item-content
            v-list-item-title.headline
              span(v-text="msg.sender")
            v-list-item-subtitle.subtitle-1 To:
              span(class="subtitle" v-text="msg.recipient")
          v-list-item-action(@click="$store.commit('setGenericStateBooleanFalse', 'dialogItemDetailed');")
            v-btn(text)
              v-icon mdi-close
      v-card-text
        v-row
          v-col(cols="12")
            pre(
              v-text="msg.body"
              class="body-2"
              )
          v-col(cols="12")
            v-divider
          v-col.body-1 Created: 
            time(v-text="new Date(this.msg.created)")
          v-col.body-1 ID: 
            span(v-text="msg._id")
      v-card-actions
        MainDeleteButton(
          v-bind:document-id="msg._id"
        )
</template>

<script>
import MainDeleteButton from "@/components/MainDeleteButton.vue";

export default {
  name: "MessagesReader",
  components: {
    MainDeleteButton
  },
  props: ["msg"],
  data: () => ({}),
  computed: {
    msgCreated() {
      return new Date(this.msg.created);
    },
    dialog: {
      get() {
        return this.$store.getters.dialogItemDetailed;
      },
      set(val) {
        const mutation = val
          ? "setGenericStateBooleanTrue"
          : "setGenericStateBooleanFalse";
        this.$store.commit(mutation, "dialogItemDetailed");
      }
    }
  },
  methods: {
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
pre {
  white-space: pre-wrap;
}
</style>