import axios from "axios";
import { getAuthToken, setAuthToken, setRefreshToken } from "./TokenService";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
// axios.defaults.baseURL = 'https://api.rokhub.shop'
axios.defaults.headers.post['Content-Type'] =  'application/json';

export const isAuthenticated = () => {
    return !!getAuthToken();
};

export const getUserRole = () => {
   return "USER"
}

export const publicRequest = async (method, url, data) => {

    return await axios({
        method: method,
        url: url,
        headers: {},
        data: data
    });
};

export const request = async (method, url, data) => {

    let headers = {};
    const token = getAuthToken();

    if (token && token !== null) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
       console.error("No auth Token To call the API!!")
       return Response;
    }
    
    return await axios({
        method: method,
        url: url,
        headers: headers,
        data: data
    });
};

export const FormDataRequest = async (method, url, formData) => {

    let headers = {};
    headers['Content-Type'] = 'multipart/form-data';

    const token = getAuthToken();

    if (token && token !== null) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
       console.error("No auth Token To call the API!!")
       return null;
    }
    
    return await axios({
        method: method,
        url: url,
        headers: headers,
        data: formData
    });
};