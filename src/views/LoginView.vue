<template>
    <div class="as-content-login">
        <div class="animate__animated animate__flipInY as-main-login">
            <h1
                class="text-h5 my-3 pa-5 bg-orange-darken-2 text-center as-box-shadow-elevated">
                Inicio de Sesion
            </h1>
            <v-card class="as-login" elevation="24">
                <v-img :src="require('@/assets/images/logo-empresa.jpeg')" />

                <v-form @submit.prevent="login" class="pa-3">
                    <v-text-field v-model="user" :readonly="loading" class="mb-2" clearable label="Usuario"
                        placeholder="Escriba su usuario..." color="blue-darken-3"></v-text-field>

                    <v-text-field v-model="password" :readonly="loading" label="Password"
                        placeholder="Escriba su contraseña..." color="blue-darken-3"
                        :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'"
                        autocomplete="off" @click:append-inner="show = !show"></v-text-field>

                    <v-btn :loading="loading" block color="blue-darken-3" size="large" type="submit" variant="elevated">
                        Ingresar
                    </v-btn>
                </v-form>
            </v-card>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/useAuth';
import useToastify from '@/composables/useToastify';
//data
const user = ref("");
const password = ref("");
const loading = ref(false);
const router = useRouter();
const show = ref(false);
//methods 
const login = () => {
    loading.value = true;

    setTimeout(async () => {
        const auth = useAuth();
        const auth_success = await auth.login(user.value, password.value)
        if (auth_success.status) {
            router.push("/inicio");
            useToastify('info', auth_success.message);
        } else {
            useToastify('danger', auth_success.message);
        }
        loading.value = false;

    }, 200);
}
</script>

<style scoped>
.as-content-login {
    min-height: 100vh;
    background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url(@/assets/images/login-background.jpeg);
    background-size: cover;
    overflow: hidden !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.as-login {
    background-color: rgba(255, 255, 255, 0.699);
}

.as-main-login {
    width: 500px;
}

/* Para dispositivos con un ancho de pantalla máximo de 800px */
@media only screen and (max-width: 800px) {
    .as-main-login {
        width: 400px;
    }
}

/* Para dispositivos con un ancho de pantalla máximo de 600px */
@media only screen and (max-width: 600px) {
    .as-main-login {
        width: 300px;
    }
}
</style>
