<template>
<v-content>
  <v-container fluid>
    <v-row>
      <v-col cols="auto">
        <v-navigation-drawer
          permanent
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Messages
              </v-list-item-title>
              <v-list-item-subtitle>
                Total: <span v-text="totalMessages"></span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>

          <v-list
            dense
            nav
          >
            <messages-newmessageform />

            <v-subheader>Tags</v-subheader>
            <v-list-item-group 
              v-model="activeTag" 
              mandatory
            >
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
                  <v-list-item-title 
                    class="text-capitalize"
                    v-text="tag.key"
                  ></v-list-item-title>
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
                <messages-messagelist />
            </v-col>

            <v-col cols="7">
                <messages-reader />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</v-content>
</template>

<script>
import MessagesMessagelist from '@/components/MessagesMessagelist.vue'
import MessagesReader from '@/components/MessagesReader.vue'
import MessagesNewmessageform from '@/components/MessagesNewmessageform.vue'

export default {
  name: 'messages',
  components: {
    MessagesMessagelist,
    MessagesReader,
    MessagesNewmessageform
  },
  props: {
    source: String,
  },
  data: () => ({
    activeTag:null,
  }),
  computed: {
    totalMessages: function() {
      let x = this.$store.getters.getTotals;
      return x.messages
    },
    tagList: function() {
      let tags = this.$store.getters.getTagList;
      let filtered = tags.filter( ({ key }) => key !== 'untagged' )
      return filtered
    },
    tagListUntaggedOnly: function() {
      const x = this.$store.getters.getTagList;
      const x2 = x.find( ({ key }) => key === 'untagged' );
      if (typeof x2 == 'undefined') {
        return 0
      } else {
        return x2.value
      }
    }
  },
  created: function () {
  },
  mounted () {
    this.$store.dispatch('setMessagesUnreadCount');
    this.$store.dispatch('getMessagesByTag', 'inbox');
    this.$store.dispatch('getMessagesTagList');
  },
  beforeDestroy() {
  },
  methods: {
    getMessagesByTag: function (tag) {
      this.$store.dispatch('getMessagesByTag', tag);
      this.$store.dispatch('getMessagesTagList');
    }
  }
}

</script>