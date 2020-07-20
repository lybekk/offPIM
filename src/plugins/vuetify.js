import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors'
import minifyTheme from 'minify-css-string'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: {
            minifyTheme,
            themeCache: {
                get: key => localStorage.getItem(key),
                set: (key, value) => localStorage.setItem(key, value),
            },
        },
        themes: {
            light: {
                primary: colors.blueGrey.darken1,
                secondary: colors.teal,
                accent: colors.shades.black,
                info: colors.cyan,
                warning: colors.amber,
                error: colors.pink,
                success: colors.lightGreen,
                anchor: colors.teal,
            },
            dark: {
                primary: colors.blueGrey,
                secondary: colors.teal,
                accent: colors.red,
                info: colors.cyan,
                warning: colors.amber,
                error: colors.red,
                success: colors.lightGreen,
            },
        }
    }
});