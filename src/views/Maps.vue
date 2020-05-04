<template lang="pug">
v-content
    v-container(fluid)
        div#map Leaflet here

</template>

<script>

export default {
    name: 'maps',
    components: {
    },
    props: {
        source: String,
    },
    data: () => ({
    }),
    computed: {
    },
    created: function () {
    },
    mounted () {
    },
    beforeDestroy() {
    },
    methods: {
    }
}

</script>