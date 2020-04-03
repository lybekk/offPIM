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
  }
}
