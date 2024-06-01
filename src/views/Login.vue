<template>
  <div>
    <p class="text-center text-2xl font-semibold text-white mb-5">Login</p>
    <form
      @submit.prevent="login"
      class="flex flex-col  text-gray-700 dark:text-gray-300"
    >
      <div class="bg-white dark:bg-gray-800 dark:border-gray-800 border rounded py-5 px-5 shadow-md flex flex-row justify-between items-center mb-3">
        <input
          v-model="email"
          type="text"
          class="focus:outline-none bg-transparent focus:border-none border-none  w-full"
          placeholder="Email"
        >
        <div class="p-2">
          <Icon
            icon="mage:email-fill"
            class="text-gray-400 text-xl"
          />
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 dark:border-gray-800 border rounded py-5 px-5 shadow-md flex flex-row justify-between items-center">
        <input
          v-model="password"
          :type="showPassword ? 'text':'password' "
          class="focus:outline-none bg-transparent focus:border-none border-none  w-full"
          placeholder="Password"
        >
        <button
          type="button"
          class="p-2 hover:rounded-full hover:bg-black/10"
          @click="handleShowPassword()"
        >
          <Icon
            v-if="showPassword"
            icon="iconoir:eye-solid"
            class="text-gray-400 text-xl"
          />
          <Icon
            v-else
            icon="iconoir:eye-closed"
            class="text-gray-400 text-xl"
          />
        </button>
      </div>
      <button
        type="submit"
        class="w-full p-3 bg-blue-500 bg-opacity-30 border-violet-600 border-2 rounded-md text-black dark:text-white font-semibold mt-8 hover:translate-y-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading"
      >
        LOGIN
      </button>
      <p class="mt-5">
        Don't have an account? <router-link
          to="/register"
          class="text-blue-500 hover:underline"
        >Register</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";
import { useToast } from "vue-toast-notification";
import { useRouter } from "vue-router";

const $toast = useToast({
  position: "top-right",
});

const loading = ref(false);
const router = useRouter();
const email = ref<string>("");
const password = ref<string>("");
const showPassword = ref(false);

const { login: loginUser } = useAuth();

const login = async () => {
  loading.value = true;
  $toast.info("Loading...");

  try {
    await loginUser(email.value, password.value);

    $toast.clear();
    $toast.success("Login success. Welcome back!");
    router.push("/");
  } catch (error) {
    console.log(error);
    $toast.clear();
    $toast.error("Something went wrong, check your email and password!");
  }

  loading.value = false;
};

const handleShowPassword = () => {
  showPassword.value = !showPassword.value;
};
</script>
