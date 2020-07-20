<template>
  <v-btn
    :color="insertedOK ? 'success' : 'secondary'"
    @click="insertDoc"
  >
    <v-icon v-if="insertedOK">
      mdi-check
    </v-icon>
    <div v-else>
      <v-icon left>
        mdi-send
      </v-icon><span>Submit</span>
    </div>
    <!-- TODO: Conider FAB mdi-send -->
  </v-btn>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "Formsubmit",
  mixins: [pouchMixin],
  props: {
      doc: {
          type: Object,
          default: () => {},
      },
  },
  data: () => ({
    insertedOK: null
  }),
  mounted() {
    window.addEventListener("keyup", this.onEscapeKeyUp);
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.onEscapeKeyUp);
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
    
    onEscapeKeyUp(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        this.routeBack();
      }
    },
    
    routeBack: async function() {
      const routeInfo = window.localStorage.getItem("currentRoute");
      const r = JSON.parse(routeInfo);
      try {
        this.$router.push({ name: r.name, params: r.params });
      } catch (error) {
        console.log('This is not an error: ', error);
        this.$router.push({ name: 'welcome' });
      }
    }

  }
};
</script>