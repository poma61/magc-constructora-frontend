<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" app color="black" class="as-navigation" >
            <div class="d-flex flex-column justify-center align-center">
                <v-list-item :prepend-avatar="require('@/assets/images/logo-empresa.jpeg')" title="MAGC" nav height="50" />
            </div>
            <v-divider class="border-opacity-25"></v-divider>
            <v-list nav>
                <div class="d-flex flex-column justify-center align-center my-2">
                    <v-avatar :image="require('@/assets/images/logo-empresa.jpeg')" size="80"></v-avatar>
                    <p class="text-subtitle-1">Carlos Poma Muñoz</p>
                </div>

                <v-divider class="border-opacity-25 my-2"></v-divider>
                <p class="text-subtitle-1" style="font-weight: bold;">EMPRESA</p>
                <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="Inicio" :to="{ name: 'n-inicio' }" />

                <v-divider class="border-opacity-25 my-2"></v-divider>
                <p class="text-subtitle-1" style="font-weight: bold;">CONSTRUCCIONES</p>
                <v-list-item prepend-icon="mdi-account-group" title="Clientes" value="Clientes" :to="{ name: 'n-cliente' }" />
                <v-list-item prepend-icon="mdi-file-document-outline" title="Contratos" value="Contratos" />
                <v-list-item prepend-icon="mdi-account-credit-card" title="Historial de Pagos" value="Historial Pagos" />

                <v-divider class="border-opacity-25 my-2"></v-divider>
                <p class="text-subtitle-1" style="font-weight: bold;">ADMINISTRACION</p>
                <v-list-item prepend-icon="mdi-home-account" title="Personal" value="Personal" />
                <v-list-item prepend-icon="mdi-account-circle" title="Usuario" value="Usuario"
                    :to="{ name: 'n-usuario' }" />

            </v-list>
        </v-navigation-drawer>
        <AppBar @openByCloseNavigationDrawerEmit="openByCloseNavigationDrawer" />
        <v-main class="ma-2">
            <slot></slot>
        </v-main>
    </v-app>
</template>

<script setup>
import AppBar from '@/layouts/AppBar.vue';
import { ref } from 'vue';
//data
const drawer = ref(true);

//methods
const openByCloseNavigationDrawer = () => {
    drawer.value = !drawer.value;
}
</script>
