<template lang="pug">
        v-skeleton-loader(
            :loading="this.$store.getters.loaderState"
            class="mx-auto"
            transition="scroll-y-reverse-transition"
            type="article"
        )
            v-data-iterator(
                :items="this.$store.getters.getData"
                item-key="_id"
                :items-per-page="20"
            )
                template(v-slot:default="props")
                    v-row
                        v-col(
                            v-for="doc in props.items"
                            :key="doc._id"
                            cols="12"
                            sm="6"
                            md="4"
                            lg="3"
                        )
                            notes-item(
                                v-bind:doc="doc"
                            )
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";
import NotesItem from "@/components/notes/NotesItem.vue";

export default {
  name: "notesTag",
  components: {
    NotesItem
  },
  mixins: [pouchMixin],
  props: ["tag"],
  data: () => ({}),
  watch: {
    $route(to) {
      if (to) {
        this.getNotesByTag();
      }
    }
  },
  mounted() {
    this.getNotesByTag();
  },
  methods: {
    getNotesByTag: async function() {
      try {
        let data = await this.getQuery(
          "offpim/note-tag-count",
          this.tag,
          this.tag,
          true
        );
        this.$store.commit("addDataArray", data);
      } catch (error) {
        this.errorHandler(error);
      }
    }
  }
};
</script>