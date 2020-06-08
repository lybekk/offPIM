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
      :hide-default-footer="$store.getters.getData.length < 10"
    )
      template(v-slot:default="props")
        v-list(two-line)
          messages-messagelist-item(
            v-for="doc in props.items"
            :key="doc._id"
            :doc="doc"
          )
</template>

<script>
import MessagesMessagelistItem from "@/components/messages/MessagesMessagelistItem.vue";

export default {
  name: "MessagesMessagelist",
  components: {
    MessagesMessagelistItem
  },
  props: ['search'],
  data: () => ({
  }),
  computed: {
    
    messageList() {
      const data = this.$store.getters.getData;
      return data
    }


  },
  methods: {

  }
};
</script>

<style scoped>
.msgLink {
  cursor: pointer;
}
</style>