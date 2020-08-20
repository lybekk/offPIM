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
        themeColor: '#009688',
        msTileColor: '#009688',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'teal',
        manifestOptions: {
            display: 'fullscreen', // change to 'standalone' if fullscreen creates inconvenience
            background_color: '#546e7a',
            "share_target": {
                "action": "/share-target/",
                "method": "GET",
                "params": {
                  "title": "Share to offPIM",
                  "text": "text",
                  "url": "/#/new/task",
                }
              },
              "shortcuts": [
                {
                  "name": "App shortcut test",
                  "short_name": "Test shortcut",
                  "description": "Will be used for adding tasks",
                  "url": "/#/new/task",
                  "icons": [{ "src": "/img/icons/android-chrome-192x192.png", "sizes": "192x192" }]
                }
              ],
        },
    },
    productionSourceMap: false,
    css: {
        extract: false
    }
}