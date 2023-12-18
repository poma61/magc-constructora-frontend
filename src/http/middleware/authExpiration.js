import { useAuth } from "@/stores/useAuth";
const authExpiration = () => {
    useAuth().checkTokenExpiration();
}

export default authExpiration;