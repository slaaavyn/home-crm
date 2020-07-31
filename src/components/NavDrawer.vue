<template>
    <v-navigation-drawer v-model="drawerState" app clipped>

        <!-- HEADER -->
        <v-img
                :aspect-ratio="30/8"
                src="../assets/navBackground.png"
                dark
                gradient="to top right, rgba(50, 50, 50, 0.3), rgba(50, 50, 50, 0.3)">
            <v-list>
                <v-list-item link :to="'/user/' + getUser.id">
                    <v-list-item-avatar>
                        <v-avatar color="secondary" size="36">
                            <v-icon>mdi-account</v-icon>
                        </v-avatar>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ fullName }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-img>

        <v-list dense>
            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-view-dashboard-variant</v-icon>
                </v-list-item-action>
                
                <v-list-item-content>
                    <v-list-item-title>Dashboard</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-home</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                    <v-list-item-title>Rooms</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-robot</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                    <v-list-item-title>Devices</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link :to="'/user'" v-if="getUser.role === ROLE_ADMIN">
                <v-list-item-action>
                    <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                    <v-list-item-title>Users</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item class="mt-4" link @click="logout">
                <v-list-item-action>
                    <v-icon color="grey darken-1">mdi-account-arrow-right</v-icon>
                </v-list-item-action>
                <v-list-item-title class="grey--text text--darken-1">Logout</v-list-item-title>
            </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import userRoles from "../utils/constants/userRoles";

    export default {
        props: {
            drawerState: Boolean,
        },

        data() {
            return {
                ROLE_ADMIN: userRoles.ROLE_ADMIN,
                firstName: '',
                lastName: ''
            }
        },

        computed: {
            ...mapGetters(['getUser']),

            fullName: function () {
                return this.getUser.firstName + ' ' + this.getUser.lastName
            }
        },

        methods: {
            ...mapActions(['authLogout']),

            logout() {
                console.log('logout');
                this.authLogout()
                    .then(() => {
                        this.$router.push('/login');
                    });
            },
        },
    }
</script>