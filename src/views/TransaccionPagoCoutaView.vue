<template>
    <MainApp>
        <h1 class="animate__animated animate__lightSpeedInLeft text-h6 my-3 pa-1 bg-cyan-darken-1 as-box-shadow">
            <v-icon icon="mdi-account-credit-card"></v-icon>&nbsp;Panel de transacciones de pago de coutas
        </h1>
        <ListCliente />
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import ListCliente from '@/components/transaccion-pago-couta/ListCliente.vue';
</script>
