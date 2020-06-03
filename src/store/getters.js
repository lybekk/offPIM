export default {

  isLeftDrawerOpen: state => {
    return state.leftDrawer
  },

  isRightDrawerOpen: state => {
    return state.rightDrawer
  },

  localDBInfo: state => {
    return state.localDBInfo
  },

  remoteDBInfo: state => {
    return state.remoteDBInfo
  },

  remoteDBSettings: state => {
    return state.remoteDBSettings
  },

  remoteDBIsOnline: state => {
    return state.remoteDBIsOnline
  },

  getDeletedDocuments: state => {
    return state.deleted
  },

  isDeleted: (state) => (id) => {
    return state.deleted.includes(id)
  },

  loaderState: state => {
    return state.loaderActive
  },

  getTotals: state => {
    return state.totals
  },

  getTagList: state => {
    return state.tagList
  },

  getData: state => {
    return state.data
  },

  getDataLength: state => {
    return state.data.length
  },

  getDataItem: (state) => (id) => {
    return state.data.find(item => item._id === id)
  },

  getDataItemIndex: (state) => (id) => {
    return state.data.findIndex(({ _id }) => _id === id);
  },

  dbConnectionDialog: state => {
    return state.dbConnectionDialog
  },

  dialogItemDetailed: state => {
    return state.dialogItemDetailed
  },

  localSettings: state => {
    return state.localSettings
  },

  rawDocumentViewerDialog: state => {
    return state.rawDocumentViewerDialog
  },

  rawDocumentViewerDocument: state => {
    return state.rawDocumentViewerDocument
  },

  buttonFormNewHidden: state => {
    return state.buttonFormNewHidden
  },

  appBarTabs: state => {
    return state.appBarTabs
  },

  sessionLogs: state => {
    return state.sessionLogs
  },

  selectedDoc: state => {
    return state.selectedDoc
  }

}