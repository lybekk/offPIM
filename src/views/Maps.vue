<template lang="pug">
v-content
    v-container(fluid)
        v-row(
            no-gutters
        )
            v-col
                div#mapid
                div#navbtns
                    v-btn(
                        @click="whereAmI"
                    )
                        v-icon(v-text="myLocationIcon")

</template>

<script>
import L from 'leaflet';

export default {
    name: 'maps',
    components: {
    },
    props: {
        source: String,
    },
    data: () => ({
        myLocationIcon: 'mdi-crosshairs',
        mapSource: {
            openStreetMap: {
                tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains: ['a','b','c']
            }
        }
    }),
    computed: {
    },
    created: function () {
    },
    mounted () {
        const mapVendor = 'openStreetMap';
        const m = this.mapSource[ mapVendor ];

        this.mymap = L.map('mapid').setView([59.911491, 10.757933], 3);

        L.tileLayer( m.tileLayer, {
            attribution: m.attribution,
            subdomains: m.subdomains
        }).addTo( this.mymap );

    },
    beforeDestroy() {
    },
    methods: {
        whereAmI: function () {
            this.mymap.locate({setView: true, maxZoom: 16});
            this.myLocationIcon = 'mdi-crosshairs-gps';
        }
    }
}

</script>

<style scoped>
@import "~leaflet/dist/leaflet.css";

#mapid { height: 80vh; }

#navbtns {
    position: fixed;
    top: 70vh;
    left: 10vw;
    z-index: 1000;
}

</style>