import { useAuth } from '@/stores/useAuth';

const authenticate = (to, from, next) => {
    const use_auth = useAuth();
    const need_auth = to.matched.some(record => record.meta.requireAuth);

    if (need_auth) {
        //SI necesita autenticacion
        if (use_auth.getAuth().state) {
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