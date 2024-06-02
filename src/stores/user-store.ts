import api from '@/utils/axios-interceptor';
import { defineStore } from 'pinia'

export const useUserStore = defineStore('currentUser', {
     state: () => ({
          currentUser: null,
          token: null,
     }),
     actions: {
          setCurrentUser(user: any) {
               this.currentUser = user;
               localStorage.setItem('currentUser', JSON.stringify(user));
          },
          removeCurrentUser() {
               this.currentUser = null;
               localStorage.removeItem('currentUser');
          },
          async register(name: string, email: string, password: string) {
               const response = await api.post(`/auth/signup`, { name, email, password });
               this.token = response.data.data.token
               localStorage.setItem('authToken', response.data.data.token);

               console.log('after register', response.data.data.user);
               this.currentUser = response.data.data.user;
          },
          async login(email: string, password: string) {
               const response = await api.post(`/auth/login`, { email, password });
               this.token = response.data.data.token
               localStorage.setItem('authToken', response.data.data.token);

               console.log('after login', response.data.data.user);
               this.currentUser = response.data.data.user;
          },
          async logout() {
               this.token = null;
               this.currentUser = null;
               localStorage.removeItem('authToken');
               window.location.href = '/';
          },
     }

})