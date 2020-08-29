<template>
  <v-speed-dial
    v-model="fab"
    fixed
    bottom
    right
    direction="top"
    transition="slide-y-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn
        v-model="fab"
        dark
        color="secondary"
        fab
      >
        <v-icon v-if="fab">
          mdi-close
        </v-icon>
        <v-icon v-else>
          mdi-plus
        </v-icon>
      </v-btn>
    </template>
    <v-btn
      fab
      dark
      small
      color="secondary"
      class="new-doc-btn"
      @click="createDoc('webFeed')"
      data-text="Feed"
    >
      <v-icon>mdi-rss</v-icon>
      <!-- 
        if rss not available -> rss-box
      -->
    </v-btn>
  </v-speed-dial>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";
import itemMixin from "@/mixins/itemMixin";
import newDocumentMixin from "@/mixins/newDocumentMixin";

export default {
  name: "NewDocButtons",
  //mixins: [pouchMixin],
  mixins: [pouchMixin, itemMixin, newDocumentMixin],
  data: () => ({
    fab: false,
  }),
  methods: {
    createDoc: async function (type) {
      const base = {
        _id: this.generateUUID(),
        dateCreated: new Date().toISOString(),
      };
      const docTypes = {
        webFeed: {
          "@type": "webFeed",
          name: '',
          url: null,
        },
      };

      const newDoc = {
        ...base,
        ...docTypes[type],
      };
      //console.log(newDoc);
      //console.log(newDoc._id);
      //const result = await this.putDoc(newDoc);
      await this.putDoc(newDoc);
      const freshDoc = await this.getDoc(newDoc._id);
      this.viewDocument(freshDoc);
      // Replace above with this one -> this.viewDocument(doc);
    },
  },
};
</script>

<style scoped>
.new-doc-btn::after {
  content: attr(data-text);
  position: absolute;
  background-color: #ffffff6e;
  color: teal;
  left: -4rem;
  z-index: 1001;
  padding: 0.4rem;
  border-radius: 10%;
  box-shadow: 2px 2px 8px white;
  font-weight: bold;
}
</style>