module.exports = {
  publicPath: '/pimpim/',
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        "artifactName": "${productName}_desktop.${ext}"
      }
    }
  },
  pwa: {
    name: 'pimpim',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    //workboxPluginMode: 'InjectManifest',
    workboxPluginMode: 'GenerateSW',
    /* no need for InjectManifest yet. 
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'src/service-worker.js',
      // ...other Workbox options...
    }
    */
  }
}
