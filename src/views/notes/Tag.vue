<template>
  <v-data-iterator
    :items="this.$store.getters.getData"
    item-key="_id"
    :items-per-page="20"
    :loading="this.$store.getters.loaderState"
    loading-text="Getting Notes"
    no-data-text="No notes matching request"
  >
    <template v-slot:default="props">
      <v-row>
        <v-col
          v-for="doc in props.items"
          :key="doc._id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <NotesItem :doc="doc" />
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";
import NotesItem from "@/components/notes/NotesItem.vue";

export default {
  name: "NotesTag",
  components: {
    NotesItem
  },
  mixins: [pouchMixin],
  props: {
    tag: {
      type: String,
      default: 'No tag'
    },
  },
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