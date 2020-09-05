<template>
  <v-main>
    <v-container>
      <h1>Bookmarks</h1>
      <v-list>
        <v-list-item
          v-for="item in $store.getters.getData"
          :key="item._id"
          :disabled="item._deleted"
          link
        >
          <v-list-item-content>
            <v-list-item-title 
              @click="viewDocument(item._id)"
              v-text="item.name || 'Unnamed'"
            />
            <v-list-item-subtitle>
              <v-btn
                text
                color="secondary"
                :href="item.url"
                target="_blank"
                hint="include full URL (http/https)"
                v-text="item.url || 'No URL'"
              />
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </v-main>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";
import itemMixin from "@/mixins/itemMixin";

export default {
  name: "Bookmarks",
  mixins: [pouchMixin, itemMixin],
  data: () => ({
    items: [],
  }),
  mounted() {
    this.getItems()
  },
  methods: {
    getItems: async function () {
      const data = await this.getQuery("offpim/bookmarks", null, null, true)
      this.$store.commit("addDataArray", data);
    },    
  },
};
</script>
