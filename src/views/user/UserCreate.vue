<template>
    <v-card class="elevation-12">

        <v-toolbar color="primary" dark flat>
            <v-list-item>
                <v-list-item-avatar>
                    <v-avatar color="secondary" size="36">
                        <v-icon>mdi-account</v-icon>
                    </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="headline">Create user</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-toolbar>

        <v-card-text>
            <v-form class="mt-4">
                <v-text-field
                        id="username"
                        label="Username"
                        name="username"
                        :rules="[v => !!v || 'Must not be empty']"
                        v-model="user.username"
                        prepend-icon="mdi-rename-box"
                        v-on:keyup="setDefaultState"
                        :disabled="!isAvailableToEdit"
                        required
                        type="text"/>

                <v-text-field
                        id="firstName"
                        label="First name"
                        name="firstName"
                        :rules="[v => !!v || 'Must not be empty']"
                        v-model="user.firstName"
                        prepend-icon="mdi-rename-box"
                        v-on:keyup="setDefaultState"
                        :disabled="!isAvailableToEdit"
                        required
                        type="text"/>

                <v-text-field
                        id="lastName"
                        label="Last name"
                        name="lastName"
                        :rules="[v => !!v || 'Must not be empty']"
                        v-model="user.lastName"
                        prepend-icon="mdi-rename-box"
                        :disabled="!isAvailableToEdit"
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
                        :disabled="!isAvailableToEdit"
                />

                <v-text-field
                        id="password"
                        label="Password"
                        name="password"
                        :rules="[v => !!v || 'Must not be empty']"
                        v-model="user.password"
                        prepend-icon="mdi-account-key"
                        :disabled="!isAvailableToEdit"
                        v-on:keyup="setDefaultState"
                        required
                        type="password"/>
            </v-form>
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
    import {capitalize} from "../../utils/filter";
    import userRoles from "../../utils/constants/userRoles";
    import {mapActions} from "vuex";

    export default {
        name: "UserCreate",

        data() {
            return {
                isAvailableToEdit: true,
                hasError: false,
                isLoadingData: false,
                isSaveSuccessful: false,
                timerToClose: null,

                user: {
                    username: '',
                    firstName: '',
                    lastName: '',
                    password: '',
                    role: ''
                },

                roles: Object.values(userRoles),
            }
        },

        methods: {
            ...mapActions(['createUser']),

            setDefaultState() {
                this.isAvailableToEdit = true;
                this.hasError = false;
                this.isLoadingData = false;
                this.isSaveSuccessful = false;
            },

            setLoadingState() {
                this.isAvailableToEdit = false;
                this.hasError = false;
                this.isLoadingData = true;
                this.isSaveSuccessful = false;
            },

            setErrorState() {
                this.isAvailableToEdit = true;
                this.hasError = true;
                this.isLoadingData = false;
                this.isSaveSuccessful = false;
            },

            setSuccessfulState() {
                this.isAvailableToEdit = false;
                this.hasError = false;
                this.isLoadingData = false;
                this.isSaveSuccessful = true;
            },

            clearAndCloseModal() {
                clearTimeout(this.timerToClose);
                this.$emit('addUserToList');
                this.setDefaultState();
            },

            onClickSave() {
                if(this.isSaveSuccessful) {
                    this.clearAndCloseModal();
                    return;
                }

                this.setLoadingState();

                this.createUser(this.user)
                    .then(() => {
                        this.setSuccessfulState();
                        this.timerToClose = setTimeout(() => {
                            this.clearAndCloseModal();
                        }, 3000);
                    })
                    .catch(e => {
                        this.setErrorState();
                        this.$emit('showError', e.data.message);
                    });
            }
        },

        computed: {
            isDisableSaveBtn() {
                return this.user.username.length === 0 || this.user.firstName.length === 0
                    || this.user.lastName.length === 0 || this.user.password.length === 0
                    || this.user.role.length === 0;
            }
        },

        filters: {
            capitalize: (value) => capitalize(value),
        },
    }
</script>

<style scoped>

</style>