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
                //accent: colors.indigo.base, // #3F51B5
                info: colors.cyan,
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
                primary: colors.blueGrey.darken2,
                secondary: colors.teal,
                //primary: '#00838f', // undecided
                //secondary: '#2F4F4F', //DarkSlateGray
                error: '#cf6679',
                warning: '#ffa000', //Amber
                info: '#0277bd', // 
                success: '#6b8e23', // Olive drab
            },
        }
    }
});