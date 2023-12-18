<template>
    <v-app-bar  app color="light-blue-darken-3" height="50" :elevation="10">

        <v-app-bar-nav-icon @click.stop="openByCloseNavigationDrawerChild"></v-app-bar-nav-icon>
        <v-toolbar-title>Sistema Magc</v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- Otros elementos del app bar si es necesario -->

        <v-btn icon="mdi-cog"></v-btn>
        <v-btn icon="mdi-bell-alert-outline" class="animate__animated animate__delay-2s animate__infinite animate__headShake"></v-btn>
        <v-menu v-model="menu" :close-on-content-click="false" location="bottom" class="float-sm-end">

            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-dots-vertical"></v-btn>
            </template>

            <v-card min-width="250">
                <v-list>
                    <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg" title="Carlos poma muñoz"
                        subtitle="Administrador">
                    </v-list-item>
                </v-list>

                <v-list>
                    <v-list-item link to="">
                        <v-icon icon="mdi-account"></v-icon>
                        <span>Perfil</span>
                    </v-list-item>

                    <v-list-item @click="dialog = true">
                        <v-icon icon="mdi-close-box"></v-icon>
                        <span>Salir</span>
                    </v-list-item>
                    
                </v-list>
            </v-card>
        </v-menu>
    </v-app-bar>

    <v-dialog v-model="dialog" persistent width="auto">
        <v-card class="px-5 py-5">
            <v-card-text class="text-center">
                <v-icon icon="mdi-lock-alert-outline" size="100" color="red" class="animate__animated animate__infinite animate__bounce"></v-icon>
            </v-card-text>
            <p class="text-h6 text-center">
                ¿Esta seguro de salir del sistema?
            </p>

            <div class="d-flex justify-center">
                <v-btn color="red" variant="tonal" @click="dialog = false" class="ma-1">
                    <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                </v-btn>
                <v-btn color="green-darken-1" variant="tonal" class="ma-1" @click="authLogout()">
                    <v-icon icon="mdi-check-circle-outline"></v-icon>&nbsp;Aceptar
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import { useAuth } from '@/stores/useAuth';
import { useRouter } from 'vue-router';
import useToastify from '@/composables/useToastify';
//data
const emit = defineEmits(['openByCloseNavigationDrawerEmit']);
const menu = ref(false);
const dialog = ref(false);
const router = useRouter();

const openByCloseNavigationDrawerChild = () => {
    emit('openByCloseNavigationDrawerEmit');
}

const authLogout = async () => {
    const use_auth = useAuth();
    const response = await use_auth.logout();
    if (response.status) {
        router.push('/');
    } else {
        useToastify('danger', response.message);
    }
    dialog.value = false;
}

</script>