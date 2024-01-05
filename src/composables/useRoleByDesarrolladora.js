import { useAuth } from '@/stores/useAuth';
import useToastify from '@/composables/useToastify';

const role = ['administrador']

const useRoleByDesarrolladora = async () => {
    const use_auth = useAuth();

    const response = await use_auth.hasRole();
    if (response.status) {
        // Verifica si el valor de response.record.role se encuentra en el array role
        if (role.includes(response.record.role)) {
            //si tiene el rol de admistrador entonces enviamos un false para NO desabilitar el readonly de los v-select
            return {
                disable: false,
                desarrolladora: response.record.desarrolladora
            };
        } else {
            //si NO tiene el rol de admistrador entonces enviamos un true para SI desabilitar el readonly de los v-select
            return {
                disable: true,
                desarrolladora: response.record.desarrolladora
            };
        }
    } else {
        useToastify('danger', response.message);
    }
};

export default useRoleByDesarrolladora;