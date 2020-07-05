<template>
  <v-list v-if="items.length">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title font-regular">Done today</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider inset />
    <v-list-item v-for="(item, i) in items" :key="i">
        <v-list-item-icon> 
            <v-icon color="success">mdi-check</v-icon>
        </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-subtitle class="text-subtitle-1">
            {{ item.title }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "DoneToday",
  mixins: [pouchMixin],
  data: () => ({
    items: []
  }),
  async mounted() {
      let d = new Date();
      let startKey = d.toISOString().slice(0, 10);
      let endKey = new Date(d.setDate(d.getDate() + 1))
        .toISOString()
        .slice(0, 10);
        this.getQuery("offpim/tasks-done", startKey, endKey, true)
        .then( data => {
            this.items = data
        })
  },

};
</script>