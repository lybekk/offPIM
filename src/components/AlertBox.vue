<template>
  <div class="alertBox">
        <v-alert
          v-for="(alert, i) in alerts"
          :key="i"
          :value="alert.alert"
          :index="i"
          max-width="25vw"
          dense
          prominent
          text
          :type="alert.type"
          transition="scale-transition"

        >
          <v-row align="center">
            <v-col class="grow" v-text="alert.text"></v-col>
            <v-col class="shrink">
              <v-btn 
                text 
                icon
                large
                @click="alert.alert = !alert.alert"
              >
                <v-icon :color="alert.type">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
  </div>
</template>

<script>
export default {
  name: 'AlertBox',
  data: () => ({
  }),
  computed: {
    alerts: function () {
        return this.$store.getters.getAlerts
    }
  },
  methods: {
    deleteAlert: function (index) {
      this.$store.commit('deleteAlert', index)
    }
  }
};
</script>

<style scoped>
.alertBox {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1001;
  background-color: #000000db;
  padding: 8px;
  margin: 1vw;
  border-radius: 5%;
}
</style>