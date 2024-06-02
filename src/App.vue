<script setup lang="ts">
import { useDark} from "@vueuse/core";

const isDark = useDark({
  selector: "body",
});
</script>

<template>
  <main class="flex min-h-[100dvh] bg-slate-200 dark:bg-gray-900 flex-col">
    <img
    :src="isDark ? '/images/dark-bg.jpg' : '/images/light-bg.jpeg'"
    class="absolute object-cover w-full h-[35%] dark:brightness-50"
    />
    <div class="w-full h-[35%] absolute top-0 left-0 bg-gradient-to-r from-violet-500/40 to-blue-500/40 dark:brightness-75" />
    <div class="relative w-full flex justify-center md:pt-44 pt-20">
      <div class="flex flex-col gap-5 w-full md:max-w-2xl px-5">
        <RouterView />
      </div>
    </div>
    <div class="flex w-full py-3 bg-white dark:bg-gray-700 md:text-sm text-xs mt-auto">
      <p class="text-center text-gray-400 font-bold w-full dark:text-gray-500">
        Coded By
        <span class="text-gray-600 dark:text-gray-400">
          Bima - 2024
        </span>
      </p>
    </div>

  </main>
</template>