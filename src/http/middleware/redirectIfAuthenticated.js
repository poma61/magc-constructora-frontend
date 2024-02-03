import { useAuth } from '@/stores/useAuth';

const redirectIfAuthenticated = (to, from, next) => {
    const use_auth = useAuth();
    // Si es la ruta de inicio y el usuario está autenticando, redirige a la página principal/home
    if (use_auth.getAuth().state && to.path == '/') {
        next({ name: 'n-inicio' });
    } else {
        next();
    }
}

export default redirectIfAuthenticated ;

