<template>
  <v-col cols="4">
    <v-text-field
      :label="label"
      type="number"
      :hint="hint"
      @input="handleInput"
    />
  </v-col>
</template>

<script>
export default {
    name: 'FormNumber',
    props: {
        label: {
            type: String,
            default: null,
        },
        hint: {
            type: String,
            default: null,
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