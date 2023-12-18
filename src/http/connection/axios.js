import axios from "axios";
import app from "@/config/app";
import { useAuth } from "@/stores/useAuth";
import { ref } from "vue";
const instance = axios.create({
    baseURL: app.BASE_URL + app.PREFIX_URL,
});

instance.interceptors.request.use((config) => {
    const use_auth = useAuth();
    if (use_auth.is_auth) {
        const token = ref(useAuth().access_token);
        config.headers['Authorization'] = `Bearer ${token.value}`;
    }

    return config;
});

export default instance;

