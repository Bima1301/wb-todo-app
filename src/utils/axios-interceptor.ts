import router from '@/router';
import axios from 'axios';
axios.interceptors.request.use(
     (config) => {
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

axios.interceptors.response.use(
     (response) => {
          return response;
     },
     (error) => {
          // Handle token expiration or other global errors here
          if (error.response && error.response.status === 401) {
               // Optionally, you can log out the user or redirect to login page
               localStorage.removeItem('authToken');
               router.push('/login');
          }
          return Promise.reject(error);
     }
);

export default axios;
