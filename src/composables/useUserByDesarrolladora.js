import useToastify from '@/composables/useToastify';
import axios from '@/http/connection/axios';

//s
const ROLES = ['administrador']

const useUserByDesarrolladora = async () => {
    try {

        const resolve = await axios.post("/user-is-desarrolladora");
        if (resolve.data.status) {
            // Verifica si el valor de response.record.role se encuentra en el array ROLES
            if (ROLES.includes(resolve.data.record.role)) {
                //SI tiene el rol de admistrador habilitamos el v-select
                return {
                    enable: true,
                    desarrolladora: resolve.data.record.desarrolladora
                };
            } else {
                   //si NO tiene el rol de admistrador deshabilitamos el v-select
                return {
                    enable: false,
                    desarrolladora: resolve.data.record.desarrolladora
                };
            }
        } else {
            useToastify('danger',resolve.data.message);
        }
    } catch (error) {
        if (error.response == undefined || error.response.data == undefined) {
            useToastify(error + "");
            console.error(error + "");
            return { disable: false, desarrolladora: "" };
        }
        useToastify('danger',error.response.data.message);
        return { disable: false, desarrolladora: "" };
    }
};

export default useUserByDesarrolladora;