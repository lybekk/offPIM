const notes = {
    state: {
        selectedNote: {},
        showNoteSheet: false
    },
    mutations: {
        showNoteSheet(state) {
            state.showNoteSheet = true
        },
        hideNoteSheet(state) {
            state.showNoteSheet = false
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

        }
    },
    getters: {

        noteSheetState: state => {
            return state.showNoteSheet
        },

        selectedNote: state => {
            return state.selectedNote
        }

    },
}

export default notes