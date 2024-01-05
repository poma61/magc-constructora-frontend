import { useAuth } from "@/stores/useAuth";
const authExpiration = (to,from,next) => {
    useAuth().checkTokenExpiration();
    next();
}

export default authExpiration;