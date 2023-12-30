<template>
    <MainApp>
        <h1 class="animate__animated animate__bounceInLeft text-h6 my-3 pa-1 bg-teal-accent-4 as-box-shadow">
            <v-icon icon="mdi-account-circle"></v-icon>&nbsp;Usuario
        </h1>
        <MainContentUsuario />
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import MainContentUsuario from '@/components/usuario/MainContentUsuario.vue';
</script>
