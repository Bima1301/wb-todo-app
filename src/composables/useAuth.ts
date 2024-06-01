import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/axios-interceptor';

export function useAuth() {
     const token = ref<string | null>(localStorage.getItem('authToken'));
     const currentUser = ref<any>(null);
     const error = ref<string | null>(null);
     const router = useRouter();

     const validateToken = async () => {
          try {
               const response = await api.get(`/auth/me`, {
                    headers: {
                         Authorization: `Bearer ${token.value}`
                    }
               });
               if (response.data.meta.message == 'User found') {
                    currentUser.value = response.data.data;
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
               if (router.currentRoute.value.path != '/login' && router.currentRoute.value.path != '/register') {
                    router.push('/login');
               }
          }
     });


     const login = async (email: string, password: string) => {
          const response = await api.post(`/auth/login`, { email, password });
          token.value = response.data.data.token
          localStorage.setItem('authToken', token.value as string);
          console.log('login', response.data.data);
          currentUser.value = response.data.data.user;
     };

     const register = async (name: string, email: string, password: string) => {
          const response = await api.post(`/auth/signup`, { name, email, password });
          token.value = response.data.data.token
          localStorage.setItem('authToken', token.value as string);
          currentUser.value = response.data.data;
     }

     const logout = () => {
          token.value = null;
          currentUser.value = null;
          localStorage.removeItem('authToken');
          window.location.href = '/';
     };

     const isAuthenticated = () => {
          return !!token.value;
     };

     return {
          token,
          error,
          login,
          register,
          logout,
          isAuthenticated,
          currentUser
     };
}
