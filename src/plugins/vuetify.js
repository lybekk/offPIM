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
                accent: colors.red,
                info: colors.cyan.darken1,
                warning: colors.amber.darken1,
                error: colors.pink.darken3,
                success: colors.lightGreen.darken3,
            },
            dark: {
                primary: colors.blueGrey.darken4,
                secondary: colors.teal.darken1,
                accent: colors.red.darken4,
                info: colors.cyan.darken1,
                warning: colors.amber.lighten1,
                error: colors.red.lighten2,
                success: colors.lightGreen.darken3,
            },
        }
    }
});