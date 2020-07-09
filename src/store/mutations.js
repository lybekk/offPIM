import Vue from 'vue'

export default {

    setLeftDrawer(state, payload) {
        state.leftDrawer = payload
    },

    setRightDrawer(state, payload) {
        state.rightDrawer = payload
    },

    setTagList(state, payload) {
        state.tagList = payload.rows
    },

    setTotals(state, payload) {
        let s = state;
        let a = payload.rows;
        a.forEach(el => {
            s.totals[el.key] = el.value;
        });
    },

    showSnackbar(state, payload) {
        state.snackbar.text = payload.text
        state.snackbar.multiline = (payload.text.length > 50) ? true : false

        if (payload.multiline) {
            state.snackbar.multiline = payload.multiline
        }

        if (payload.color) {
            state.snackbar.color = payload.color
        } else {
            state.snackbar.color = ''
        }

        if (payload.timeout) {
            state.snackbar.timeout = payload.timeout
        }

        state.snackbar.visible = true
    },
    closeSnackbar(state) {
        state.snackbar.visible = false
        state.snackbar.multiline = false
        state.snackbar.timeout = 4000
        state.snackbar.text = null
    },
    addError(state, error) {
        state.errors.push(error)
    },
    addDataArray(state, arr) {
        state.data = arr;
    },
    flushData(state) {
        state.data = []
    },
    toggleLoader(state) {
        state.loaderActive = !state.loaderActive;
    },
    loaderInactive(state) {
        state.loaderActive = false;
    },
    loaderActive(state) {
        state.loaderActive = true;

    },

    addDeleted(state, docId) {
        state.deleted.push(docId);
    },

    setGenericStateString(state, payload) {
        state[payload.property] = payload.value
    },

    setGenericStateBooleanTrue(state, payload) {
        state[payload] = true
    },

    setGenericStateBooleanFalse(state, payload) {
        state[payload] = false
    },

    setremoteDBUrl(state, payload) {
        state.remoteDBSettings.name = payload
    },

    remoteDBInfo(state, payload) {
        state.remoteDBInfo = payload
    },

    localDBInfo(state, payload) {
        state.localDBInfo = payload
    },

    loadLocalSettings(state) {
        const s = window.localStorage.getItem('offpimLocalSettings');
        if (s) {
            const j = JSON.parse(s);
            state.localSettings = j;
        }
    },

    setLocalSetting(state, payload) {
        const k = payload.key;
        const v = payload.value;


        let s = window.localStorage.getItem('offpimLocalSettings');
        if (s == null) {
            window.localStorage.setItem('offpimLocalSettings', JSON.stringify({}))
        }
        const j = JSON.parse(window.localStorage.getItem('offpimLocalSettings'));
        j[k] = v;
        window.localStorage.setItem('offpimLocalSettings', JSON.stringify(j));
        state.localSettings[k] = v;
    },

    setRawDocumentViewerDocument(state, payload) {
        state.rawDocumentViewerDocument = payload;
        state.rawDocumentViewerDialog = true;
    },

    appBarTabs(state, payload) {
        state.appBarTabs = payload;
    },

    dialogItemDetailedHide: state => {
        state.dialogItemDetailed = false
    },

    dialogItemDetailedShow: state => {
        state.dialogItemDetailed = true
    },

    refreshDoc(state, doc) {
        const index = state.data.findIndex(({ _id }) => _id === doc._id);
        Vue.set(state.data, index, doc)
    },

    addSessionLog(state, doc) {
        state.sessionLogs.push(doc)
    },

    setSelectedDoc(state, doc) {
        state.selectedDoc = doc;
    },

}