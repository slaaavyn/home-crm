import axios from 'axios'

import endpoints from '../../utils/constants/endpoints'
import storageTypes from '../../utils/constants/localStorage'

export default {
    state: {
        token: localStorage.getItem(storageTypes.TOKEN) || '',
        tokenExpired: localStorage.getItem(storageTypes.TOKEN_EXPIRED) || '',
        refreshToken: localStorage.getItem(storageTypes.REFRESH_TOKEN) || '',
        refreshTokenExpired: localStorage.getItem(storageTypes.REFRESH_TOKEN_EXPIRED) || ''
    },

    mutations: {
        AUTH_SUCCESS: (state, responseObj) => {
            state.token = responseObj.token;
            localStorage.setItem('token', state.token);

            state.tokenExpired = responseObj.tokenExpired;
            localStorage.setItem('tokenExpired', state.tokenExpired);
            
            state.refreshToken = responseObj.refreshToken;
            localStorage.setItem('refreshToken', state.refreshToken);

            state.refreshTokenExpired = responseObj.refreshTokenExpired;
            localStorage.setItem('refreshTokenExpired', state.refreshTokenExpired);
        },

        AUTH_LOGOUT: (state) => {
            state.token = '';
            localStorage.removeItem(storageTypes.TOKEN);

            state.tokenExpire = null;
            localStorage.removeItem(storageTypes.TOKEN_EXPIRED);

            state.refreshToken = '';
            localStorage.removeItem(storageTypes.REFRESH_TOKEN);

            state.refreshTokenExpired = null;
            localStorage.removeItem(storageTypes.REFRESH_TOKEN_EXPIRED);
        },
    },

    actions: {
        authRequest: ({ commit }, user) => {
            return new Promise((resolve, reject) => {

                axios({url: endpoints.AUTH, data: user, method: 'POST' })
                    .then(resp => {
                        const responseObj = {
                            token: resp.data.token,
                            tokenExpired: resp.data.tokenExpired,
                            refreshToken: resp.data.refreshToken,
                            refreshTokenExpired: resp.data.refreshTokenExpired,
                        };

                        commit('AUTH_SUCCESS', responseObj);
                        commit('updateLocalUser', resp.data.user);

                        resolve(resp);
                    })
                    .catch(err => {
                        commit('AUTH_LOGOUT');
                        commit('clearLocalUser');
                        reject(err);
                    })
            });
        },

        authLogout: ({commit}) => {
            return new Promise((resolve) => {
                commit('AUTH_LOGOUT');
                delete axios.defaults.headers.common['Authorization'];
                resolve();
            })
        }
    },

    getters: {
        isAuthenticated: state => state.token.length !== 0 && Date.parse(state.tokenExpired) > new Date().getTime(),
    }
  }