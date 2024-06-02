import { defineStore } from "pinia";

export const useAuthStorePinia = defineStore('authStore', {
     state: () => ({
          token: localStorage.getItem('token') || null,
          user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null
     }),
     actions: {
          setToken(token: string) {
               this.token = token;
               localStorage.setItem('token', token);
          },
          setUser(user: any) {
               this.user = user;
               localStorage.setItem('user', JSON.stringify(user));
          },
          removeToken() {
               this.token = null;
               localStorage.removeItem('token');
          },
          removeUser() {
               this.user = null;
               localStorage.removeItem('user');
          }
     }
})