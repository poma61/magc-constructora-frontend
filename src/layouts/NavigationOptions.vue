<template>
    <v-app>
        <div style="position: fixed;top:0px; width: 100%;z-index: 999;">
            <v-tabs show-arrows color="light-blue-lighten-1" bg-color="black" class="as-navigation">
                <v-tab :to="{ name: 'n-inicio' }">
                    <v-icon icon="mdi-view-dashboard" />
                    &nbsp;Inicio
                </v-tab>

                <v-tab :to="{ name: 'n-desarrolladora' }">
                    <v-icon icon="mdi-home-group" />
                    &nbsp;Desarrolladoras
                </v-tab>

                <v-tab :to="{ name: 'n-cliente' }">
                    <v-icon icon="mdi-account-group" />
                    &nbsp;Clientes
                </v-tab>

                <v-tab :to="{ name: 'n-contrato-cliente' }">
                    <v-icon icon="mdi-file-document-outline" />
                    &nbsp;Contratos
                </v-tab>

                <v-tab :to="{ name: 'n-transaccion-pago-couta' }">
                    <v-icon icon="mdi-account-credit-card" />
                    &nbsp;Transacciones de pagos
                </v-tab>

                <v-tab :to="{ name: 'n-personal' }">
                    <v-icon icon="mdi-home-account" />
                    &nbsp;Personal
                </v-tab>

                <v-tab :to="{ name: 'n-usuario' }">
                    <v-icon icon="mdi-account-circle" />
                    &nbsp;Usuarios
                </v-tab>

                <v-spacer></v-spacer>
                <!-- Otros elementos del app bar si es necesario -->

                <v-btn icon="mdi-bell-alert-outline" variant="text"
                    class="animate__animated animate__delay-2s animate__infinite animate__headShake"></v-btn>
                <v-menu v-model="menu" location="bottom" class="float-sm-end">

                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text"></v-btn>
                    </template>

                    <v-card min-width="250">
                        <v-list>
                            <v-list-item :prepend-avatar="app.BASE_URL + user.foto"
                                :title="`${user.nombres} ${user.apellido_paterno} ${user.apellido_materno}`">
                                <p class="text-medium-emphasis">Rol: {{ user.rol_name }}</p>
                                <p class="text-medium-emphasis">Desarrolladora: {{ user.desarrolladora }}</p>
                            </v-list-item>
                        </v-list>
                        <v-divider></v-divider>
                        <v-list>
                            <v-list-item :to="{ name: 'n-perfil' }">
                                <v-icon icon="mdi-account" color="success"></v-icon>
                                <span>Perfil</span>
                            </v-list-item>

                            <v-list-item @click="dialog = true">
                                <v-icon icon="mdi-close-circle" color="red"></v-icon>
                                <span>Salir</span>
                            </v-list-item>

                        </v-list>
                    </v-card>
                </v-menu>

            </v-tabs>
        </div>

        <v-main class="as-content-app">
            <slot></slot>
        </v-main>
        <v-dialog v-model="dialog" persistent width="auto">
            <v-card class="pa-5">
                <v-card-text class="text-center">
                    <v-icon icon="mdi-lock-outline" size="100" color="red"
                        class="animate__animated animate__infinite animate__bounce"></v-icon>
                </v-card-text>
                <p class="text-h6 text-center">
                    ¿Esta seguro de salir del sistema?
                </p>
                <div class="d-flex justify-center">
                    <v-btn color="red" variant="tonal" @click="dialog = false" class="ma-1">
                        <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                    </v-btn>
                    <v-btn color="green-darken-1" variant="tonal" class="ma-1" @click="authLogout()">
                        <v-icon icon="mdi-check-circle-outline"></v-icon>&nbsp;Si
                    </v-btn>
                </div>
            </v-card>
        </v-dialog>

        <v-overlay v-model="loading_logout" class="d-flex align-center justify-center">
            <div class="text-center">
                <v-progress-circular color="cyan-darken-1" indeterminate size="100"></v-progress-circular>
                <p class="text-h6 text-white">Cerrando todos los modulos del sistema...</p>
            </div>
        </v-overlay>

    </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/stores/useAuth';
import { useRouter } from 'vue-router';
import useToastify from '@/composables/useToastify';
import { onMounted } from 'vue';
import app from '@/config/app';
//data
const menu = ref(false);
const dialog = ref(false);
const router = useRouter();
const user = ref({
    user: "",
    rol_name: "",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    foto: "",
});
const loading_logout = ref(false);

//methods
const authLogout = () => {
    const use_auth = useAuth();
    dialog.value = false;
    loading_logout.value = true;
    
    setTimeout(async () => {
        const response = await use_auth.logout();
        loading_logout.value = false;
        if (response.status) {
            router.push('/');
        } else {
            useToastify('danger', response.message);
        }
    }, 200);
}


const auth = async () => {
    const auth = useAuth();
    const response = await auth.user();
    if (response.status) {
        user.value = response.record;
    } else {
        useToastify('danger', response.message);
    }
};

onMounted(() => {
    auth();
});
</script>