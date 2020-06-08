<template lang="pug">
    //- TODO Conider FAB mdi-send
    v-btn(
        :color="insertedOK ? 'success' : 'primary'"
        @click="insertDoc"
        text
        )
        v-icon(v-if="insertedOK") mdi-check
        span(v-else) Submit
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "formsubmit",
  mixins: [pouchMixin],
  props: ["doc"],
  data: () => ({
    insertedOK: null
  }),
  mounted() {
    /**
     * Keyboard shortcuts
     */
    var vm = this;
    window.addEventListener("keydown", function(event) {
      // NOTE: metaKey == Command on Mac
      if (event.key === "Escape") {
        event.preventDefault();
        vm.routeBack();
      }
    });
  },
  methods: {
    insertDoc: async function() {
      console.log(this.doc);
      const response = await this.putDoc(this.doc);
      if (response.ok) {
        this.insertedOK = true;
        this.routeBack();
      } else {
        this.insertedOK = false;
      }
    },

    routeBack: async function() {
      const routeInfo = window.localStorage.getItem("currentRoute");
      const r = JSON.parse(routeInfo);
      this.$router.push({ name: r.name, params: r.params });
    }
  }
};
</script>