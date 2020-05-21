const logs = {
    state: {
    },
    mutations: {
        /*
        addLogEntries (state, payload) {
            state.data = payload.docs
        },
        
        flushLogs (state) {
            state.data = []
        },
        */
       /*
        setChronologyLoading (state, payload) {
            state.chronologyLoading = payload;
        }
        */
    },
    actions: {
        /*
        getLogsTagList: async function (context) { 
            //let url = context.getters.urlDB;
            //const response = await fetch(url + '/_design/offpim/_view/logs-tag-count?group=true');
            //context.commit('setTagList', await response.json())
            try {
                var result = await window.db.query('offpim/logs-tag-count', {
                    group: true
                });
                context.commit('setTagList', result)
                //result.rows.forEach( (aggregate) => {
                //    context.commit('setTaskStatuses', aggregate)
                //});
            } catch (err) {
                context.commit('addAlert', {type:'error',text:err})
            }
        },
        */
        /*
        getLastLogEntriesByCount: async function (context, payload) {
            let p = payload;
            //let url = context.getters.urlMango;
            context.commit('loaderActive'); 
            //context.commit('flushLogs');
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

            try {
                let data = await window.db.find(mango);
                context.commit('addLogEntries', data)
                //vstore.commit('addNotes', data)
                context.commit('loaderInactive');
            } catch (error) {
                context.commit('showSnackbar', { text:error });
            }

            //let data = await context.dispatch('postData', {url:url, data:mango} );
            //context.commit('addLogEntries', data.docs)
        },
        */
        /*
        getLogEntriesByTag: async function (context, tag) {
            //let url = context.getters.urlMango;
            context.commit('loaderActive'); 
            //context.commit('flushLogs');
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

            try {
                let data = await window.db.find(mango);
                context.commit('addLogEntries', data)
                context.commit('loaderInactive');
            } catch (error) {
                context.commit('showSnackbar', { text:error });
            }
        }
        */
    },
    getters: {
        /*
        getLogs: state => {
            return state.data
        },
        */
        /*
        countDisplayedLogs: state => {
            return state.data.length
        },
        
        getChronologyLoading: state => {
            return state.chronologyLoading
        }
        */
    },
}

export default logs