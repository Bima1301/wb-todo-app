import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/axios-interceptor';

export function useAuth() {
     const token = ref<string | null>(localStorage.getItem('authToken'));
     const router = useRouter();

     const validateToken = async () => {
          try {
               const response = await api.get(`/auth/me`, {
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
               if (router.currentRoute.value.path != '/login' && router.currentRoute.value.path != '/register') {
                    router.push('/login');
               }
          }
     });

     const isAuthenticated = () => {
          return !!token.value;
     };

     return {
          isAuthenticated,
     };
}
