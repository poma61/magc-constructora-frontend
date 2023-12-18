import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "@/http/connection/axios"
import jwt from "@/config/jwt";
export const useAuth = defineStore('useAuth', {
    state: () => {
        return {
            is_auth: ref(false),
            access_token: ref(""),
            token_expiration_time: ref(0),
            prefix:  "/auth",
        }
    },
    actions: {
        async login(is_user, is_password) {
            try {
                const resolve = await axios.post(this.prefix + "/login", {
                    user: is_user,
                    password: is_password,
                });
                if (resolve.data.status == true) {
                    this.toAuth({
                        is_auth: true,
                        access_token: resolve.data.access_token,
                        token_expiration_time: Date.now() + Number(jwt.JWT_TTL * 60) * 1000,//convertimos de minutos, segundos a milisegundos 
                    });
                }

                return resolve.data;
            } catch (error) {
                return error.response.data;
            }
        },//loginUser

        async user() {
            try {
                const resolve = await axios.post(this.prefix + "/me");
                return resolve.data;
            } catch (error) {
                console.log("ACCESO NO AUTORIZADO, DEBE INICIAR SESION");
                return error.response.data.status;
            }

        },//user
        async logout() {
            try {
                const response = await axios.post(this.prefix + "/logout");

                if (response.data.status) {
                    this.toAuth();
                }
                return response.data;

            } catch (error) {
                return error.response.data;
            }

        },
        checkTokenExpiration() {
            if (Date.now() >= this.token_expiration_time) {
                this.toAuth();
            }

        },
        toAuth(auth) {
            if (auth == undefined) {
                this.is_auth = false;
                this.access_token = "";
                this.token_expiration_time = 0;
            } else {
                this.is_auth = auth.is_auth;
                this.access_token = auth.access_token;
                this.token_expiration_time = auth.token_expiration_time;
            }
        }
    },
    persist: {
        storage: sessionStorage,
        paths: ['is_auth', 'access_token', 'token_expiration_time']
    },

});
