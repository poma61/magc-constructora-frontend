import { useAuth } from '@/stores/useAuth';
import useToastify from '@/composables/useToastify';

const checkRole = async (to, from, next, role) => {
    const use_auth = useAuth();
    //si NO esta autenticado aun no se debe verificar el role
    if (use_auth.getAuth().enable == false) {
        next();
        return;
    }

    const response = await use_auth.hasRole();
    if (response.status) {
        // Verifica si el valor de response.role se encuentra en el array role
        if (role.includes(response.record.role)) {
            // El rol está presente en el array, permitir el acceso
            next();
        } else {
            next({ path: 'access-denied' });
        }
    } else {
        useToastify('danger', response.message);
        next({ path: 'access-denied' });
    }
};

export default checkRole;