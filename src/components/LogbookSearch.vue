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
          ></v-progress-linear>
        </template>
        <template v-slot:append>
          <v-tooltip
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">mdi-help-circle</v-icon>
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
  name: 'logbooksearch',
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
      let v = this.$store;
      let url = v.getters.urlMango;
      v.commit('flushLogs');
      let mango = {
        "selector": {
            "realm": "logs",
            "$or": [
              {
                  "title": {
                    "$regex": "(?i)" + s
                  }
              },
              {
                  "description": {
                    "$regex": "(?i)" + s
                  }
              }
            ]
        },
        "limit":100
      };
      let data = await v.dispatch('postData', {url:url, data:mango} );
      v.commit('addLogEntries', data.docs);
      this.searchLoader = false;
    }
  }
};
</script>
