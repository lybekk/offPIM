<template>
  <v-row>
    <v-col>
      <v-text-field
        class="title"
        label="Feed URL (RSS)"
        :value="doc.url"
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
  name: "DoctypeWebfeed",
    mixins: [pouchMixin, itemDetailedMixin],
    //mixins: [itemDetailedMixin],
};
</script>