<template>
  <v-main>
    <v-container fluid>
      <v-navigation-drawer
        v-model="drawer"
        app
        right
        temporary
      >
        <v-sheet
          class="pa-4 primary lighten-2"
          dark
        >
          <v-icon>mdi-tag</v-icon>
          Tags
        </v-sheet>
        <v-sheet class="pa-1">
          <v-list
            nav
            dense
            subheader
          >
            <v-list-item
              v-for="(tag, i) in tagsList"
              :key="i"
              link
              :to="{ name: 'notesTag', params: { tag: tag.key }}"
            >
              <v-list-item-content>
                <v-list-item-title v-text="tag.key" />
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text v-text="tag.value" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-navigation-drawer>
      <v-container
        class="fill-height"
        fluid
      >
        <v-toolbar flat>
          <v-btn
            color="secondary"
            @click="getNotesByTag()"
          >
            <v-icon>mdi-note-text</v-icon><span>Untagged</span>
          </v-btn>
          <v-spacer />
          <v-btn
            class="ma-2"
            color="secondary"
            @click="drawer = !drawer"
          >
            <v-icon left>
              mdi-tag
            </v-icon><span>Tags</span>
            <v-icon right>
              mdi-menu
            </v-icon>
          </v-btn>
        </v-toolbar>
        <v-row>
          <router-view />
        </v-row>
      </v-container>
      <NotesDetailed />
    </v-container>
  </v-main>
</template>

<script>
import NotesDetailed from "@/components/notes/NotesDetailed.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "Notes",
  components: {
    NotesDetailed
  },
  mixins: [pouchMixin],
  data: () => ({
    drawer: false
  }),
  computed: {
    tagsList: function() {
      return this.$store.getters.getTagList;
    }
  },
  mounted() {
    this.$store.commit("flushData");
    this.$store.dispatch("populateTagsList", 'offpim/note-tag-count');
  },
  beforeDestroy() {
    this.$store.commit("appBarTabs", []);
    this.$store.commit("flushData");
  },
  methods: {
    /**
     * TODO: - Code optimization. emit from Tag.vue to this.
     */
    getNotesByTag: async function() {
      try {
        let data = await this.getQuery(
          "offpim/note-tag-count",
          "No tag",
          "No tag",
          true
        );
        this.$store.commit("addDataArray", data);
      } catch (error) {
        this.errorHandler(error);
      }
    },

    /**
     * Not in use
     */
    getLastEntriesByCount: async function(count = 30) {
      let vstore = this.$store;
      vstore.commit("loaderActive");
      let now = new Date().toISOString().slice(0, 16);
      let mango = {
        selector: {
          productivity: true,
          type: "note",
          created: { $lte: now },
          $or: [{ archived: { $exists: false } }, { archived: false }]
        },
        limit: count,
        sort: [{ created: "desc" }],
        use_index: "offpim_mango_indexes"
      };

      try {
        let data = await this.getMango(mango);
        vstore.commit("addDataArray", data.docs);
      } catch (error) {
        vstore.dispatch("infoBridge", {
          color: "error",
          text: error,
          level: "error"
        });
      }
    }
  }
};
</script>
