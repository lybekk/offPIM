<template>
  <v-container fluid>
    <v-fab-transition>
      <v-speed-dial
        absolute
        bottom
        right
      >
        <template v-slot:activator>
          <v-btn
            icon
            small
            fab
            :disabled="isDeleted"
            @click="toggleTrashIcon"
          >
            <v-icon v-if="trashIconClicked">
              mdi-close
            </v-icon>
            <v-icon v-else>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <v-btn
          fab
          small
          color="yellow lighten-2"
          :disabled="isDeleted"
          @click="deleteDocument(documentId)"
        >
          <v-icon color="black">
            mdi-radioactive
          </v-icon>
        </v-btn>
      </v-speed-dial>
    </v-fab-transition>
  </v-container>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "MainDeleteButton",
  components: {},
  mixins: [pouchMixin],
  props: {
    documentId: {
      type: String,
      default: null,
    }
  },
  data: () => ({
    trashIconClicked: false,
    isDeleted: false
  }),
  computed: {},
  methods: {
    toggleTrashIcon: function() {
      this.trashIconClicked = !this.trashIconClicked;
    },
    deleteDocument: async function(id) {
      this.toggleTrashIcon();
      this.deleteDoc(id);
      this.$store.commit("setGenericStateBooleanFalse", "dialogItemDetailed");
      this.isDeleted = true;

      let doc = await this.getDoc(id, true);
      doc._deleted = true;
      this.$store.commit("refreshDoc", doc);
    }
  }
};
</script>