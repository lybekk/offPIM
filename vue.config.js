module.exports = {
  publicPath: '',

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
    name: 'offPIM',
    themeColor: '#005a6a',
    msTileColor: '#005a6a',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      background_color: '#005a6a'
    },
  },
  productionSourceMap: false
}
