<template lang="pug">
  v-container(fluid)
    v-navigation-drawer(
      v-model="drawer"
      app
      right
    )
      v-list(
        nav
        dense
        subheader
      )
        v-list-item(
          v-for="(tag, i) in tagsList"
          :key="i"
          link
          :to="{ name: 'notesTag', params: { tag: tag.key }}"
        )
          v-list-item-icon
            v-icon(
              color="grey lighten-1" 
              small
            ) mdi-tag
            v-icon(
              small 
              color="grey lighten-1" 
              v-text="tag.key[0]"
            ) mdi-tag
          v-list-item-content
            v-list-item-title(
              v-text="tag.key"
            )
          v-list-item-action
            v-list-item-action-text(v-text="tag.value")
    v-content

      v-container(
        class="fill-height"
        fluid
      )
        v-toolbar(
          flat
        )
          v-btn(            
            color="primary"
            @click="getNotesByTag()"
          )
            v-icon mdi-note-text
            span Untagged
          v-spacer
          v-btn(
            class="ma-2" 
            color="primary"
            rounded 
            @click="drawer = !drawer"
            )
            v-icon(left) mdi-tag
            span Tags
            v-icon(right) mdi-menu
        v-row
          router-view
    notes-detailed
</template>

<script>
import NotesDetailed from "@/components/notes/NotesDetailed.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "notes",
  components: {
    NotesDetailed
  },
  mixins: [pouchMixin],
  props: {
    source: String
  },
  data: () => ({
    drawer: false
  }),
  computed: {
    tagsList: function() {
      return this.$store.getters.getTagList;
    }
  },
  created() {},
  beforeDestroy() {
    this.drawer = false;
  },
  mounted() {
    setTimeout(() => {
      this.drawer = true;
    }, 300);
    this.$store.dispatch("populateTagsList", 'offpim/note-tag-count');
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
