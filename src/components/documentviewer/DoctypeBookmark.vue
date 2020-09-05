<template>
  <v-row>
    <v-col>
      <v-text-field
        class="title"
        label="Name"
        :value="doc.name ? doc.name : ''"
        filled
        @change="setDocField('name', $event)"
      />
      <v-text-field
        class="title"
        label="Bookmark URL"
        :value="doc.url ? doc.url : ''"
        filled
        @change="setDocField('url', $event)"
      />
    </v-col>
  </v-row>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";
import itemDetailedMixin from "@/mixins/itemDetailedMixin";

export default {
  name: "DoctypeBookmark",
  mixins: [pouchMixin, itemDetailedMixin],
  computed: {
    url() {
      return this.doc.url ? this.doc.url : ''
    }
  }
};
</script>
