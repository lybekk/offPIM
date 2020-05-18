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
      )
        v-list-item(
          link 
          @click="getNotesByTag()"
        )
          v-list-item-icon
            v-icon mdi-note-text
          v-list-item-title Untagged
        v-list-item(link @click="getLastEntriesByCount(30)")
          v-list-item-icon
            v-icon mdi-clock
          v-list-item-title 30 latest notes
      v-divider
      v-list(
        nav
        dense
        subheader
      )
        v-subheader Tags
        v-list-item(
          v-for="(tag, i) in tagsList"
          :key="i"
          link
          @click="getNotesByTag(tag.key)"
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
        v-row
          v-container(fluid)
            v-skeleton-loader(
                :loading="this.$store.getters.loaderState"
                class="mx-auto"
                transition="scale-transition"
                type="article"
            )
              v-data-iterator(
                :items="noteList"
                item-key="_id"
                :items-per-page="10"
              )
                template(v-slot:default="props")
                  v-row
                    v-col(
                      v-for="item in props.items"
                      :key="item._id"
                      cols="12"
                      sm="6"
                      md="4"
                      lg="3"
                    )
                      notes-item(
                        v-bind:item="item"
                        @set-selected-note="setSelectedNote"
                      )
    notes-detailed(
      :selected-note="selectedNote"
      @refresh-doc="refreshDoc"
    )

</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

import NotesItem from "@/components/notes/NotesItem.vue";
import NotesDetailed from "@/components/notes/NotesDetailed.vue";

export default {
  name: "notes",
  components: {
    NotesItem,
    NotesDetailed
  },
  mixins: [pouchMixin],
  props: {
    source: String
  },
  data: () => ({
    noteList: [],
    drawer: false,
    selectedNote: {}
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
    this.getNotesByTag();
    this.$store.dispatch("populateTagsList");
  },
  methods: {
    refreshDoc: async function(id) {
      const index = this.noteList.findIndex(({ _id }) => _id === id);
      const x = await this.getDoc(id);
      this.noteList[index].title = x.title;
      this.noteList[index].description = x.description;
      this.noteList[index].archived = x.archived;
    },
    setSelectedNote: async function(id) {
      this.selectedNote = await window.db.get(id);
    },
    getNotesByTag: async function(tag = "No tag") {
      try {
        let data = await this.getQuery("offpim/note-tag-count", tag, tag, true);
        this.noteList = data;
      } catch (error) {
        this.errorHandler(error);
      }
    },
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
        this.noteList = data.docs;
      } catch (error) {
        vstore.commit("showSnackbar", { text: error });
      }
    }
  }
};
</script>

<style scoped>
.flip-list-move {
  transition: transform 1s;
}
</style>
