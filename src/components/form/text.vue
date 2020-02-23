<template lang="pug">
v-col(cols="12")
    v-text-field(
        :value="value"
        :label="label"
        dense
        class="text-capitalize"
        :hint="hint"
        @input="handleInput"
    )
</template>

<script>
export default {
    name: 'formText',
    props: ['label','hint','value'],
    computed: {
    },
    methods: {
        handleInput (e) {
            this.$emit('input', e)
        }
    }
}
</script>