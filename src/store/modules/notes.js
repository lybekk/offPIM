const notes = {
    state: {
        //data: [],
        //tagsList: [],
        //selectedNoteIndex: 0,
        selectedNote: {},
        showNoteSheet: false
    },
    mutations: {
        /*
        addNote (state, payload) { // may be removed in favor of addNotes
            state.data.push(payload)
        },
        */
       /*
        addNotes (state, payload) {
            state.data = payload.docs
        },
        
        flushNotes (state) {
            state.data = []
        },
        
        deleteNote (state, payload) {
            const index = state.data.findIndex( ({ _id }) => _id === payload );
            state.data[index].deleted = true;
            this.dispatch('deleteDocument', payload)
        },
        */
        showNoteSheet (state) {
            state.showNoteSheet = true
        },
        hideNoteSheet (state) {
            state.showNoteSheet = false
        },
        /*
        setSelectedNoteIndex (state, payload) {
            const index = state.data.findIndex( ({ _id }) => _id === payload );
            state.selectedNoteIndex = index;
        }
        */
    },
    actions: {
        async populateTagsList (context) {
            try {
                var result = await window.db.query('pimpim/note-tag-count', {
                    group: true
                });
                context.commit('setTagList', result)
                //result.rows.forEach( (aggregate) => {
                //    context.commit('setTaskStatuses', aggregate)
                //});
            } catch (err) {
                context.commit('addAlert', {type:'error',text:err})
            }

            //setTagList (state, payload) {
            //    state.tagList = payload.rows
            //  },

            /*
            let url = this.getters.urlDB;
            fetch(url + `_design/pimpim/_view/note-tag-count?group=true`)
            .then((resp) => resp.json())
            .then(function(data) {
               if (data.rows.length > 0) {
                    data.rows.forEach( (aggregate) => {
                        state.tagsList.push(aggregate);
                    });
                }
            });
            */
        }
    },
    getters: {
        /*
        getTagsList: state => {
            return state.tagsList
        },
        getNotes: state => {
            return state.data
        },
        */
        noteSheetState: state => {
            return state.showNoteSheet
        },
        /*
        selectedNote: state => {
            if (state.data.length == 0) {return { _id:"Over9000", title:'No document loaded' }}
            return state.data[state.selectedNoteIndex]
        },
        */
        selectedNote: state => {
            return state.selectedNote
        }
        /*
        isNoteArchived: (state) => (id) => {
            const a = state.data.find(note => note._id === id);
            return a.archived
        }
        */
    },
}

export default notes