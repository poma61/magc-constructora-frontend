<template>
    <MainApp>
        <v-card class="mt-5" elevation="24">
            <v-card-text>
                <div class="as-content-access-denied">
                    <h1 class="text-h4 text-center">
                        ACCESO  DENEGADO, ROL NO AUTORIZADO.
                    </h1>
                    <img :src="require('@/assets/images/page.png')" width="400" height="400px"/>
                </div>
            </v-card-text>
        </v-card>
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';

</script>

<style scoped>
.as-content-access-denied {
    display: flex;
    width: 100%;
    min-height: 80vh;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap:10px;
}


.as-content-access-denied h1{
  line-height: 1;
}


</style>