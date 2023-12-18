import { useAuth } from '@/stores/useAuth'

const authenticate = (to, from, next) => {
    const store_auth = useAuth();
    const need_auth = to.matched.some(record => record.meta.requireAuth);

    //verifica si es la ruta de login y si esta autenticando redirige directamente a la  pagina principal/home
    if (store_auth.is_auth && to.path == '/') {
        next({ name: 'n-inicio' });
        return;
    }

    if (need_auth) {
        //SI necesita autenticacion
        if (store_auth.is_auth) {
            next();

        } else {
            next({ path: '/' });
        }
    } else {
        // NO necesita autenticacion
        next();
    }
};

export default authenticate;