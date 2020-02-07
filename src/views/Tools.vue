<template lang="pug">
v-content
  v-container(
    class="fill-height"
    fluid
  )
    v-row(
      align="center"
      justify="center"
    )
      v-col(
        cols="12"
        sm="8"
        md="4"
      )
        p(class="text-center display-3") Tools.
    v-row
      v-col
        v-card
          v-card-title
            span(class="title font-weight-light") UUID Generator
          v-card-text
            v-btn(
              color="primary" 
              fab 
              x-small 
              dark
              @click="generateUUID"
            )
              v-icon mdi-plus
            v-row
              v-col(cols="12" sm="6")
                v-text-field(
                  :value="generatedUUID"
                  solo
                  readonly
                )
    v-row
      v-col
        v-card
          v-card-title
            span(class="title font-weight-light") Convert date string to ISO
          v-card-text
            v-row
              v-col(cols="12" sm="6")
                v-text-field(
                  v-model="dateConverterInput"
                  label="Enter date string"
                )
              v-col(cols="12" sm="6")
                v-text-field(
                  :value="dateConverterResult"
                  label="Result"
                  solo
                  readonly
                )
</template>

<script>

export default {
  name: 'tools',
  components: {
  },
  data: () => ({
    generatedUUID: '',
    dateConverterInput: null
  }),
  computed: {
    dateConverterResult: function () {
      const x = this.dateConverterInput;
      const y = new Date(x);
      return y.toISOString()
    }
  },
  created () {
  },
  methods: {
    generateUUID: function() {
      this.generatedUUID = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
        });
    }
  },
  mounted () {
  },
}
</script>
