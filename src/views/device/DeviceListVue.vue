<template>
    <v-container fluid>
        <v-data-iterator
                :items="getDeviceList"
                :search="search"
                :sort-desc="true"
                :loading="isLoadingData"
                class="elevation-1"
                row
                wrap>

            <template v-slot:header>
                <v-toolbar flat color="white">
                    <v-list-item>
                        <v-list-item-avatar>
                            <v-icon>mdi-robot</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Device list</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>

            <template v-slot:loading>
                <v-row align-content="center" justify="center">
                    <v-col class="subtitle-1 text-center" cols="12">
                        Loading... Please wait
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
            </template>

            <template v-slot:no-data>
                <v-row align-content="center" justify="center">
                    <v-col class="subtitle-1 text-center" cols="12">
                        Devices not created
                    </v-col>
                </v-row>
            </template>

            <template v-slot:default="props">
                <v-row class="px-4">
                    <v-col
                            v-for="item in props.items"
                            :key="item.id"
                            cols="12"
                            sm="6"
                            md="3"
                            lg="3"
                    >
                    <v-card>
                        <v-row no-gutters @click="props.select(item, !props.isSelected(item))">
                            <v-col cols="11">
                                <v-list-item>
                                    <v-list-item-avatar>
                                        <v-icon>mdi-robot</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ item.description || 'Description not set'}}
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{ item.roomName || 'Room is not assigned' }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                            <v-col cols="1">
                                <div class="dot ma-2 float-right elevation-1"
                                     v-bind:style="{background: item.online ? 'green': 'gray'}"/>
                            </v-col>
                        </v-row>

                        <v-divider v-if="props.isSelected(item)" />

                        <v-row v-if="props.isSelected(item)">
                            <v-col>
                                <v-list dense>
                                    <v-list-item>
                                        <v-list-item-content>Calories:</v-list-item-content>
                                        <v-list-item-content class="align-end">{{ '' }}</v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-content>Fat:</v-list-item-content>
                                        <v-list-item-content class="align-end">{{ '' }}</v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>

                        <v-card-actions v-show="isEditModeAvailable && props.isSelected(item)">
                            <v-spacer/>
                            <v-btn color="orange" text>
                                Rename
                            </v-btn>

                            <v-btn color="warning" text>
                                Remove
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                    </v-col>
                </v-row>
            </template>
        </v-data-iterator>
    </v-container>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import EventBus from "../../plugins/eventBus";
    import userRoles from "../../utils/constants/userRoles";

    export default {
        name: "DeviceListVue",

        data() {
            return {
                isLoadingData: false,
                isEditModeAvailable: false,
                search: '',
            }
        },

        methods: {
            ...mapActions(['fetchDevices']),

            fetchData() {
                this.isLoadingData = true;

                this.fetchDevices()
                    .then(() => {
                        this.isLoadingData = false;
                    }).catch((e) => {
                    this.isLoadingData = false;
                    EventBus.emitError(e);
                });
            },
        },

        computed: {
            ...mapGetters(['getUser', 'getDeviceList']),
        },

        created() {
            this.isEditModeAvailable = this.getUser.role === userRoles.ROLE_ADMIN;

            this.fetchData();
        }
    }
</script>

<style scoped>
    .list-item {
        display: inline-block;
        margin-right: 10px;
    }
    .list-enter-active, .list-leave-active {
        transition: all 1s;
    }
    .list-enter, .list-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

    .dot {
        height: 0.7rem;
        width: 0.7rem;
        /*background-color: #bbb;*/
        border-radius: 50%;
        display: inline-block;
    }
</style>