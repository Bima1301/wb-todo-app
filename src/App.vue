<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useDark, useToggle } from "@vueuse/core";
import { useAuth } from "./composables/useAuth";

const isDark = useDark({
  selector: "body",
});
const toggleDark = useToggle(isDark);
const { currentUser } = useAuth();

</script>

<template>
  <main class="flex min-h-screen bg-slate-100 dark:bg-gray-900">
    <img
      :src="isDark ? '/images/dark-bg.jpg' : '/images/light-bg.jpeg'"
      class="absolute object-cover w-full h-[35%] dark:brightness-50"
    />
    <div class="w-full h-[35%] absolute top-0 left-0 bg-gradient-to-r from-violet-500/40 to-blue-500/40 dark:brightness-75" />
    <div class="relative w-full flex min-h-screen justify-center pt-44">
      <div class="flex flex-col gap-5 w-full md:max-w-2xl px-5">
        <div class="flex flex-row items-center justify-between gap-3 text-white">
          <p class="text-4xl font-bold">WB TODO</p>
          <div class="flex gap-2 items-center">
            <button
              class="p-3 hover:bg-black/15 rounded-full transition-all duration-200 hover:shadow-sm"
              @click="toggleDark()"
            >
              <Icon
                v-if="isDark"
                icon="line-md:sun-rising-filled-loop"
                class="text-4xl"
              />
              <Icon
                v-else
                icon="line-md:moon-filled-loop"
                class="text-4xl"
              />
            </button>
            <div v-if="currentUser" class="flex flex-col">
              <span class="font-bold">
                {{ currentUser?.name }} 
              </span>
              <span class="text-xs">{{ currentUser?.email }}</span>
            </div>
          </div>
        </div>
        <RouterView />
      </div>
    </div>
    <div class="flex w-full absolute bottom-0 z-20 py-3 bg-white dark:bg-gray-700">
      <p class="text-center text-gray-400 font-bold w-full dark:text-gray-600">
        Coded By
        <span class="text-gray-600 dark:text-gray-400">
          Bima
          - 2024
        </span>
      </p>
    </div>

  </main>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

</template>