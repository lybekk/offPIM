export default {
    methods: {
        showItemDetailed: function () {
            this.$store.commit("setSelectedDoc", this.doc);
            this.$store.commit("dialogItemDetailedShow");
        },
        viewDocument: function (doc) {
            //this.$store.commit("setSelectedDoc", this.doc);
            this.$store.commit("setSelectedDoc", doc);
            //this.$store.commit("dialogItemDetailedShow");
            this.$store.commit("showDocumentViewer");
        }
    }
};