<template lang="pug">
    // NOT IN USE - Kept for reference
    v-list-item
      v-list-item-avatar
        v-icon mdi-database
      v-list-item-content
        v-list-item-title Local DB
        v-list-item-subtitle Name: {{ $store.getters.localDBInfo.db_name }}
      v-list-item-action
        v-row(justify="center")
          v-dialog(
            v-model="dialog" 
            max-width="25vw"
            overlay-opacity="0.9"
            overlay-color="secondary"
            :fullscreen="$vuetify.breakpoint.mdAndDown"
            transition="dialog-bottom-transition"
          )
            template(v-slot:activator="{ on }")
              v-btn(
                icon 
                small 
                fab
                color="primary"
                v-on="on"
              )
                v-icon mdi-database-edit
            v-card
              v-card-title Local database
              v-card-text
                //-v-expansion-panels(:value="0")
                  //-v-expansion-panel
                    v-expansion-panel-header Info
                    v-expansion-panel-content
                      ul
                        li 
                  //-v-expansion-panel
                    v-expansion-panel-header Actions
                    v-expansion-panel-content
                      v-card(class="mx-auto" tile)
                        v-list
                v-divider

              v-divider
              v-card-actions
                  v-btn(
                      color="primary"
                      text
                      @click="dialog = false"
                  ) Close
                  v-spacer
</template>

<script>
//import DatabaseCompaction from "@/components/app/DatabaseCompaction.vue";

export default {
  name: "LocalDatabaseListItem",
  components: {
    //DatabaseCompaction,
  },
  data: () => ({
    dialog: false,

  }),
  computed: {},
  methods: {
  },
};
</script>

