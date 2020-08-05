<template>
    <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
            <v-list-item>
                <v-list-item-avatar>
                    <v-avatar color="secondary" size="36">
                        <v-icon>mdi-home</v-icon>
                    </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="headline">{{ isEditRoomMode ? 'Edit' : 'Create' }} room</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-toolbar>

        <v-card-text class="mt-4">
            <v-text-field label="Room name" v-model="editableRoomName"/>
        </v-card-text>

        <v-card-actions>
            <v-spacer/>
             <v-btn
                     @click="onClickSave"
                     :color="hasError && !isSaveSuccessful ? 'error' : 'primary'"
                     :disabled="isDisableSaveBtn"
                     :loading="isLoadingData"
                     :class="{shake: hasError}">
                 <span v-if="!isSaveSuccessful">Save</span>
                 <v-scroll-x-transition>
                     <v-icon v-if="isSaveSuccessful">mdi-check</v-icon>
                 </v-scroll-x-transition>
             </v-btn>
            <v-spacer/>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {mapActions} from "vuex";

    export default {
        name: "EditRoomDialogComponent",

        props: {
            isModalOpen: Boolean,
            isEditRoomMode: Boolean,
            room: Object
        },

        data() {
            return {
                hasError: false,
                isLoadingData: false,
                isSaveSuccessful: false,
                timerToClose: null,
                editableRoomName: this.isEditRoomMode && this.room ? Object.assign({}, this.room).name : '',
            }
        },

        methods: {
            ...mapActions(['createRoom', 'updateRoomName']),

            setDefaultState() {
                this.hasError = false;
                this.isLoadingData = false;
                this.isSaveSuccessful = false;
                this.editableRoomName = '';
            },

            setErrorState() {
                this.hasError = true;
                this.isLoadingData = false;
                this.isSaveSuccessful = false;
            },

            setSuccessState() {
                this.hasError = false;
                this.isLoadingData = false;
                this.isSaveSuccessful = true;
            },

            setLoadingState() {
                this.hasError = false;
                this.isLoadingData = true;
                this.isSaveSuccessful = false;
            },

            getRequestAction() {
                if(this.isEditRoomMode && this.room) {
                    const editableRoomObj = Object.assign({}, this.room);
                    editableRoomObj.name = this.editableRoomName;

                    return this.updateRoomName(editableRoomObj);
                }

                return this.createRoom(this.editableRoomName);
            },

            onClickSave() {
                if(this.isSaveSuccessful) {
                    clearTimeout(this.timerToClose);
                    this.$emit('editRoomSuccess');
                    return;
                }

                this.setLoadingState();

                this.getRequestAction()
                   .then(() => {
                       this.setSuccessState();
                       this.timerToClose = setTimeout(() => {
                           this.$emit('editRoomSuccess');
                       }, 3000);
                   })
                   .catch((e) => {
                       this.setErrorState();
                       this.$emit('editRoomFailed', e);
                   });
            }
        },

        computed: {
            isDisableSaveBtn() {
                return this.editableRoomName.length === 0;
            },
        },

        watch: {
            isModalOpen: {
                handler: function (isOpen) {
                    if(isOpen) {
                        this.editableRoomName =
                            this.isEditRoomMode && this.room ? Object.assign({}, this.room).name : '';
                    } else {
                        this.setDefaultState();
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>