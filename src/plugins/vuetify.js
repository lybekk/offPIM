import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

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
            },
            dark: {
                primary: '#00838f', // undecided
                secondary: '#2F4F4F', //DarkSlateGray
                error: '#cf6679', 
                warning: '#ffa000', //Amber
                info: '#0277bd', // 
                success: '#6b8e23', // Olive drab
            },
        }
    }
});
