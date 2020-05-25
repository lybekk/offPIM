export default {
    methods: {
        showItemDetailed: function () {
            this.$store.commit("setSelectedDoc", this.doc);
            this.$store.commit("dialogItemDetailedShow");
        }
    }
};