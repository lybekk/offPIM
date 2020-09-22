<template>
  <v-card
    ripple
    :disabled="isDeleted(doc._id)"
    :flat="isDeleted(doc._id)"
    @click="viewDocument(doc._id)"
  >
    <v-card-title>
      {{ docTitle }}
    </v-card-title>
    <v-card-text>
      {{ docDescription }}
    </v-card-text>
    <v-fade-transition>
      <v-overlay
        v-if="isDeleted(doc._id)"
        absolute
        color="error"
        z-index="3"
      >
        <v-btn text>
          Deleted
        </v-btn>
      </v-overlay>
    </v-fade-transition>
    <v-fade-transition>
      <v-overlay
        v-if="doc.archived"
        absolute
        color="info"
        z-index="3"
      >
        <v-btn text>
          Archived
        </v-btn>
      </v-overlay>
    </v-fade-transition>
  </v-card>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";
import itemMixin from "@/mixins/itemMixin";

export default {
  name: "NotesItems",
  components: {},
  mixins: [pouchMixin, itemMixin],
  props: {
    doc: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    trashIconClicked: false,
    itemsPerPage: 8,
  }),
  computed: {
    trashIcon: function () {
      if (this.trashIconClicked) {
        return true;
      }
      return false;
    },
    docTitle() {
      let t = this.doc.title;
      if (t.length > 60) {
        return t.slice(0, 60) + "...";
      } else {
        return t;
      }
    },
    docDescription() {
      let t = this.doc.description || "";
      if (t.length > 120) {
        return t.slice(0, 120) + "...";
      } else {
        return t;
      }
    },
  },
  methods: {
    isDeleted: function (id) {
      return this.$store.getters.isDeleted(id);
    },
    toggleTrashIcon: function () {
      this.trashIconClicked = !this.trashIconClicked;
    },
  },
};
</script>
