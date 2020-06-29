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
                //warning: colors.amber.lighten2,
                warning: colors.amber.accent3,
                error: colors.red.darken4,
                success: colors.lightGreen.darken3,

                //primary: '#005a6a', //Oceanside
                //secondary: '#dee1df', //Rock candy
                //error: '#874057', //Juneberry
                //warning: '#c7882d', //Auric
                //info: '#2ba9ae', //Aquarium
                //success: '#72754f', //Secret meadow
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