export default {
    methods: {
        showItemDetailed: function () {
            this.$store.commit("setSelectedDoc", this.doc);
            this.$store.commit("dialogItemDetailedShow");
        },
        /**
         * Retrieves a fresh copy of the document and displays it in the document viewer.
         * @param {string} docId - Document ID (_id)
         */
        viewDocument: async function (docId) {
            const freshDoc = await this.getDoc(docId);
            this.$store.commit("setSelectedDoc", freshDoc);
            this.$store.commit("showDocumentViewer");
        }
    }
};
