<template>
     <div class="flex flex-row items-center justify-between gap-3 text-white">
        <p class="text-4xl font-bold">WB TODO</p>
          <div class="flex gap-2 items-center">
            <button
              class="p-3 hover:bg-black/15 rounded-full transition-all duration-200 hover:shadow-sm"
              @click="toggleDark()"
            >
              <Icon
                v-if="isDark"
                icon="line-md:moon-filled-loop"
                class="text-4xl"
              />
              <Icon
                v-else
                icon="line-md:sun-rising-filled-loop"
                class="text-4xl"
              />
            </button>
            <div v-if="userData" class="flex flex-col">
              <span class="font-bold">
                {{ userData?.name }} 
              </span>
              <span class="text-xs">{{ userData?.email }}</span>
            </div>
          </div>
      </div>
</template>

<script setup lang="ts">
import {   onMounted, ref } from "vue";
import { useDark, useToggle } from '@vueuse/core';
import { Icon } from "@iconify/vue";
import api from "@/utils/axios-interceptor";

const isDark = useDark({
  selector: "body",
});

const userData = ref<any>(null);
const toggleDark = useToggle(isDark);

const handleGetUser = async () => {
     api.get("/auth/me").then((res) => {
          userData.value = res.data.data;
     });
};

onMounted(() => {
     handleGetUser();
});
</script>