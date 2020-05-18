<template lang="pug">
    //- TODO Conider FAB mdi-send
    v-btn(
        :color="insertedOK ? 'success' : 'primary'"
        @click="insertDoc"
        text
        )
        v-icon(v-if="insertedOK") mdi-check
        span(v-else) Submit
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
    name: 'formsubmit',
    mixins: [pouchMixin],
    props: ["doc"],
    data: () => ({
        insertedOK: null,
    }),
    methods:{
        insertDoc: async function() {
            console.log(this.doc);
            const response = await this.putDoc(this.doc);
            if (response.ok) {
                this.insertedOK = true
            } else {
                this.insertedOK = false
            }
        }
    }
}
</script>