<template>
  <v-dialog v-model="dialog" width="45vw" :fullscreen="isSmallScreen" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-clipboard</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-banner v-model="banner">Whiteboard will not be synced, but stored locally in the browser, and retained across sessions.</v-banner>
      <v-card-text>
        <v-textarea v-model="content" auto-grow spellcheck="false" hide-details autofocus />
      </v-card-text>
      <v-card-actions>
        <v-btn icon color="secondary" @click="banner = !banner">
          <v-icon>mdi-information</v-icon>
        </v-btn>
        <v-spacer />
              <v-btn text color="secondary" @click="dialog = !dialog">
                Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import formatMixin from '@/mixins/formatMixin'

export default {
  name: "LocalWhiteboard",
  mixins: [formatMixin],
  data: () => ({
    dialog: false,
    banner: false,
  }),
  computed: {
    content: {
      get: function() {
        let x = window.localStorage.getItem("offpimLocalWhiteboard");
        return x
          ? x
          : "";
      },
      set: function(value) {
        window.localStorage.setItem("offpimLocalWhiteboard", value);
      }
    }
  }
};
</script>