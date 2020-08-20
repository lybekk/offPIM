<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      hover
      ripple
      :disabled="isDeleted(doc._id)"
      :flat="isDeleted(doc._id)"
    >
      <v-card-title
        @click="showItemDetailed"
      >
        {{ docTitle }}
      </v-card-title>
      <v-card-text @click="showItemDetailed">
        {{ docDescription }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-fab-transition>
          <v-speed-dial
            absolute
            bottom
            right
          >
            <template v-slot:activator>
              <v-btn
                v-show="hover"
                icon
                small
                fab
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <v-btn
              v-show="hover"
              fab
              small
              color="yellow lighten-2"
              @click="deleteDoc(doc._id)"
            >
              <v-icon color="black">
                mdi-radioactive
              </v-icon>
            </v-btn>
          </v-speed-dial>
        </v-fab-transition>
      </v-card-actions>
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
  </v-hover>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";
import itemMixin from "@/mixins/itemMixin";

export default {
  name: "NotesItems",
  components: {},
  mixins: [
    pouchMixin,
    itemMixin
    ],
  //props: ["doc"],
  props: {
    doc: {
      type: Object,
      default: () => {},
    }
  },
  data: () => ({
    trashIconClicked: false,
    itemsPerPage: 8
  }),
  computed: {
    trashIcon: function() {
      if (this.trashIconClicked) {
        return true;
      }
      return false;
    },
    docTitle() {
      let t = this.doc.title;
      if (t.length > 60) {
        return t.slice(0, 60) + '...'
      } else {
        return t
      }
    },
    docDescription() {
      let t = this.doc.description;
      if (t.length > 120) {
        return t.slice(0, 120) + '...'
      } else {
        return t
      }
    }
  },
  methods: {
    isDeleted: function(id) {
      return this.$store.getters.isDeleted(id);
    },
    toggleTrashIcon: function() {
      this.trashIconClicked = !this.trashIconClicked;
    },
  }
};
</script>