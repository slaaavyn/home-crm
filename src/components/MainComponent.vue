<template>
    <v-main>
        <router-view/>

        <!--Error alert-->
        <v-snackbar dark color="error" v-model="isShowErrorBar">
            <v-app-bar-nav-icon>
                <v-icon>mdi-alert</v-icon>
            </v-app-bar-nav-icon>

            {{ errorMessage | capitalize }}

            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="isShowErrorBar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-main>
</template>

<script>
    import EventBus from "../plugins/eventBus";
    import {capitalize} from "../utils/filter";

    export default {
        props: {
            source: String,
        },

        data() {
            return {
                isShowErrorBar: false,
                errorMessage: '',
            }
        },

        methods: {
            showError(errorMessage) {
                this.errorMessage = errorMessage;
                this.isShowErrorBar = true;
            },
        },

        filters: {
            capitalize: (value) => capitalize(value),
        },

        created() {
            EventBus.$on('showError', (errorMessage) => {
                this.showError(errorMessage);
            })
        },
    }
</script>

<style>

</style>