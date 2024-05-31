<template>
     <div>
       <h1>Dashboard</h1>
       <button @click="logout">Logout</button>
     </div>
   </template>
   
<script setup lang="ts">
   import { useAuth } from '../composables/useAuth';
   
   const { logout } = useAuth();
</script>