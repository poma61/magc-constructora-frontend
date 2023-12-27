<template>
    <MainApp>
        <h1 class="animate__animated animate__bounceInUp text-h6 my-3 pa-1 bg-yellow-darken-2 as-box-shadow">
            <v-icon icon="mdi-home-account"></v-icon>&nbsp;Personal
        </h1>
        <MainContentPersonal/>
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import MainContentPersonal from '@/components/personal/MainContentPersonal.vue';
</script>






