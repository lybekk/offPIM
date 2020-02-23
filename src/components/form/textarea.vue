<template lang="pug">
v-col(cols="12")
    v-textarea(
        :value="value"
        :label="label"
        rows="3"
        filled
        dense
        @input="handleInput"
    )
</template>

<script>
export default {
    name: 'formTextarea',
    props: ['label','value'],
    computed: {
    },
    methods: {
        handleInput (e) {
            this.$emit('input', e)
        }
    }
}
</script>