import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from "axios";
import sweetAlert from './plugins/sweetAlert';

import storageTypes from './utils/constants/localStorage'

Vue.config.productionTip = false

const token = localStorage.getItem(storageTypes.TOKEN)
if (token) {
    axios.defaults.headers.common['Authorization'] = token
}

new Vue({
    router,
    store,
    vuetify,
    sweetAlert,
    render: h => h(App)
}).$mount('#app')

