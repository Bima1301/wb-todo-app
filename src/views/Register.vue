<template>
  <div class="sm:min-w-[500px]">
    <p class="text-center text-2xl font-semibold text-white mb-5">Register</p>
    <form @submit.prevent="register" class="flex flex-col text-gray-700 dark:text-gray-400">
      
      <div class="mb-3">
        <div class="bg-white dark:bg-gray-800 dark:border-gray-800 border rounded md:py-5 py-3 md:px-5 px-3 md:text-base text-sm shadow-md flex flex-row justify-between items-center">
          <input v-model="name" type="text" class="focus:outline-none bg-transparent focus:border-none border-none  w-full" placeholder="Name">
          <div class="p-2">
            <Icon icon="icon-park-solid:edit-name" class="text-gray-400 text-xl"/>
          </div>
        </div>
        <div v-for="(name, index) in errors.name" :key="index">
          <p class="text-red-500 text-xs">{{ name }}</p>
        </div>
      </div>

      <div class="mb-3">
      <div class="bg-white dark:bg-gray-800 dark:border-gray-800 border rounded md:py-5 py-3 md:px-5 px-3 md:text-base text-sm shadow-md flex flex-row justify-between items-center">
        <input v-model="email" type="text" class="focus:outline-none bg-transparent focus:border-none border-none  w-full" placeholder="Email">
        <div class="p-2">
          <Icon icon="mage:email-fill" class="text-gray-400 text-xl"/>
        </div>
      </div>
      <div v-for="(email, index) in errors.email" :key="index">
          <p class="text-red-500 text-xs">{{ email }}</p>
        </div>
      </div>
      
      <div class="mb-3">
      <div class="bg-white dark:bg-gray-800 dark:border-gray-800 border rounded md:py-5 py-3 md:px-5 px-3 md:text-base text-sm shadow-md flex flex-row justify-between items-center">
        <input v-model="password" :type="showPassword ? 'text':'password' " class="focus:outline-none bg-transparent focus:border-none border-none  w-full" placeholder="Password">
        <button type="button" class="p-2 hover:rounded-full hover:bg-black/10" @click="handleShowPassword(false)">
          <Icon v-if="showPassword"  icon="iconoir:eye-solid" class="text-gray-400 text-xl"/>
          <Icon v-else icon="iconoir:eye-closed" class="text-gray-400 text-xl"/>
        </button>
      </div>
      <div v-for="(email, index) in errors.email" :key="index">
          <p class="text-red-500 text-xs">{{ email }}</p>
        </div>
      </div>

      <div class="mb-3">
      <div class="bg-white dark:bg-gray-800 dark:border-gray-800 border rounded md:py-5 py-3 md:px-5 px-3 md:text-base text-sm shadow-md flex flex-row justify-between items-center">
        <input v-model="confirmPassword" :type="showConfirmPassword ? 'text':'password' " class="focus:outline-none bg-transparent focus:border-none border-none  w-full" placeholder="Confirm Password">
        <button type="button" class="p-2 hover:rounded-full hover:bg-black/10" @click="handleShowPassword(true)">
          <Icon v-if="showConfirmPassword"  icon="iconoir:eye-solid" class="text-gray-400 text-xl"/>
          <Icon v-else icon="iconoir:eye-closed" class="text-gray-400 text-xl"/>
        </button>
      </div>
      <div v-for="(confirmPassword, index) in errors.confirmPassword" :key="index">
        <p class="text-red-500 text-xs">{{ confirmPassword }}</p>
      </div>
      </div>

      <button type="submit" class="w-full p-3 bg-blue-500 bg-opacity-30 border-violet-600 border-2 rounded-md text-black dark:text-white font-semibold mt-8 hover:translate-y-2 transition-all duration-200">
        REGISTER
      </button>
      <p class="mt-5 md:text-base text-sm">
        Already have an account? <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useToast } from 'vue-toast-notification';

const $toast = useToast({
  position: 'top-right',
});

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');

const loading = ref(false);

const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const errors = ref<any>([]);

const { register: registerUser } = useAuth();

const register = async () => {

  $toast.info('Loading...');
  loading.value = true;

  if (password.value !== confirmPassword.value) {
    errors.value = {
      confirmPassword: ['Password and Confirm Password must be the same'],
    };
    return;
  }

  try {
    await registerUser(name.value, email.value, password.value);
    $toast.clear();
    $toast.success('Register success. Welcome to the app!');
    router.push('/');
  } catch (error:any) {
    console.log(error);
    $toast.clear();
    $toast.error('Something went wrong!');

    if (error.response.data?.data?.errors) {
      errors.value = error.response.data.data.errors;
      return;
    }

  }
  loading.value = false;
};

const handleShowPassword = (isConfirm:boolean) => {
  if (isConfirm) {
    showConfirmPassword.value = !showConfirmPassword.value;
  } else {
    showPassword.value = !showPassword.value;
  }
}

</script>
