import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes:{
            light: {
                primary: '#009688',
                secondary: '#3f51b5',
                accent: '#e91e63',
                error: '#f44336',
                warning: '#ff5722',
                info: '#00bcd4',
                success: '#4caf50'
            },
        },
    },
});
