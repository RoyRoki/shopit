const JWT_Token = 'auth_token';
const Refresh_Token = 'refresh_token';

export const getAuthToken = () => {
    return  window.localStorage.getItem(JWT_Token);
};

export const setAuthToken = (token) => {
    if(token !== null) {
        window.localStorage.setItem(JWT_Token, token);
    } else {
        window.localStorage.removeItem(JWT_Token);
    }
};

export const setRefreshToken = (rToken) => {
    if(rToken !== null) {
        window.localStorage.setItem(Refresh_Token, rToken);
    } else {
        window.localStorage.removeItem();
    }
};