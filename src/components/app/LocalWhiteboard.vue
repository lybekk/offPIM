<template>
  <v-dialog v-model="dialog" width="45vw" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-clipboard</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-banner v-model="banner">Whiteboard will not be synced, but stored locally in the browser, and retained across sessions.</v-banner>
      <v-card-text>
        <v-textarea v-model="content" class="text-body-2" rows="6" auto-grow spellcheck="false" />
      </v-card-text>
      <v-card-actions>
        <v-btn icon color="secondary" @click="banner = !banner">
          <v-icon>mdi-information</v-icon>
        </v-btn>
        <v-spacer />
      <span class="primary--text subtitle-1">Whiteboard</span>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "LocalWhiteboard",
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