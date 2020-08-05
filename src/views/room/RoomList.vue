<template>
    <v-container fluid>
        <v-card>
            <v-card tile color="grey lighten-3">
                <v-row align-content="center" justify="center" v-if="isLoading">
                    <v-col class="subtitle-1 text-center" cols="12">
                        Loading rooms
                    </v-col>
                    <v-col cols="6">
                        <v-progress-linear
                                color="secondary accent-4"
                                indeterminate
                                rounded
                                height="6"
                        ></v-progress-linear>
                    </v-col>
                </v-row>

                <v-card-text v-else-if="!isLoading && roomList.length === 0" class="text-lg-h6 text-center">
                    Rooms not created
                </v-card-text>

                <div>
                    <v-slide-group class="pa-4" show-arrows mandatory>
                        <v-slide-item
                                v-for="roomItem in roomList"
                                :key="roomItem.id"
                                v-slot:default="{ active, toggle }">
                            <v-card
                                    :color="active ? 'grey lighten-1' : ''"
                                    class="ma-4"
                                    height="100"
                                    width="180"
                                    @click="onSelectRoomClick(roomItem, toggle)" >

                                <v-card-text>
                                    <p class="text--primary text-center"> {{ roomItem.name }} </p>
                                    <div class="text-center">
                                        {{  roomItem.devices.length === 1 ? 'Device' : 'Devices' }} : {{ roomItem.devices.length }}
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-slide-item>
                    </v-slide-group>

                    <v-fab-transition>
                        <v-btn
                                v-show="isEditModeAvailable"
                                color="accent"
                                @click="onCreateRoomClick"
                                fab
                                dark
                                small
                                absolute
                                bottom
                                right>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-fab-transition>
                </div>

            </v-card>

           <v-row v-if="selectedRoom">
                <v-col cols="12">
                    <br>
                    <v-row justify="center">
                        <span v-if="selectedRoom.devices.length === 0" class="text-lg-h6 text-center">
                            There are no devices in the room
                        </span>
                    </v-row>
                </v-col>
            </v-row>

            <v-card-actions v-show="isEditModeAvailable && selectedRoom">
                <v-spacer/>
                <v-btn color="orange" text @click="onEditRoomClick">
                    Rename
                </v-btn>

                <v-btn color="warning" text @click="deleteDialog = true">
                    Remove
                </v-btn>
            </v-card-actions>
        </v-card>


        <!--create/edit dialog-->
        <v-dialog v-model="editDialog" max-width="500px">
            <edit-room-component
                    v-on:editRoomSuccess="editRoomSuccess"
                    v-on:editRoomFailed="editRoomFailed"
                    :is-modal-open="editDialog"
                    :is-edit-room-mode="isEditRoomDialogMode"
                    :room="selectedRoom" />
        </v-dialog>

        <!--delete dialog-->
        <v-dialog v-model="deleteDialog" max-width="500px">
            <v-card>
                <v-card-title class="justify-center">
                    Are you sure you want to delete  <b class="pa-2">{{ selectedRoom ? selectedRoom.name : ''}}</b> ?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="accent darken-1" text @click="deleteDialog = false">Disagree</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="success darken-1" text @click="onDeleteAgreeClick">Agree</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import EditRoomComponent from "../../components/room/EditRoomComponent";
    import userRoles from "../../utils/constants/userRoles";
    import {mapActions, mapGetters} from "vuex";
    import EventBus from "../../plugins/eventBus";

    export default {
        name: "RoomList",

        components: {
            EditRoomComponent,
        },

        data() {
            return {
                isLoading: false,
                isEditModeAvailable: false,
                editDialog: false,
                deleteDialog: false,
                isEditRoomDialogMode: true,

                roomList: [],
                selectedRoom: null,
            }
        },

        methods: {
            ...mapActions(['fetchAllRooms', 'deleteRoom']),

            onSelectRoomClick(selectedRoom, toggle) {
                if (typeof toggle === 'function') {
                    toggle();
                }

                this.selectedRoom = selectedRoom;
            },

            onEditRoomClick() {
                this.isEditRoomDialogMode = true;
                this.editDialog = true;
            },

            onCreateRoomClick() {
                this.isEditRoomDialogMode = false;
                this.editDialog = true;
            },

            editRoomSuccess() {
                this.editDialog = false;
                this.initRoomList();
            },

            editRoomFailed(e) {
                this.editDialog = false;
                EventBus.emitError(e);
            },

            initRoomList() {
                this.isLoading = true;

                this.fetchAllRooms()
                    .then( roomList => {
                        this.roomList = roomList;
                        if(roomList.length !== 0) {
                            this.onSelectRoomClick(roomList[0]);
                        }
                        this.isLoading = false;
                    }).catch((e) => {
                        this.isLoading = false;
                        EventBus.emitError(e);
                });
            },

            onDeleteAgreeClick() {
                this.deleteRoom(this.selectedRoom)
                    .then(() => {
                        this.deleteDialog = false;
                        this.initRoomList();
                    })
                    .catch(e => {
                        this.deleteDialog = false;
                        EventBus.emitError(e);
                    });
            },
        },

        computed: {
            ...mapGetters(['getUser']),
        },

        created() {
            this.isEditModeAvailable = this.getUser.role === userRoles.ROLE_ADMIN;

            this.initRoomList();
        },
    }
</script>

<style scoped>

</style>