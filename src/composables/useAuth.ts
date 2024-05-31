import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export function useAuth() {
     const token = ref<string | null>(localStorage.getItem('authToken'));
     const error = ref<string | null>(null);
     const router = useRouter();

     const validateToken = async () => {
          try {
               const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    headers: {
                         Authorization: `Bearer ${token.value}`
                    }
               });
               if (response.data.meta.message == 'User found') {
                    return true;
               } else {
                    localStorage.removeItem('authToken');
                    router.push('/login');
                    return false;
               }
          } catch (err) {
               console.error(err);
               localStorage.removeItem('authToken');
               router.push('/login');
               return false;
          }
     };

     onMounted(async () => {
          if (token.value) {
               await validateToken();
          } else {
               router.push('/login');
          }
     });


     const login = async (email: string, password: string) => {
          try {
               const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
               token.value = response.data.data.token
               localStorage.setItem('authToken', token.value as string);
               error.value = null;
               router.push('/');
          } catch (err) {
               error.value = 'Login failed. Please check your credentials.';
               console.error(err);
          }
     };

     const logout = () => {
          token.value = null;
          localStorage.removeItem('authToken');
          router.push('/login');
     };

     const isAuthenticated = () => {
          return !!token.value;
     };

     return {
          token,
          error,
          login,
          logout,
          isAuthenticated
     };
}
