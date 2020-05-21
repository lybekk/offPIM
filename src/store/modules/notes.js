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
            } catch (err) {
                context.commit('addAlert', { type: 'error', text: err })
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