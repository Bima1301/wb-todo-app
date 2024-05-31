import { useAuth } from '@/composables/useAuth'
import auth from '@/middleware/auth'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import { createRouter, createWebHistory } from 'vue-router'

const { isAuthenticated } = useAuth(); //

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: auth
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (isAuthenticated()) {
          next('/');
        } else {
          next();
        }
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      beforeEnter: (to, from, next) => {
        if (isAuthenticated()) {
          next('/');
        } else {
          next();
        }
      }
    }
  ]
})

export default router
