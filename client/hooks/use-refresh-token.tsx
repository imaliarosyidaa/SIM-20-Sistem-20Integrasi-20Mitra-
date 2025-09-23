// use-refresh-token.tsx

import axios from "../lib/api"
import useAuth from "./use-auth"

export default function useRefreshToken() {

    const refresh = async () => {
        try {
            const response = await axios.post('/auth/refresh', {}, {
                withCredentials: true,
            });

            // Log untuk debug. Pastikan ini adalah token baru yang benar.
            console.log('Token baru dari server:', response.data.access_token);
            
            // Kembalikan token baru agar bisa digunakan di interceptor
            return response.data.access_token;

        } catch (error) {
            console.error("Kesalahan saat refresh token:", error.response.data.message);
            return Promise.reject(error);
        }
    }
    return refresh
}