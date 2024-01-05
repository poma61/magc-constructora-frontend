import { defineStore } from "pinia";
import axios from "@/http/connection/axios"

export const useAuth = defineStore('useAuth', {
    state: () => {
        const auth = {
            enable: false,
            access_token: "",
            token_expiration_time: 0,
        };
        if (localStorage.getItem('sessionAuth') == null || localStorage.getItem('sessionAuth') == undefined) {
            localStorage.setItem('sessionAuth', JSON.stringify(auth));
        }
        return {
            auth,
        }
    },
    actions: {
        setAuth(auth) {
            this.auth.enable = auth.enable;
            this.auth.access_token = auth.access_token;
            this.auth.token_expiration_time = auth.token_expiration_time;
            localStorage.setItem('sessionAuth', JSON.stringify(this.auth));
        },
        getAuth() {
            return JSON.parse(localStorage.getItem('sessionAuth'));
        },

        async login(is_user, is_password) {
            try {
                const resolve = await axios.post("/auth/login", {
                    user: is_user,
                    password: is_password,
                });
                if (resolve.data.status == true) {
                    this.setAuth({
                        enable: true,
                        access_token: resolve.data.access_token,
                        token_expiration_time: Date.now() + Number(resolve.data.expires_in * 60) * 1000,//convertimos de minutos, segundos a milisegundos 
                    });
                }
                return resolve.data;
            } catch (error) {
                return error.response.data;
            }
        },//loginUser

        async user() {
            try {
                const resolve = await axios.post("/auth/me");
                return resolve.data;
            } catch (error) {
                return error.response.data;
            }
        },//user

        async hasRole() {
            try {
                const resolve = await axios.post("/auth/verify-role");
                return resolve.data;
            } catch (error) {
                return error.response.data;
            }
        },//user

        async updateCredentials(credentials) {
            try {
                const response = await axios.post("/auth/actualizar-credenciales", {
                    ...credentials,
                });
                return response.data;

            } catch (error) {
                return error.response.data;
            }
        },

        async logout() {
            try {
                const response = await axios.post("/auth/logout");
                if (response.data.status) {
                    this.setAuth({
                        enable: false,
                        access_token: "",
                        token_expiration_time: 0,
                    });
                }
                return response.data;

            } catch (error) {
                return error.response.data;
            }
        },
        checkTokenExpiration() {
            if (this.getAuth().enable && Date.now() >= this.getAuth().token_expiration_time) {
                this.setAuth({
                    enable: false,
                    access_token: "",
                    token_expiration_time: 0,
                });
            }
        },

    },

});
