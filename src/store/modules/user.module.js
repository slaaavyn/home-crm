import axios from 'axios';
import endpoints from "../../utils/constants/endpoints";
import storageTypes from "../../utils/constants/localStorage";

export default {
    state: {
        user: JSON.parse(localStorage.getItem(storageTypes.USER) || null),
    },
    mutations: {
        updateLocalUser: (state, user) => {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(state.user));
        },

        clearLocalUser: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        }
    },
    actions: {
        fetchAllUsers: () => {
            return new Promise((resolve, reject) => {
                axios({url: endpoints.USER, method: 'GET' })
                    .then(resp => {
                        // response is array of users
                        resolve(resp.data);
                    })
                    .catch(error => reject(error.response));
            });
        },

        fetchUserById: (ctx, id) => {
            return new Promise((resolve, reject) => {
                axios({url: `${endpoints.USER}/${id}`, method: 'GET' })
                    .then(resp => {
                        // response user
                        resolve(resp.data);
                    })
                    .catch(error => reject(error.response));
            });
        },

        createUser: (ctx, user) => {
            return new Promise((resolve, reject) => {

                axios({url: endpoints.USER_CREATE, data: user, method: 'POST' })
                    .then(resp => {
                        // response user
                        resolve(resp.data);
                    })
                    .catch(err => {
                        reject(err.response);
                    })
            });
        },

        updateUserInfo: ({ commit, state }, user) => {
            return new Promise((resolve, reject) => {

                axios({url: `${endpoints.USER_UPDATE_INFO}/${user.id}`, data: user, method: 'PUT' })
                    .then(resp => {

                        // update local user
                        if(Number(user.id) === Number(state.user.id)) {
                            commit('updateLocalUser', resp.data);
                        }

                        // response user
                        resolve(resp.data);
                    })
                    .catch(err => {
                        reject(err.response);
                    })
            });
        },

        updateUserRole: (ctx, user) => {
            return new Promise((resolve, reject) => {

                axios({url: `${endpoints.USER_UPDATE_ROLE}/${user.id}?role=${user.role}`, method: 'PUT' })
                    .then(resp => {
                        // response user
                        resolve(resp.data);
                    })
                    .catch((err) => {
                        reject(err.response);
                    })
            });
        },

        deleteUser: (ctx, user) => {
            return new Promise((resolve, reject) => {

                axios({url: `${endpoints.USER}/${user.id}?role=${user.role}`, method: 'DELETE' })
                    .then(resp => {
                        resolve(resp);
                    })
                    .catch((err) => {
                        reject(err.response);
                    })
            });
        }
    },
    getters: {
        getUser: (state) => state.user,
    },
}