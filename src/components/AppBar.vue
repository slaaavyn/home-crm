<template>
    <v-app-bar app dark clipped-left color="teal" dense >
        <v-app-bar-nav-icon @click.stop="$emit('updateDrawerState', localDrawerState = !localDrawerState)"></v-app-bar-nav-icon>
      
        <v-avatar size="36" class="mx-4">
            <img src="../assets/logo.png">
        </v-avatar>

        <v-toolbar-title class="mr-12 align-center">
            <span class="title">Smart Home</span>
        </v-toolbar-title>

        <v-spacer></v-spacer>

    </v-app-bar>
</template>

<script>
export default {
    props: {
        drawerState: Boolean,
    },

    data() {
      return {
        localDrawerState: this.drawerState
      }
    },
}
</script>

<style>

</style>