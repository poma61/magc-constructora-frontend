import { defineStore } from "pinia";
import axios from "@/http/connection/axios"

export const useAuth = defineStore('useAuth', {
    state: () => {
        const auth = {
            state: false,
            access_token: "",
            time_expiration_token: 0,
            type_token: "",
            role: ""
        };
        if (localStorage.getItem('sessionAuth') == null || localStorage.getItem('sessionAuth') == undefined) {
            localStorage.setItem('sessionAuth', JSON.stringify(auth));
        }
        return {
            auth,
        }
    },
    actions: {
        setAuth(is_auth) {
            this.auth.state = is_auth.state;
            this.auth.access_token = is_auth.access_token;
            this.auth.time_expiration_token = is_auth.time_expiration_token;
            this.auth.type_token = is_auth.type_token;
            this.auth.role = is_auth.role;

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
                        state: true,
                        access_token: resolve.data.session_auth.access_token,
                        time_expiration_token: Date.now() + Number(resolve.data.session_auth.time_expiration_token * 60) * 1000,//convertimos de minutos, segundos a milisegundos
                        type_token: resolve.data.session_auth.type_token,
                        role: resolve.data.session_auth.role,
                    });
                }
                return resolve.data;
            } catch (error) {
                if (error.response.data == undefined || error.response == undefined) {
                    console.error(error);
                    return {
                        status: false,
                        message: error + "",
                    }
                }
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


        hasRole(roles) {
            // Verifica si el valor de getAuth().role se encuentra en el array roles
            //devuelve true si el valor getAuth().role esta en el array roles;
            return roles.includes(this.getAuth().role);
        },

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
                        state: false,
                        access_token: "",
                        time_expiration_token: 0,
                        type_token: "",
                        role: ""
                    });
                }
                return response.data;

            } catch (error) {
                return error.response.data;
            }
        },
        checkTokenExpiration() {
            if (this.getAuth().enable && Date.now() >= this.getAuth().time_expiration_token) {
                this.setAuth({
                    state: false,
                    access_token: "",
                    time_expiration_token: 0,
                    type_token: "",
                    role: ""
                });
            }
        },

    },

});
