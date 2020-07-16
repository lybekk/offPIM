import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        themes: {
            light: {
                primary: colors.blueGrey,
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