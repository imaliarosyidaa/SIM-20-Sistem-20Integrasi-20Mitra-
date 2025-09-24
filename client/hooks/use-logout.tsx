import axios from "../lib/api";
import useAuth from "./use-auth";

export default function useLogout() {
    const { setAuth } = useAuth();

    async function logout() {
        setAuth(() => ({
            username: '',
            password: '',
            accessToken: ''
        }))
        try {
            const response = await axios.get('/auth/logout', {
                withCredentials: true
            })
        } catch (err) {
            console.log(err)
        }
    }

    return logout
}