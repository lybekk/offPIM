<template>
  <v-container fluid>
    <v-data-iterator
      :items="this.$store.getters.getNotes"
      :items-per-page="16"
    >
      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-hover v-slot:default="{ hover }">
            <v-card hover ripple :disabled="isDeleted(item._id)" :flat="isDeleted(item._id)">
              <v-card-title class="subheading" @click="showSheet(item)">{{ item.title }}</v-card-title>
              <v-card-subtitle @click="showSheet(item)">{{ item.description }}</v-card-subtitle>

    <v-card-actions>
      <v-spacer></v-spacer>

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
              <v-icon >mdi-delete</v-icon>
            </v-btn>
          </template>
          <v-btn
            v-show="hover" 
            fab
            small
            color="yellow lighten-2"
            @click="deleteNote(item._id)"
          >
            <v-icon color="black">mdi-radioactive</v-icon>
          </v-btn>
        </v-speed-dial>

      </v-fab-transition>
    </v-card-actions>

        <v-fade-transition>
          <v-overlay
            v-if="isDeleted(item._id)"
            absolute
            color="error"
            z-index="3"
          >
            <v-btn text>Deleted</v-btn>
          </v-overlay>
        </v-fade-transition>
        <v-fade-transition>
          <v-overlay
            v-if="isArchived(item._id)"
            absolute
            color="info"
            z-index="3"
          >
            <v-btn text>Archived</v-btn>
          </v-overlay>
        </v-fade-transition>

            </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>

export default {
  name: 'NotesItems',
  components: {
  },
  data: () => ({
    trashIconClicked: false,
    itemsPerPage: 8
  }),
  computed: {
    trashIcon: function () {
      if (this.trashIconClicked) {return true}
      return false
    }
  },
  methods: {
    isArchived: function (id) {
      return this.$store.getters.isNoteArchived(id)
    },
    isDeleted: function (id) {
      return this.$store.getters.isDeleted(id)
    },
    deleteNote: function (id) {
      this.$store.commit('deleteNote', id);
    },
    toggleTrashIcon: function () {
      this.trashIconClicked = !this.trashIconClicked
    },
    showSheet: function (item) {
      this.$store.commit('setSelectedNoteIndex', item._id);
      this.$store.commit('showNoteSheet');
    }
  }
};

</script>