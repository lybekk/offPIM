import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        themes: {
            light: {
                primary: '#005a6a', //Oceanside
                secondary: '#dee1df', //Rock candy
                error: '#874057', //Juneberry
                warning: '#c7882d', //Auric
                info: '#2ba9ae', //Aquarium
                success: '#72754f', //Secret meadow
                //accent: '#8B008B', //
            },
            dark: {
                //primary: '#DAA520',
                primary: '#00838f', // undecided
                secondary: '#2F4F4F', //DarkSlateGray
                error: '#cf6679', 
                //accent: '#8B008B',
                warning: '#ffa000', //Amber
                info: '#0277bd', // 
                success: '#72754f', // #33691e
            },
        }
    }
});
