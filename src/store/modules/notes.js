const notes = {
    state: {
        selectedNote: {},
        showNoteSheet: false
    },
    mutations: {

        setSelectedNote(state, doc) {
            state.selectedNote = doc;
        },


    },
    actions: {
        async populateTagsList(context) {
            try {
                var result = await window.db.query('offpim/note-tag-count', {
                    group: true
                });
                context.commit('setTagList', result)
            } catch (error) {
                this.$store.dispatch("infoBridge", {
                    text: error,
                    color: "error",
                });
            }

        },

    },
    getters: {

        selectedNote: state => {
            return state.selectedNote
        }

    },
}

export default notes