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
    
    getters: {

        selectedNote: state => {
            return state.selectedNote
        }

    },
}

export default notes