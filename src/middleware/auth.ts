import { useAuth } from '@/composables/useAuth';

export default function auth(to: any, from: any, next: any) {
     const { isAuthenticated } = useAuth();

     if (!isAuthenticated()) {
          return next('/login');
     }

     next();
}
