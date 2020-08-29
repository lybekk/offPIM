<template>
    <v-container>
    <h1>RSS feed reader</h1>
    <p v-for="item in getItems.docs" :key="item._id"> {{ item }}</p>
    </v-container>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
    name: 'Reader',
    mixins: [pouchMixin],
    methods: {
        getItems: async function() {
            return await this.getQuery('offpim/webfeeds', null, null, true)
        },
    }
}
</script>