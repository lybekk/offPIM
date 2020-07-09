export default {
    setTotals: async function(context) {
        const response = await window.db.query('offpim/totals', {
            group: true
        })
        context.commit('setTotals', response)
    },

    deleteDocument: async function(context, docId) {
        let result;
        try {
            var doc = await window.db.get(docId);
            var response = await window.db.remove(doc);
            this.commit('addDeleted', docId)
            this.dispatch("infoBridge", {
                text: 'Document deleted',
                color: 'info',
                error: docId + ' Doc delete result: ' + response,
            });
        } catch (error) {
            this.dispatch("infoBridge", { color: 'error', text: 'Deleting document failed: ', level: 'error', error: error });
            result = error
        }
        return await result;
    },

    insertDocument: async function(state, payload) {
        let txt;
        let pDoc = payload.doc;

        try {
            if (!pDoc._id) { // Consider handing off _id(uuid)generation to PouchDB
                const errtxt = "_id missing in request. Insert unsuccessful";
                throw errtxt
            }

            if (pDoc._rev) {
                var eDoc = await window.db.get(pDoc._id);
                pDoc._rev = eDoc._rev
            }

            var response = await window.db.put(pDoc);
            if (response.ok) {
                if (payload.snackbarText) {
                    txt = payload.snackbarText
                } else {
                    txt = 'Document update OK'
                }
                this.dispatch("infoBridge", { color: 'success', text: txt });
            } else {
                const errtxt = 'Document update failed' + response;
                throw errtxt
            }
            return await response;
        } catch (error) {
            this.dispatch("infoBridge", { color: 'error', text: 'Document operation failed', level: 'error', error: error });
        }
    },

    postData: async function(state, payload) {
        this.commit('loaderActive')
        const response = await fetch(payload.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload.data)
        });
        let data = await response.json();
        this.commit('loaderInactive')
        return data;
    },

    startupIndexCheck: async function(context, payload) {
        try {
            const localVersion = payload.version;
            const dbDoc = await window.db.get(`_design/${payload.doc}`); // databaseDesignDoc
            if (localVersion > dbDoc.version) {
                console.log('Design document version in app is higher than the one in the database. Attempting design doc insert');
                return false
            }
            return true
        } catch (error) {
            console.log('Design doc ' + payload.doc + ' not in local database: ', error)
            return false
        }
    },

    remoteDBConnectivityCheck: async function(context) {
        try {
            const response = await window.remoteDB.info();
            if (response.db_name) {
                context.commit('setGenericStateBooleanTrue', 'remoteDBIsOnline');
                context.dispatch("infoBridge", { color: 'success', text: 'Remote database connection successful' });
                context.dispatch('remoteDBInfo');
                return true
            }
        } catch (error) {
            // TODO Advise troubleshooting steps (network/curl, CORS )
            context.dispatch("infoBridge", { color: 'warning', text: 'Remote database connection unsuccessful', level: 'warn', error: error });
            context.commit('setGenericStateBooleanFalse', 'remoteDBIsOnline');
            return false
        }
    },

    remoteDBInfo: async function(context) {
        const result = await window.remoteDB.info();
        context.commit('remoteDBInfo', result)
    },

    localDBInfo: async function(context) {
        const result = await window.db.info();
        context.commit('localDBInfo', result)
    },

    setRawDocumentViewerDocument: async function(context, docId) {
        try {
            context.commit(
                'setRawDocumentViewerDocument',
                await window.db.get(docId)
            )
        } catch (error) {
            context.dispatch("infoBridge", { color: 'warning', text: 'Could not find document', level: 'warn', error: error });
        }
    },

    getDoc: async function(context, docId) {
        // TODO WAIT - When using remote as primary. use window.remoteDB
        return await window.db.get(docId);
    },

    refreshDoc: async function(context, docId) {
        const doc = await context.dispatch('getDoc', docId);
        context.commit('refreshDoc', doc)
    },

    /**
     * Distributes internal offPIM logs, messages and notifications.
     * All object sent to infoBridge will be logged to sessionLogs.
     * If object contains color: 'string', it will be sent to snackbar
     * @param {*} context 
     * @param {*} obj 
     */
    infoBridge: function(context, obj) {
        obj.created = new Date().toISOString();

        if (obj.color && !obj.silent) {
            context.commit("showSnackbar", obj);
        }

        if (obj.color && !obj.level) {
            const translation = {
                primary: 'info',
                info: 'info',
                secondary: 'info',
                success: 'success',
                error: 'error',
                warning: 'warn',
            };
            obj.level = translation[obj.color];
        }

        if (!obj.level) {
            obj.level = 'info';
        }

        if (obj.level === 'error') {
            console.warn('offPIM Info Bridge reports an error: ', JSON.stringify(obj));
        }

        context.commit('addSessionLog', obj)
    },

    /**
     * I.E. 'offpim/note-tag-count'
     * @param {*} context 
     * @param {*} view 
     */
    async populateTagsList(context, view) {
        try {
            var result = await window.db.query(view, {
                group: true
            });
            context.commit('setTagList', result)
        } catch (error) {
            context.dispatch("infoBridge", {
                text: error,
                color: "error",
            });
        }

    },

}