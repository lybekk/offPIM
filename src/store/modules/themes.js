import vuetify from '@/plugins/vuetify';
//import vuetify from '../../plugins/vuetify';

const themes = {
    state: {
        currentTheme: null,
        themeColors: ["primary","secondary","info","error","warning","success"],
        themes: {
            'Vuetify': {
                primary: '#1976D2',
                secondary: '#424242',
                accent: '#82B1FF',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107',
            },
            'Northern Lights': {
                primary: '#18202b',
                secondary: '#dee1df',
                info: '#2f5e6e',
                error: '#ff6c5a',
                warning: '#c7882d',
                success: '#6abd89', //darker 24442f
                //accent: '#8B008B', //
            },
            'Northern Lights 2': {
                primary: '#024788', //Blueblood // option#2 -> danube 386fa5
                secondary: '#545d64', //outerspace
                info: '#846496', // clematis
                error: '#d56891', //hibiscus
                warning: '#a07d6a', //moroccan brown
                success: '#6abd89', // ??
                //accent: '#8B008B', //
            } //cyberrenness
          }
    },
    mutations: {
        setCurrentTheme (state, themeName) {
            state.currentTheme = themeName //not sure if needed
        }
        /*
        setThemeInLocalStorage
        setFormProperty (state, payload) {
            state.properties[payload.property] = payload.value
        },
        resetForm (state) {
            let v = state.properties;
            for (let key in v ) {
                v[key] = null;
              }
            //state.properties = {}
        }
        */
    },
    actions: {
        setThemeInLocalStorage (context, themeName) {
            if(!themeName) {
                localStorage.removeItem('currentTheme');
                context.commit('setCurrentTheme', null)
                //context.state.currentTheme = null
            } else {
                localStorage.setItem("currentTheme", themeName);
                context.commit('setCurrentTheme', themeName) //not sure if needed
                //context.state.currentTheme = themeName 
                context.dispatch('applyLightTheme', themeName)
            }
        },
        applyLightTheme: function (context, themeName) {
            const obj = context.state.themes[themeName]
            //let l = this.$vuetify.theme.themes.light;
            //let l = Vue.prototype.$vuetify.theme.themes.light;
            let l = vuetify.framework.theme.themes.light;
            Object.keys(obj).forEach(element => {
              l[element] = obj[element]
            });
        },
        checkThemeSettings: function (context) {
            const x = localStorage.getItem("currentTheme");
            //if ( localStorage.getItem("currentTheme") ) {
            if (x) {
                context.dispatch('applyLightTheme', x)
                context.state.currentTheme = x
            }
        }
        /*
        applyLightTheme: function(themeName) {
            const obj = this.themes[themeName]
            let l = this.$vuetify.theme.themes.light;
            Object.keys(obj).forEach(element => {
              l[element] = obj[element]
            });
        }
        */
    },
    getters: {
        getThemeColors: state => {
            return state.themeColors
        },
        getThemes: state => {
            return state.themes
        }
    },
}

export default themes