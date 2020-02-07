const logs = {
    state: {
        data: [],
        chronologyLoading: false
    },
    mutations: {
        addLogEntries (state, payload) {
            state.data = payload
        },
        flushLogs (state) {
            state.data = []
        },
        setChronologyLoading (state, payload) {
            state.chronologyLoading = payload;
        }
    },
    actions: {
        getLogsByDate: async function (context, payload) {
            let q;
            const url = context.getters.urlMango;
            context.commit('flushLogs');
            if (payload.type == 'day') {
                q = payload.id.slice(0,10);
            }
            let mango = {
                "selector": {
                    "realm": "logs",
                    "start": { "$regex": `^${q}` }
                },
                "limit": 100,
                "sort": [
                    { "start": "asc" }
                ]
            };
            let data = await context.dispatch('postData', {url:url, data:mango} );
            context.commit('addLogEntries', data.docs);
            context.commit('setChronologyLoading', false);
        },
        getLogsTagList: async function (context) {
            let url = context.getters.urlDB;
            const response = await fetch(url + '/_design/pimpim/_view/logs-tag-count?group=true');
            context.commit('setTagList', await response.json())
        },
        getLastLogEntriesByCount: async function (context, payload) {
            let p = payload;
            let url = context.getters.urlMango;
            context.commit('flushLogs');
            let now = new Date().toISOString().slice(0, 16);
            let mango = {
                "selector": {
                    "realm": "logs",
                    "created": { "$lte": now }
                },
                "limit": p,
                "sort": [
                    { "created": "desc" }
                ]
            };
            let data = await context.dispatch('postData', {url:url, data:mango} );
            context.commit('addLogEntries', data.docs)
        },
        getLogEntriesByTag: async function (context, tag) {
            let url = context.getters.urlMango;
            context.commit('toggleLoader');
            context.commit('flushLogs');
            let mango = {
                "selector": {
                    "realm": "logs",
                    "tags": {
                        "$in": [tag]
                    }
                },
                "limit": 100
            };
            if (tag == 'inbox' || tag == 'untagged') { mango.selector.tags = [] }

            let data = await context.dispatch('postData', {url:url, data:mango} );
            context.commit('addLogEntries', data.docs);
            context.commit('toggleLoader');
        }
    },
    getters: {
        getLogs: state => {
            return state.data
        },
        countDisplayedLogs: state => {
            return state.data.length
        },
        getChronologyLoading: state => {
            return state.chronologyLoading
        }        
    },
}

export default logs