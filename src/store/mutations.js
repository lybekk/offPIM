export default {

  setLeftDrawer(state, payload) {
    state.leftDrawer = payload
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
  addAlert(state, payload) {
    let p = payload;
    let alert = {
      type: p.type,
      text: p.text,
      alert: true
    };
    state.alerts.push(alert);
    console.log('offPIM reported an error: ', p.text);
  },
  deleteAlert(state, payload) {
    state.alerts.splice(payload, 1)
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
      const j = JSON.parse( s );
      state.localSettings = j;
    }
  },

  setLocalSetting(state, payload) {
    const k = payload.key;
    const v = payload.value;

    let s = window.localStorage.getItem('offpimLocalSettings');
    if (!s) {
      window.localStorage.setItem('offpimLocalSettings', JSON.stringify({}) )
    }
    const j = JSON.parse( s );
    j[k] = v;
    window.localStorage.setItem('offpimLocalSettings', JSON.stringify(j) );
    state.localSettings[k] = v;
  }


}