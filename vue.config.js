module.exports = {
    publicPath: '',
    "transpileDependencies": [
        "vuetify"
    ],
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "artifactName": "${productName}_desktop.${ext}"
            }
        }
    },
    pwa: {
        name: 'offPIM',
        themeColor: '#005a6a',
        msTileColor: '#005a6a',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'teal',
        manifestOptions: {
            background_color: '#546e7a'
        },
    },
    productionSourceMap: false,
    css: {
        extract: false
    }
}