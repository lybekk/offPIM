export default {
  /*
  urlMango: state => {
    let u = state.dbBasePath + state.database + '/_find' ;
    return u
  },

  localDB: state => {
    let u = state.localDB;
    return u
  },
  remoteDB: state => {
    let u = state.remoteDB;
    return u
  },
  
  urlDB: state => {
    let u = state.dbBasePath + state.database + '/' ;
    return u
  },
  
  urlDBRoot: state => {
    let u = state.dbBasePath ;
    return u
  },
  
  dbName: state => {
    let u = state.database ;
    return u
  },
   */
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

  getAlerts: state => {
    return state.alerts
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
    //return state.data.find(item => item._id === id)
    //const index = state.data.findIndex( ({ _id }) => _id === payload._id );
    return state.data.findIndex( ({ _id }) => _id === id );
  },

  dbConnectionDialog: state => {
    return state.dbConnectionDialog
  },

  /*
  isPouchDB: state => {
    return state.isPouchDB
  },
  */
}