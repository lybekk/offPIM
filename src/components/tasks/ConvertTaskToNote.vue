<template>    
  <v-list-item
    @click="convert()"
  >
    <v-list-item-content>
      <v-list-item-title>
        Convert to note
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-icon>
      <v-icon>
        mdi-note
      </v-icon>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
    name: 'ConvertTaskToNote',
    mixins: [pouchMixin],
    props: {
        docid: {
            type: String,
            default: null,
        }
    },
    methods: {
        convert: async function() {
      await this.setFieldGeneric({
        _id: this.docid,
        field: "type",
        value: 'note'
      });
        },
    }
}
</script>