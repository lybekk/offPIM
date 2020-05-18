<template lang="pug">
  v-container(fluid)
    v-navigation-drawer(
      v-model="drawerRight"
      app
      right
    )
      v-list
        v-list-item
          v-list-item-content
            v-list-item-title(class="title") Messages
            v-list-item-subtitle Total:
              span(v-text="totalMessages")
      v-divider
      v-list(dense nav)
        v-list-item(
          @click="getMessagesByTag(false)"
        )
          v-list-item-icon
            v-icon mdi-inbox
          v-list-item-content
            v-list-item-title Unread
          v-list-item-action
            //- TODO - get from vuex
            v-chip(
              small v-text="tagListUntaggedOnly"
            ) 0
        v-list-item(
          title="Messages without tags end up here"
          @click="getMessagesByTag('untagged')"
        )
          v-list-item-icon
            v-icon mdi-inbox
          v-list-item-content
            v-list-item-title Inbox
          v-list-item-action
            v-chip(
              small v-text="tagListUntaggedOnly"
            ) 0
        v-subheader Tags
        v-list-item-group(v-model="activeTag")
          v-list-item(
            v-for="(tag, i) in tagList"
            :key="i"
            @click="getMessagesByTag(tag.key)"
          )
            v-list-item-icon
              v-icon mdi-tag
            v-list-item-content
              v-list-item-title(class="text-capitalize" v-text="tag.key")
            v-list-item-action
              v-chip(small v-text="tag.value")
        v-subheader Misc
        v-list-item(
        )
          v-list-item-icon
            v-icon mdi-report
          v-list-item-content
            v-list-item-title Session messages
    v-content
      v-toolbar
        v-text-field(
          v-model="search"
          append-icon="mdi-email-search"
          label="Search"
          single-line
          hide-details
        )
        v-spacer
        v-app-bar-nav-icon(
          @click.stop="drawerRight = !drawerRight"
        )
      messages-messagelist(
        v-bind:message-list="messageList"
        v-bind:search="search"
        @get-messages-tag-list="getMessagesTagList"
        @read-message="readMessage"
      )
      messages-reader(
        v-bind:msg="activeMessage" 
      )

</template>

<script>
import MessagesMessagelist from "@/components/MessagesMessagelist.vue";
import MessagesReader from "@/components/MessagesReader.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "messages",
  components: {
    MessagesMessagelist,
    MessagesReader,
  },
  mixins: [pouchMixin],
  props: {
    source: String,
  },
  data: () => ({
    drawerRight: false,
    messageList: [],
    tags: [],
    activeTag: null,
    activeMessageId: null,
    messageReaderDialog: false,
    search: "",
  }),
  computed: {
    totalMessages: function() {
      let x = this.$store.getters.getTotals;
      return x.messages;
    },
    tagList: function() {
      let filtered = this.tags.filter(({ key }) => key !== "untagged");
      return filtered;
    },
    tagListUntaggedOnly: function() {
      const x = this.tags;
      const x2 = x.find(({ key }) => key === "untagged");
      if (typeof x2 == "undefined") {
        return 0;
      } else {
        return x2.value;
      }
    },
    activeMessage: function() {
      const index = this.messageList.findIndex(
        ({ _id }) => _id === this.activeMessageId
      );
      if (index == -1) {
        return false;
      }
      return this.messageList[index];
      //},
    },
  },
  created: function() {},
  mounted() {
    this.$store.dispatch("setMessagesUnreadCount");
    this.getMessagesByTag(false);
    this.getMessagesTagList();
    setTimeout(() => {
      this.drawerRight = true;
    }, 600);
  },
  beforeDestroy() {
    this.drawerRight = false;
  },
  methods: {
    getMessagesByTag: async function(payload) {
      this.messageList = [];
      let tag = payload;
      const vuex = this.$store;
      vuex.commit("loaderActive");
      try {
        const view = !tag
          ? "offpim/messages-unread"
          : "offpim/messages-tag-count";
        const data = await this.getQuery(view, tag, tag, true);
        for await (let doc of data) {
          this.messageList.push(doc);
        }
        this.getMessagesTagList();
      } catch (error) {
        vuex.commit("showSnackbar", { text: error });
      }
      vuex.commit("loaderInactive");
    },
    getMessagesTagList: async function() {
      try {
        var result = await window.db.query("offpim/messages-tag-count", {
          group: true,
        });
        this.tags = result.rows;
      } catch (err) {
        this.$store.commit("addAlert", {
          type: "error",
          text: "Failed fetching message tags: " + err,
        });
      }
    },
    readMessage: function(item) {
      this.$store.commit("setGenericStateBooleanTrue", "dialogItemDetailed");
      this.activeMessageId = item._id;
      if (!item.read) {
        const index = this.messageList.findIndex(({ _id }) => _id === item._id);
        let msg = this.messageList[index];
        msg.read = true;
        this.putDoc(msg);
      }
    },
  },
};
</script>
