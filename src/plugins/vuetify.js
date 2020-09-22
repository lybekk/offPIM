import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
/* Old theme. Keep for the time being
import colors from 'vuetify/lib/util/colors'
import minifyTheme from 'minify-css-string'
*/

Vue.use(Vuetify);

const nord = {
    polarNight: {
        nord0: '#2e3440', // darkest
        nord1: '#3B4252',
        nord2: '#434C5E',
        nord3: '#4C566A',
    },
    snowStorm: {
        nord4: '#d8dee9', // darkest
        nord5: '#e5e9f0',
        nord6: '#eceff4',
    },
    frost: {
        nord7: '#8fbcbb', // teal-ish
        nord8: '#88c0d0', // cyan-ish
        nord9: '#81a1c1', // light steel-blue
        nord10: '#5e81ac', // dark steel-blue
    },
    aurora: {
        nord11: '#bf616a', // red
        nord12: '#d08770', // orange
        nord13: '#ebcb8b', // yellow
        nord14: '#a3be8c', // green
        nord15: '#b48ead', // pink/purple
    },
}

export default new Vuetify({
    theme: {
        options: {
            /* Test performance without these
            minifyTheme,
            themeCache: {
                get: key => localStorage.getItem(key),
                set: (key, value) => localStorage.setItem(key, value),
            },
            */
           customProperties: true,
        },
        themes: {
            light: {
                primary: nord.snowStorm.nord5,
                secondary: nord.frost.nord8,
                info: nord.frost.nord9,
                warning: nord.aurora.nord13,
                error: nord.aurora.nord11,
                success: nord.aurora.nord14,
                background: nord.snowStorm.nord6,
            },
            dark: {
                primary: nord.polarNight.nord1,
                secondary: nord.frost.nord7,
                info: nord.aurora.nord15,
                warning: nord.aurora.nord13,
                error: nord.aurora.nord11,
                success: nord.aurora.nord14,
                background: nord.polarNight.nord0
            },
        },
        /* Old theme. Keep for the time being
        themes: {
            light: {
                primary: colors.blueGrey.darken1,
                //primary: '#88c0d0',
                secondary: colors.teal,
                //secondary: '#8FBCBB',
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
        */
    }
});
