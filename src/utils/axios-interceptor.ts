import router from "@/router";
import axios, { type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL,
     headers: {
          'Content-Type': 'application/json',
     },
})

api.interceptors.request.use(
     (config: InternalAxiosRequestConfig) => {
          const token = localStorage.getItem('authToken');
          if (token) {
               config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
     },
     (error) => {
          return Promise.reject(error);
     }
);

api.interceptors.response.use(
     (response) => {
          return response;
     },
     (error) => {
          if (error.response && error.response.status === 401) {
               localStorage.removeItem('authToken');
          }
          return Promise.reject(error);
     }
);

export default api;
