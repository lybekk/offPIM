<template>
  <v-toolbar
    flat
    floating
  >
    <v-form @submit="initiateSearch">
      <v-text-field
        v-model="searchValue"
        prepend-inner-icon="mdi-magnify"
        class="mx-4"
        hide-details
        label="Search"
        solo-inverted 
        :loading="searchLoader"
      >
        <template v-slot:progress>
          <v-progress-linear
            absolute
            indeterminate
            rounded
            color="warning"
            height="4"
          />
        </template>
        <template v-slot:append>
          <v-tooltip
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">
                mdi-help-circle
              </v-icon>
            </template>
            Press enter to search. Queries may take a while, depending on database size. Case-insensitive.
          </v-tooltip>
        </template>
      </v-text-field>
    </v-form>
  </v-toolbar>
</template>

<script>

export default {
  name: 'Logbooksearch',
  components: {
  },
  data: () => ({
    searchLoader: false,
    searchValue: null
  }),
  computed: {
  },
  methods: {
    initiateSearch: async function () {
      this.searchLoader = true;
      const s = this.searchValue;
      let mango = {
        selector: {
          "@type":"Event",
            //logbook: true,
            $or: [
              {
                  title: {
                    $regex: RegExp(s, "i")
                  }
              },
              {
                  description: {
                    $regex: RegExp(s, "i")
                  }
              }
            ]
        },
        limit:100
      };
      /*
      * For CouchDB/Erlang regex
      * // "$regex": "(?i)" + s // CouchDB/Erlang //Javascript does not support look-behind assertions
      * // "$regex": "(?i)" + s // CouchDB/Erlang //Javascript does not support look-behind assertions
      */
      console.log(mango);
      let data = await window.db.find(mango);
      this.$emit('add-logs', data.docs)
      this.searchLoader = false;
    }
  }
};
</script>
