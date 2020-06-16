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
          :to="{ name: 'messages'}"
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
          :to="{ name: 'messages', params: { tag: 'untagged'}}"
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
            :to="{ name: 'messages', params: { tag: tag.key }}"
          )
            v-list-item-icon
              v-icon mdi-tag
            v-list-item-content
              v-list-item-title(class="text-capitalize" v-text="tag.key")
            v-list-item-action
              v-chip(small v-text="tag.value")
        v-subheader Misc
        v-list-item(
          @click="getSessionLogs()"
        )
          v-list-item-icon
            v-icon mdi-console
          v-list-item-content
            v-list-item-title System messages
    v-content
      v-toolbar(flat)
        v-text-field(
          v-if="$store.getters.getData.length > 10"
          v-model="search"
          append-icon="mdi-email-search"
          label="Filter"
          single-line
          hide-details
        )
        v-spacer
        v-app-bar-nav-icon(
          @click.stop="drawerRight = !drawerRight"
        )
      messages-messagelist(
        v-bind:search="search"
      )
      messages-reader

</template>

<script>
import MessagesMessagelist from "@/components/MessagesMessagelist.vue";
import MessagesReader from "@/components/MessagesReader.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "messages",
  components: {
    MessagesMessagelist,
    MessagesReader
  },
  mixins: [pouchMixin],
  props: {
    source: String
  },
  data: () => ({
    drawerRight: false,
    activeTag: null,
    messageReaderDialog: false,
    search: ""
  }),
  computed: {

    totalMessages: function() {
      let x = this.$store.getters.getTotals;
      return x.messages;
    },

    tagList: function() {
      let filtered = this.$store.getters.getTagList.filter(({ key }) => key !== "untagged");
      return filtered;
    },

    tagListUntaggedOnly: function() {
      const x = this.$store.getters.getTagList;
      const x2 = x.find(({ key }) => key === "untagged");
      if (typeof x2 == "undefined") {
        return 0;
      } else {
        return x2.value;
      }
    },

  },
    watch:{
      $route (){ 
        this.getMessagesByTag()
      }
    },
  mounted() {
    this.$store.commit("flushData");
    this.$store.dispatch("setMessagesUnreadCount");
    this.$store.dispatch("populateTagsList", 'offpim/messages-tag-count');
    this.getMessagesByTag();
    setTimeout(() => {
      this.drawerRight = true;
    }, 600);
  },
  beforeDestroy() {
    this.$store.commit("flushData");
    this.drawerRight = false;
  },
  methods: {
    getMessagesByTag: async function() {

      const request = this.$route.params.tag;
      const tag = request ? request : null;

      const vuex = this.$store;
      vuex.commit("flushData");
      vuex.commit("loaderActive");

      try {
        const view = !tag
          ? "offpim/messages-unread"
          : "offpim/messages-tag-count";
        const data = await this.getQuery(view, tag, tag, true);
        this.$store.commit("addDataArray", data);
        this.$store.dispatch("populateTagsList", 'offpim/messages-tag-count');
      } catch (error) {
        vuex.dispatch("infoBridge", {
          color: "error",
          text: error,
          level: "error"
        });
      }
      vuex.commit("loaderInactive");
    },

    getSessionLogs: async function() {
      let logs = this.$store.getters.sessionLogs;

      const list = [];
      for (const log of logs) {
        let body = '';
        for (var key of Object.keys(log)) {
            body += key + ": " + log[key] + '\n';
        }

        list.push({
          sender: { name: "offPIM Info Bridge" },
          recipient: { name: "offPIM Messages" },
          messageAttachment: { text: body }
        });        
      }

      this.$store.commit("addDataArray", list);

    }

  }
};
</script>
