
<template>
    <MainApp>
        <v-card class="mt-5" elevation="24">
            <v-card-text>
                <div class="as-content-not-found">
                    <h1 class="text-h4 text-center">
                        LA URL NO EXISTE
                    </h1>
                    <img :src="require('@/assets/images/page.png')" width="400" height="400"/>
                </div>
            </v-card-text>

        </v-card>
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';

</script>

<style scoped>
.as-content-not-found{
    display: flex;
    width: 100%;
    height: 80vh;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>
