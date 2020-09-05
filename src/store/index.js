import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth.module'
import user from './modules/user.module'
import room from './modules/room.module'
import device from './modules/device.module'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        auth,
        user,
        room,
        device
    }
})