import { axiosInstance } from "../http";

export const login = async (data) => {
    try {
        const response = await axiosInstance.post('/auth/login', data);

        const accessToken = response.data.accessToken;

        sessionStorage.setItem('token', accessToken);

        return response;
    } catch (error) {
        throw error;
    }
};

export const signUp = async (data) => {
    try {
        const response = await axiosInstance.post('/auth/signup', data);

        return response;
    } catch (error) {
        throw error;
    }
};