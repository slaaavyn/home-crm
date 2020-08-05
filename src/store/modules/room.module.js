import axios from "axios";
import endpoints from "../../utils/constants/endpoints";

export default {
    state: {},

    mutations: {},

    actions: {
        fetchAllRooms: () => {
            return new Promise((resolve, reject) => {
                axios({url: endpoints.ROOM, method: 'GET' })
                    .then(resp => {
                        // response is array of room
                        resolve(resp.data);
                    })
                    .catch(error => reject(error.response));
            });
        },

        createRoom: (ctx, roomName) => {
            return new Promise((resolve, reject) => {
                axios({url: `${endpoints.ROOM}?roomName=${roomName}`, method: 'POST' })
                    .then(resp => {
                        // response room
                        resolve(resp.data);
                    })
                    .catch(error => reject(error.response));
            });
        },

        updateRoomName: (ctx, room) => {
            return new Promise((resolve, reject) => {
                axios({url: `${endpoints.ROOM}/${room.id}?roomName=${room.name}`, method: 'PUT' })
                    .then(resp => {
                        // response room
                        resolve(resp);
                    })
                    .catch(error => reject(error.response));
            });
        },

        deleteRoom: (ctx, room) => {
            return new Promise((resolve, reject) => {
                axios({url: `${endpoints.ROOM}/${room.id}`, method: 'DELETE' })
                    .then(resp => {
                        resolve(resp);
                    })
                    .catch(error => reject(error.response));
            });
        },
    },

    getters: {},
}