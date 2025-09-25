import axios from 'axios';
const BASE_URL = "https://malowopati.web.bps.go.id/api6"
//const BASE_URL = "http://localhost:3000/api6"

export default axios.create(
    {
        baseURL: BASE_URL,
        withCredentials: true,
    }
);

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
})