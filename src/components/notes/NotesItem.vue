<template lang="pug">
  div
    v-hover(v-slot:default="{ hover }")
      v-card(
        hover 
        ripple 
        :disabled="isDeleted(doc._id)" 
        :flat="isDeleted(doc._id)"
      )
        v-card-title(
          class="subheading" 
          @click="showItemDetailed"
        ) {{ doc.title }}
        v-card-subtitle(
          @click="showItemDetailed"
        ) {{ doc.description }}
        v-card-actions
          v-spacer
          v-fab-transition
            v-speed-dial(
              absolute 
              bottom 
              right
            )
              template(v-slot:activator)
                v-btn(
                  v-show="hover" 
                  icon 
                  small 
                  fab
                )
                  v-icon mdi-delete
              v-btn(
                v-show="hover" 
                fab
                small
                color="yellow lighten-2"
                @click="deleteDoc(doc._id)"
              )
                v-icon(color="black") mdi-radioactive

        v-fade-transition
          v-overlay(
            v-if="isDeleted(doc._id)"
            absolute
            color="error"
            z-index="3"
          )
            v-btn(text) Deleted
        v-fade-transition
          v-overlay(
            v-if="doc.archived"
            absolute
            color="info"
            z-index="3"
          )
            v-btn(text) Archived

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
  props: ["doc"],
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