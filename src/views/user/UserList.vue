<template>
    <v-container fluid>
        <v-data-table
                :headers="headers"
                :items="userList"
                :loading="isLoadingData"
                loading-text="Loading... Please wait"
                sort-by="id"
                class="elevation-1"
        >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-list-item>
                        <v-list-item-avatar>
                            <v-icon>mdi-account-multiple</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title class="headline">User list</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="onCreateBtnClick">
                        <v-icon left>mdi-account-plus</v-icon>
                        CREATE
                    </v-btn>
                </v-toolbar>
            </template>

            <template v-slot:item.role="{ item }">
                {{ item.role | roleFilter}}
            </template>

            <template v-slot:item.actions="{ item }">
                <v-btn icon @click="onIEditItemClick(item)">
                    <v-icon> mdi-account-edit </v-icon>
                </v-btn>

                <v-btn icon @click="onDeleteItemActionClick(item)">
                    <v-icon> mdi-account-remove </v-icon>
                </v-btn>
            </template>

            <template v-slot:no-data>
                <v-btn color="primary" @click="fetchData">Update</v-btn>
            </template>
        </v-data-table>

        <v-dialog v-model="createDialog" max-width="500px">
            <UserCreate v-on:addUserToList="addUserToList" v-on:showError="showError"/>
        </v-dialog>

        <v-dialog v-model="deleteDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">
                    Are you sure you want to delete <b>{{ `${selectedUser.firstName} ${selectedUser.lastName}` }}</b> ?
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

        <!--alert-->
        <v-snackbar
                dark
                color="error"
                v-model="isShowErrorBar">

                <v-app-bar-nav-icon>
                    <v-icon>mdi-alert</v-icon>
                </v-app-bar-nav-icon>

                {{ errorMessage | capitalize }}

            <template v-slot:action="{ attrs }">
                <v-btn
                        text
                        v-bind="attrs"
                        @click="isShowErrorBar = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script>
    import UserCreate from "./UserCreate";
    import {capitalize, roleFilter} from '../../utils/filter';
    import {mapActions} from "vuex";

    export default {
        components: {
            UserCreate
        },

        data: () => ({
            isLoadingData: false,
            deleteDialog: false,
            createDialog: false,
            isShowErrorBar: false,
            errorMessage: '',
            selectedUser: {},

            headers: [
                { text: 'Id', value: 'id', align: 'center'},
                { text: 'First name', value: 'firstName' },
                { text: 'Last name', value: 'lastName' },
                { text: 'Role', value: 'role' },
                { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
            ],
            userList: [],
        }),

        computed: {
        },

        watch: {
        },

        created () {
            this.fetchData()
        },

        methods: {
            ...mapActions(['fetchAllUsers', 'deleteUser']),

            addUserToList() {
                this.fetchData();
                this.createDialog = false;
            },

            showError(message) {
                this.errorMessage = message;
                this.isShowErrorBar = true;
            },

            fetchData () {
                this.isLoadingData = true;

                this.fetchAllUsers()
                    .then((userList) => {
                        this.userList = userList;
                        this.isLoadingData = false;
                    })
                    .catch(e => {
                        this.userList = []
                        this.isLoadingData = false;
                        console.log(e);
                    });
            },

            onCreateBtnClick() {
                this.createDialog = true;
            },

            onIEditItemClick (item) {
                this.$router.push('/user/' + item.id);
            },

            onDeleteItemActionClick (item) {
                this.deleteDialog = true;
                this.selectedUser = item;
            },

            onDeleteAgreeClick() {
                this.deleteUser(this.selectedUser)
                    .then(() => {
                        this.deleteDialog = false;
                        this.fetchData();
                    })
                    .catch(e => {
                        this.deleteDialog = false;
                        this.showError(e.data.message);
                        console.log(e);
                    });
            }
        },

        filters: {
            roleFilter: (role) => roleFilter(role),
            capitalize: (value) => capitalize(value),
        },
    }

</script>

<style scoped>

</style>