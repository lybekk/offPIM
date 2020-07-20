<template>
  <v-col cols="12">
    <v-textarea
      :value="value"
      :label="label"
      rows="3"
      filled
      dense
      @input="handleInput"
    />
  </v-col>
</template>

<script>
export default {
    name: 'FormTextarea',
    props: {
      label: {
          type: String,
          default: '',
      },
      value: {
          type: String,
          default: null,
      },
    },
    computed: {
    },
    methods: {
        handleInput (e) {
            this.$emit('input', e)
        }
    }
}
</script>