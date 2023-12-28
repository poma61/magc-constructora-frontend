<template>
    <MainApp>
        <h1 class="animate__animated animate__lightSpeedInLeft text-h6 my-3 pa-1 bg-cyan-darken-1 as-box-shadow">
            <v-icon icon="mdi-account-credit-card"></v-icon>&nbsp;Historial de pagos de clientes
        </h1>
        <MainContentHistorialDePagoCliente/>
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import MainContentHistorialDePagoCliente from '@/components/historial-de-pago-cliente/MainContentHistorialDePagoCliente.vue';
</script>
