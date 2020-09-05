import axios from "axios";
import endpoints from "../../utils/constants/endpoints";

export default {
    state: {
        deviceList: []
    },

    mutations: {
        setDeviceList: (state, deviceList) => {
            state.deviceList = deviceList;
        },
    },

    actions: {
        fetchDevices: ({ commit }) => {
            return new Promise((resolve, reject) => {
                axios({url: endpoints.DEVICE, method: 'GET' })
                    .then(resp => {
                        commit('setDeviceList', resp.data);

                        // response is array of device
                        resolve(resp.data);
                    })
                    .catch(error => reject(error.response));
            });
        },
    },

    getters: {
        getDeviceList: state => state.deviceList
    },
}