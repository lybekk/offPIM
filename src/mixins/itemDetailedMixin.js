export default {
    computed: {
        doc() {
            return this.$store.getters.selectedDoc;
        },
        dialogItemDetailed: {
            get: function () {
                return this.$store.getters.dialogItemDetailed;
            },
            set: function (val) {
                const mutation = val
                    ? "dialogItemDetailedShow"
                    : "dialogItemDetailedHide";
                this.$store.commit(mutation, "dialogItemDetailed");
            }
        },
    },
    methods: {
        setDocField: async function (key, value) {
            let id = this.doc._id;
            let freshDoc = await this.getDoc(id);
            freshDoc[key] = value;
            await this.putDoc(freshDoc);
            this.$store.dispatch("refreshDoc", id);
        },
    }
};