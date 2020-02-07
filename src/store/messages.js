const messages = {
    state: {
        data: [],
        activeMessageId: null,
        messagesUnreadCount: 0,
    },
    mutations: {
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
        setMessagesUnreadCount (state, payload) {
            state.messagesUnreadCount = payload;
        },
    },
    actions: {
        setMessagesUnreadCount: async function (context) {
            let url = context.getters.urlMango;
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
            };
            let data = await context.dispatch('postData', {url:url, data:mango} );
            context.commit('setMessagesUnreadCount', data.docs.length);
        },
        getMessagesByTag: async function (context, payload) {
            let tag = payload;
            let url = context.getters.urlMango;
            context.commit('toggleLoader');
            context.commit('flushMessages');
            let mango = {
                "selector": {
                    "realm": "messages",
                    "tags": {
                        "$in": [tag]
                    }
                },
                "limit": 100
            };
            if (tag == 'inbox' || tag == 'untagged') { mango.selector.tags = [] }

            let data = await context.dispatch('postData', {url:url, data:mango} );
            context.commit('addMessageEntries', data.docs);
            context.commit('toggleLoader');
        },
        getMessagesTagList: async function (context) {
            let url = context.getters.urlDB;
            const response = await fetch(url + '/_design/pimpim/_view/messages-tag-count?group=true');
            context.commit('setTagList', await response.json())
        }
    },
    getters: {
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
        getMessagesUnreadCount: state => {
            return state.messagesUnreadCount
        }
        
    },
}

export default messages