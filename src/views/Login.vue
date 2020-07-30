<template>
    <v-main>
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                    <v-card class="elevation-12">

                        <v-toolbar color="primary" dark flat>
                            <v-spacer/>
                            <v-toolbar-title>Authorization</v-toolbar-title>
                            <v-spacer/>
                        </v-toolbar>

                        <v-card-text>
                            <v-form>
                                <v-text-field
                                    label="Username"
                                    name="username"
                                    v-model="username"
                                    v-on:keyup="hasError = false"
                                    prepend-icon="mdi-account"
                                    type="text"/>

                                <v-text-field
                                    id="password"
                                    label="Password"
                                    name="password"
                                    v-model="password"
                                    v-on:keyup="hasError = false"
                                    prepend-icon="mdi-lock"
                                    type="password"/>
                            </v-form>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn :color="hasError ? 'error' : 'primary'"
                               block @click="submit"
                               :disabled="isDisable"
                               :loading='isLoading'
                               :class="{shake: hasError}"
                            >Login</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
    import {mapActions} from "vuex";

    export default {
        data() {
            return {
                username: '',
                password: '',
                isLoading: false,
                hasError: false
            }
        },

        methods: {
            ...mapActions(['authRequest']),

            submit() {
                this.isLoading = true;
                this.hasError = false;

                const userCredentials = {
                    username: this.username,
                    password: this.password
                };

                this.authRequest(userCredentials)
                    .then(() => {
                        this.isLoading = false;
                        this.$router.push('/');
                    })
                    .catch(() => {
                        this.isLoading = false;
                        this.hasError = true;
                    })
            }
        },

        computed: {
            isDisable() {
                return this.username.length === 0 || this.password.length === 0;
            }
        }
    }
</script>

<style scoped>
</style>
