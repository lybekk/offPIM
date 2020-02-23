<template lang="pug">
v-col(cols="4")
    v-text-field(
        :label="label"
        type="number"
        :hint="hint"
        @input="handleInput"
    )
</template>

<script>
export default {
    name: 'formNumber',
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