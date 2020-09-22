export default {
    methods: {
        setFieldGeneric: async function(payload) {
            try {
                let doc;
                doc = await window.db.get(payload._id);
                doc[payload.field] = payload.value;
                this.putDoc(doc)
                this.$emit("set-doc");
            } catch (error) {
                this.$store.dispatch("infoBridge", { color: 'error', text: error, level: 'error' });
            }
        },

        getDoc: async function(id, silent = false) {
            try {
                const result = await window.db.get(id);
                return result
            } catch (error) {
                let obj = { color: 'error', text: error, level: 'error' };
                if (error.status === 404) {
                    silent = true;
                    obj = {
                        ...obj,
                        deleted: true,
                        _id: 'document deleted'
                    }
                }
                if (silent) {
                    obj.silent = true;
                }
                this.$store.dispatch("infoBridge", obj);
                return obj
            }
        },

        putDoc: async function(doc, snackbarText = false) {
            try {
                const silent = snackbarText == 'silent' ? true : false;
                const response = doc._id ? await window.db.put(doc) : await window.db.post(doc);

                if (response.ok) {
                    let txt;
                    if (snackbarText) {
                        txt = snackbarText
                    } else {
                        txt = doc._id ? 'Document updated' : 'Document created';
                    }

                    if (!silent) {
                        this.$store.dispatch("infoBridge", { color: 'success', text: txt });
                    }
                    return response
                } else {
                    if (!silent) {
                        this.$store.dispatch("infoBridge", { color: 'error', text: 'Document update failed' + response, level: 'error' });
                    }
                }
            } catch (error) {
                this.$store.dispatch("infoBridge", { color: 'error', text: error, level: 'error' });
                return error
            }
        },

        deleteDoc: async function(id) {
            let result;
            try {
                var doc = await window.db.get(id);
                doc._deleted = true;

                var response = await this.putDoc(doc);

                this.$store.commit('addDeleted', id)
                this.$store.dispatch("infoBridge", {
                    text: 'Document deleted',
                    color: 'info',
                    error: id + ' Doc delete result: ' + response,
                });
            } catch (error) {
                this.dispatch("infoBridge", { color: 'error', text: 'Deleting document failed: ', level: 'error', error: error });
                result = error
            }
            return await result;
        },

        setFieldDate: async function(payload) {
            try {
                let doc = await window.db.get(payload._id);
                if (doc.type == 'task' && payload.field == 'due') {
                    doc.postponed++;
                }
                let dateString = doc[payload.field];
                if (typeof dateString == 'undefined') {
                    dateString = '2020-01-01T00:00:00.000Z';
                }
                let currentDate = new Date(dateString);
                let newDate = new Date(payload.value);
                currentDate.setFullYear(newDate.getFullYear());
                currentDate.setMonth(newDate.getMonth());
                currentDate.setDate(newDate.getDate());
                doc[payload.field] = currentDate.toISOString();
                this.putDoc(doc)
            } catch (error) {
                this.$store.dispatch("infoBridge", { color: 'error', text: error, level: 'error' });
            }

        },

        setFieldNull: async function(payload) {
            try {
                let doc = await window.db.get(payload._id);
                doc[payload.field] = null;
                this.putDoc(doc)
            } catch (error) {
                this.$store.dispatch("infoBridge", { color: 'error', text: error, level: 'error' });
            }
        },

        setFieldTime: async function(payload) {
            let doc = await window.db.get(payload._id);
            let dateString = doc[payload.field];
            if (typeof dateString == 'undefined') {
                let d = new Date();
                dateString = d.toISOString();
            }
            let newDate = new Date(dateString);
            let TZ = newDate.getTimezoneOffset() / 60;
            let h = parseInt(payload.value.slice(0, 2));
            newDate.setHours(h - TZ);
            newDate.setMinutes(payload.value.slice(3, 5));
            newDate.setMilliseconds(0);
            newDate.setSeconds(0);
            doc[payload.field] = newDate.toISOString();
            this.putDoc(doc)
        },

        getMango: async function(mango) {
            // Future feature: if using remote instead of local db (vuex state?), switch to window.remoteDB
            this.$store.commit('loaderActive');
            try {
                const data = await window.db.find(mango);
                this.$store.commit('loaderInactive');

                // debugging
                window.db.explain(mango)
                    .then(function(explained) {
                        console.log('Mango query explained: ', explained)
                            // detailed explained info can be viewed
                    });
                return data
            } catch (error) {
                this.$store.dispatch("infoBridge", { color: 'error', text: error, level: 'error' });
            }
        },

        getQuery: async function(view, startKey, endKey, includeDocs = false) {
            let context = this;
            context.$store.commit('loaderActive');


            let options = {
                limit: 100, // consider controlling this value with vuex
                reduce: false,
                include_docs: false
            };
            if (view == 'offpim/contacts-all') {
                options.limit = 1000
            }
            if (view == 'offpim/logs-start-days') {
                options.descending = true;
                options.limit = 30;
                options.group = true;
            }

            if (startKey) {
                options.startkey = startKey;
                options.endkey = endKey;
            }

            if (includeDocs) { options.include_docs = true }

            let result = [];
            try {
                let data = await window.db.query(view, options);
                for await (let row of data.rows) {
                    if (includeDocs) {
                        result.push(row.doc)
                    } else {
                        result.push({ _id: row.id })
                    }
                }
                context.$store.commit("loaderInactive");
                return result
            } catch (error) {
                this.$store.dispatch("infoBridge", { color: 'error', text: error, level: 'error' });
            }
        },

    }
};
