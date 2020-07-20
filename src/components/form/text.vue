<template>
  <v-col cols="12">
    <v-text-field
      class="text-capitalize"
      :value="value"
      :label="label"
      dense
      :hint="hint"
      @input="handleInput"
    />
  </v-col>
</template>

<script>
export default {
    name: 'FormText',
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