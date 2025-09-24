import axios from "../lib/api"
import useAuth from "./use-auth";

export default function useRefreshToken() {
    const { auth, setAuth } = useAuth();
    
    const refresh = async () => {
        try {
            const response = await axios.post('/auth/refresh', {}, {
                withCredentials: true,
            });

            setAuth(prev => {
                return { ...prev, accessToken: response.data.access_token };
            });
            return response.data.access_token;

        } catch (error) {
            console.error("Kesalahan saat refresh token:", error.response.data.message);
            return Promise.reject(error);
        }
    }
    return refresh
}