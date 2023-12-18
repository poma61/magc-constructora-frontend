<template>
    <MainApp>
        <h1 class="animate__animated animate__bounceInLeft text-h6 my-3 pa-1 bg-cyan-darken-1 as-box-shadow">
            <v-icon icon="mdi-file-document-outline"></v-icon>&nbsp;Panel de Contratos
        </h1>
        <MainContentContrato />
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import MainContentContrato from '@/components/contrato/MainContentContrato.vue'
</script>
