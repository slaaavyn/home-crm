<template>
    <v-main>
        <router-view/>
    </v-main>
</template>

<script>
    import axios from 'axios';

    export default {
        props: {
            source: String,
        },

        data: () => ({
        }),

        methods: {
            request: () => {
                axios({url: '/user', method: 'GET' }).then( resp => {
                    console.log(resp);
                }).catch(e => {
                    console.log(e);
                });

            }
        }
    }
</script>

<style>

</style>