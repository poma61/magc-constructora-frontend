<template>
    <MainApp>
        <h1 class="animate__animated animate__bounceInLeft text-h6 my-3 pa-1 bg-green-accent-4 as-box-shadow">
            <v-icon icon="mdi-home-group"></v-icon>&nbsp;Desarrolladora
        </h1>
        <MainContentDesarrolladora/>
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import MainContentDesarrolladora from '@/components/desarrolladora/MainContentDesarrolladora.vue'
</script>
