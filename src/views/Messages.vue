<template>
  <v-content>
    <v-container fluid>
      <v-row>
        <v-col cols="auto">
          <v-navigation-drawer permanent>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">Messages</v-list-item-title>
                <v-list-item-subtitle>
                  Total:
                  <span v-text="totalMessages"></span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>

            <v-list dense nav>
              <messages-newmessageform />

              <v-subheader>Tags</v-subheader>
              <v-list-item-group v-model="activeTag" mandatory>
                <v-list-item
                  title="Messages without tags end up here"
                  @click="getMessagesByTag('inbox')"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-inbox</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Inbox</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-chip small v-text="tagListUntaggedOnly">0</v-chip>
                  </v-list-item-action>
                </v-list-item>

                <v-list-item
                  v-for="(tag, i) in tagList"
                  :key="i"
                  v-on:click="getMessagesByTag(tag.key)"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-tag</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="text-capitalize" v-text="tag.key"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-chip small v-text="tag.value"></v-chip>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>
        </v-col>
        <v-col cols="10">
          <v-container fluid fill-height>
            <v-row align="stretch" style="height: 100%;">
              <v-col cols="5">
                <messages-messagelist v-bind:message-list="messageList"
                  @get-messages-tag-list="getMessagesTagList"
                  @read-message="readMessage"
                />
              </v-col>

              <v-col cols="7">
                <messages-reader v-bind:msg="activeMessage" />
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import MessagesMessagelist from "@/components/MessagesMessagelist.vue";
import MessagesReader from "@/components/MessagesReader.vue";
import MessagesNewmessageform from "@/components/MessagesNewmessageform.vue";
import pouchMixin from '@/mixins/pouchMixin'

export default {
  name: "messages",
  components: {
    MessagesMessagelist,
    MessagesReader,
    MessagesNewmessageform
  },
  mixins: [pouchMixin],
  props: {
    source: String
  },
  data: () => ({
    messageList: [],
    tags: [],
    activeTag: null,
    activeMessageId: null
  }),
  computed: {
    totalMessages: function() {
      let x = this.$store.getters.getTotals;
      return x.messages;
    },
    tagList: function() {
      //let tags = this.$store.getters.getTagList;
      let filtered = this.tags.filter(({ key }) => key !== "untagged");
      return filtered;
    },
    tagListUntaggedOnly: function() {
      //const x = this.$store.getters.getTagList;
      const x = this.tags;
      const x2 = x.find(({ key }) => key === "untagged");
      if (typeof x2 == "undefined") {
        return 0;
      } else {
        return x2.value;
      }
    },
    activeMessage: function() {
      //getActiveMessage: state => {
      const index = this.messageList.findIndex(
          ({ _id }) => _id === this.activeMessageId 
      );
      if (index == -1) {
          return false
      }
      return this.messageList[index]
      //},
    }
  },
  created: function() {},
  mounted() {
    this.$store.dispatch("setMessagesUnreadCount");
    //this.$store.dispatch("getMessagesByTag", "inbox");
    //this.$store.dispatch("getMessagesTagList");
    this.getMessagesByTag("inbox");
    this.getMessagesTagList();
  },
  beforeDestroy() {},
  methods: {
    //getMessagesByTag: function(tag) {
    //  this.$store.dispatch("getMessagesByTag", tag);
    //  this.$store.dispatch("getMessagesTagList");
    //},
    getMessagesByTag: async function(payload) {
      let tag = payload;
      const vuex = this.$store;
      //let url = context.getters.urlMango;
      vuex.commit("loaderActive");
      //context.commit('flushMessages');
      let mango = {
        selector: {
          realm: "messages",
          tags: {
            $in: [tag]
          }
        },
        limit: 100
      };
      if (tag == "inbox" || tag == "untagged") {
        mango.selector.tags = [];
      }

      try {
        let data = await window.db.find(mango);
        this.messageList = data.docs;
        //context.commit('setMessagesUnreadCount', data.docs.length);
        //this.noteList = data.docs;
        //vstore.commit('addNotes', data)
        //vstore.commit('loaderInactive');
        this.getMessagesTagList();
      } catch (error) {
        vuex.commit("showSnackbar", { text: error });
      }
      vuex.commit("loaderInactive");

      //let data = await context.dispatch("postData", { url: url, data: mango });
      //context.commit("addMessageEntries", data.docs);
    },
    getMessagesTagList: async function() {
      //let url = context.getters.urlDB;

      try {
        var result = await window.db.query("pimpim/messages-tag-count", {
          group: true
        });
        this.tags = result.rows;
        //return
        //return this.tags = result.rows
      } catch (err) {
        this.$store.commit("addAlert", { type: "error", text: err });
      }

      /*
      const response = await fetch(
        url + "/_design/pimpim/_view/messages-tag-count?group=true"
      );
      context.commit("setTagList", await response.json());
      */
    },
    readMessage: function(item) { // kombinere med den under
      //this.$store.commit("setActiveMessage", msg._id);
      this.activeMessageId = item._id;
      if (!item.read) {
        //this.$store.commit("setRead", msg._id);
        const index = this.messageList.findIndex(
            ({ _id }) => _id === item._id
        );
        let msg = this.messageList[index];
        msg.read = true;
        this.putDoc(msg);
        //let updateDoc = { doc: msg };
        //this.dispatch('insertDocument', updateDoc);
      }
    }
  }
};
</script>