import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://desol-int-be.vercel.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(function (config) {

  config.headers.Authorization = `Bearer ${sessionStorage.getItem('token') ?? ''}`;

  return config;
}, function (error) {

  return Promise.reject(error);
});
