<template>
    <v-app id="home">
        <AppBar
            v-bind:drawerState="drawerState"
            v-on:updateDrawerState="updateDrawerState"/>

        <NavDrawer v-bind:drawerState="drawerState"/>

        <MainComponent/>
    </v-app>
</template>

<script>
    import NavDrawer from "../components/NavDrawer";
    import AppBar from "../components/AppBar";
    import MainComponent from "../components/MainComponent";

    export default {
        components: {
            NavDrawer,
            AppBar,
            MainComponent,
        },

        data: () => ({
            drawerState: true,
        }),

        methods: {
            updateDrawerState (drawerState) {
                this.drawerState = drawerState;
            }
        },

        created () {
            this.$vuetify.theme.dark = false
        },
    }
</script>

<style scoped>

</style>