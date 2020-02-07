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
            <v-icon v-if="trashIconClicked">mdi-close</v-icon>
            <v-icon v-else>mdi-delete</v-icon>
          </v-btn>
        </template>
        <v-btn
          fab
          small
          color="yellow lighten-2"
          :disabled="isDeleted"
          @click="deleteDocument(documentId)"
        >
          <v-icon color="black">mdi-radioactive</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-fab-transition>

  </v-container>
</template>

<script>

export default {
  name: 'MainDeleteButton',
  components: {
  },
  props: ['documentId'],
  data: () => ({
    trashIconClicked: false,
    isDeleted: false
  }),
  computed: {
  },
  methods: {
    toggleTrashIcon: function () {
      this.trashIconClicked = !this.trashIconClicked
    },
    deleteDocument: function (id) {
      this.toggleTrashIcon();
      this.$store.dispatch('deleteDocument', id);
      this.isDeleted = true;
    },
  }
};

</script>
