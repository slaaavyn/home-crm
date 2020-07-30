<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">

                    <v-toolbar color="primary" dark flat>
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-avatar color="secondary" size="36">
                                    <v-icon>mdi-account</v-icon>
                                </v-avatar>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="headline">Profile</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action v-if="isEditModeAvailable">
                                <v-btn icon @click="switchEditMode">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-toolbar>

                    <v-card-text>
                        <v-form>
                            <v-text-field
                                    id="firstName"
                                    label="First name"
                                    name="firstName"
                                    :rules="[v => !!v || 'Must not be empty']"
                                    v-model="user.firstName"
                                    prepend-icon="mdi-rename-box"
                                    v-on:keyup="setDefaultState"
                                    :disabled="!editMode"
                                    required
                                    type="text"/>

                            <v-text-field
                                    id="lastName"
                                    label="Last name"
                                    name="lastName"
                                    :rules="[v => !!v || 'Must not be empty']"
                                    v-model="user.lastName"
                                    prepend-icon="mdi-rename-box"
                                    :disabled="!editMode"
                                    v-on:keyup="setDefaultState"
                                    required
                                    type="text"/>
                            <v-select
                                    prepend-icon="mdi-account-lock"
                                    v-model="user.role"
                                    :items="roles"
                                    :rules="[v => !!v || 'Item is required']"
                                    @click="setDefaultState"
                                    label="Role"
                                    required
                                    :disabled="isEditRoleAvailable"
                            ></v-select>
                        </v-form>
                    </v-card-text>

                    <v-card-actions v-if="editMode">
                        <v-spacer/>
                        <v-btn
                                @click="onClickSave"
                                :color="hasUpdateError && !isUpdateSuccessful ? 'error' : 'primary'"
                                :disabled="isDisabledSaveBtn"
                                :loading="isLoadingData"
                                :class="{shake: hasUpdateError}">
                            <span v-if="!isUpdateSuccessful">Save</span>
                            <v-scroll-x-transition>
                                <v-icon v-if="isUpdateSuccessful">mdi-check</v-icon>
                            </v-scroll-x-transition>
                        </v-btn>
                        <v-spacer/>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!--alert-->
        <v-row justify="center">
            <v-col cols="12" sm="8" md="8">
                <v-scroll-y-transition>
                    <v-alert dismissible type="error" v-if="hasUpdateError" v-model="hasUpdateError">
                        {{ errorMessage | capitalize}}
                    </v-alert>
                </v-scroll-y-transition>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import userRoles from "../utils/constants/userRoles";
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "UserProfile",

        data() {
            return {
                isFetchingData: true,
                isEditModeAvailable: false,
                editMode: false,
                isLoadingData: false,
                isUpdateSuccessful: false,
                hasUpdateError: false,
                errorMessage: '',
                user: {
                    id: 0,
                    firstName: '',
                    lastName: '',
                    role: '',
                },
                oldUser: null,
                roles: Object.values(userRoles)
            }
        },

        methods: {
            ...mapActions(['fetchUserById', 'updateUserInfo', 'updateUserRole']),

            switchEditMode() {
                this.editMode = !this.editMode;
            },

            fetchData() {
                // if router id is id of an authorized user, then load data from local storage and return
                if(Number(this.$route.params.id) === Number(this.getUser.id)) {
                    this.initUser(this.getUser);
                    return;
                }

                // fetch user from backend
                this.fetchUserById(Number(this.$route.params.id))
                    .then(user => {
                        this.initUser(user);
                    })
                    .catch((e) => {
                        console.log(e);
                        this.$router.push(`/user/${this.getUser.id}`)
                    })
            },

            initUser(user) {
                this.user = Object.assign({}, user);
                this.oldUser = Object.assign({}, this.user);
            },

            setDefaultState() {
                this.isLoadingData = false;
                this.hasUpdateError = false;
                this.isUpdateSuccessful = false;
            },

            setSuccessfulState() {
                this.isLoadingData = false;
                this.hasUpdateError = false;
                this.isUpdateSuccessful = true;
            },

            setErrorState(e) {
                this.isLoadingData = false;
                this.hasUpdateError = true;
                this.isUpdateSuccessful = false;
                this.errorMessage = e.data.message || 'Failed';
            },

            setLoadingSate() {
                this.isLoadingData = true;
                this.hasUpdateError = false;
                this.isUpdateSuccessful = false;
            },

            onClickSave() {
                this.setLoadingSate();

                this.updateUserInfo(this.user)
                    .then(async updatedUser => {

                        if(this.user.role !== updatedUser.role) {
                            updatedUser = await this.updateUserRole(this.user);
                        }

                        this.setSuccessfulState();
                        this.initUser(updatedUser);
                    })
                    .catch(e => {
                        this.setErrorState(e);
                        console.log(e);
                    });
            },
        },

        computed: {
            ...mapGetters(['getUser']),

            isEditRoleAvailable() {
                return !this.editMode || this.getUser.role !== userRoles.ROLE_ADMIN;
            },

            // save button disabled when input fields are not changed
            isDisabledSaveBtn() {
                return this.user.firstName.length === 0 || this.user.lastName.length === 0 ||
                    (this.oldUser.firstName === this.user.firstName
                    && this.oldUser.lastName === this.user.lastName
                    && this.oldUser.role === this.user.role);
            }
        },

        created() {
            this.isEditModeAvailable = Number(this.$route.params.id) === Number(this.getUser.id)
                || this.getUser.role === userRoles.ROLE_ADMIN;

            this.fetchData();
        },

        watch: {
            $route: 'fetchData',
        },

        filters: {
            capitalize: function (value) {
                if (!value) return ''
                value = value.toString()
                return value.charAt(0).toUpperCase() + value.slice(1)
            }
        },
    }
</script>

<style scoped>
</style>