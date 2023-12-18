<template>
    <MainApp>
        <h1 class="animate__animated animate__bounceInLeft text-h6 my-3 pa-1 bg-purple-darken-1 as-box-shadow">
            <v-icon icon="mdi-account-group"></v-icon>&nbsp;Clientes
        </h1>
        <MainContentCliente/>
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import MainContentCliente from '@/components/cliente/MainContentCliente.vue'
</script>
