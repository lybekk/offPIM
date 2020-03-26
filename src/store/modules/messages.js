const messages = {
    state: {
        //data: [],
        //activeMessageId: null,
        messagesUnreadCount: 0,
    },
    mutations: {
        /*
        addMessageEntries (state, payload) {
            state.data = payload
        },
        flushMessages (state) {
            state.data = []
        },
        setActiveMessage (state, payload) {
            state.activeMessageId = payload;
        },
        setRead (state, payload) {
            const index = state.data.findIndex(
                ({ _id }) => _id === payload
            );
            let msg = state.data[index];
            msg.read = true;
            let updateDoc = { doc: msg };
            this.dispatch('insertDocument', updateDoc);
        },
        */
        setMessagesUnreadCount (state, payload) {
            state.messagesUnreadCount = payload;
        },
    },
    actions: {
        setMessagesUnreadCount: async function (context) {
            let mango = {
                "selector": {
                    "realm": "messages",
                    "$or": [
                        { "read": false },
                        { "read": { "$exists": false } }
                    ]
                },
                "limit": 25,
                "fields": [
                    "_id"
                ]
                //"use_index": "pimpim_mango_indexes"
            };
            //let data = window.db.find(mango)
            try {
                let data = await window.db.find(mango);
                context.commit('setMessagesUnreadCount', data.docs.length);
                //this.noteList = data.docs;
                //vstore.commit('addNotes', data)
                //vstore.commit('loaderInactive');
              } catch (error) {
                context.commit('showSnackbar', { text:error });
              }
              //console.log('Mango Find Result: ',jau);
/*
            let jau = db.find({
                selector: {
                  realm: "messages",
                    $or: [
                        { read: false },
                        { read: { $exists: false } }
                    ]
                },
                limit: 25
                }
              );
              console.log('Mango Find Result: ',jau);
*/        

            //getMangoMessagesUnreadCount
            //if (payload == 'getMango') { return mango}
            //if (context.getters.isPouchDB) {
                //console.log('THISVM',this._vm)
                //console.log('vm: ',vm)
                //console.log(mango)
                /*
                vm.$pouch.find(
                    mango
                ).then(function (data) {
                    console.log(data)
                    // handle result
                    context.commit('setMessagesUnreadCount', data.docs.length);
                }).catch(function (err) {
                    console.log(err);
                });
                */
                //let data = vm.$pouch.find(mango)
                //console.log(data)
                //context.commit('setMessagesUnreadCount', data.docs.length);
            //} else {
                //let url = context.getters.urlMango;
                //let data = await context.dispatch('postData', {url:url, data:mango} );
                //context.commit('setMessagesUnreadCount', data.docs.length);
            //}
        }
    },
    getters: {
        /*
        getMessages: state => {
            return state.data
        },
        getActiveMessage: state => {
            const index = state.data.findIndex(
                ({ _id }) => _id === state.activeMessageId 
            );
            if (index == -1) {
                return false
            }
            return state.data[index]
        },
        */
        getMessagesUnreadCount: state => {
            return state.messagesUnreadCount
        },
        /*
        getMangoMessagesUnreadCount: () => {
            return {
                "selector": {
                    "realm": "messages",
                    "$or": [
                        { "read": false },
                        { "read": { "$exists": false } }
                    ]
                },
                "limit": 25,
                "fields": [
                    "_id"
                ],
                "use_index": "pimpim_mango_indexes"
            };
        },
        */
    },
}

export default messages