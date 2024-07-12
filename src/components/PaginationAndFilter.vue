<template>
  <div class="flex justify-between bg-white dark:bg-gray-800 dark:border-gray-800 py-1 px-5 items-center">
    <p class="md:text-sm text-xs text-gray-400 dark:text-gray-300 font-medium">
      {{ totalDataLeft }} items left
    </p>
    <div class="flex md:gap-2 gap-1 md:text-sm text-xs font-medium dark:text-gray-600 text-gray-300 items-center">
        <button
          @click="$emit('filter', 'all')"
          :class="filter === 'all' ? 'font-bold dark:text-gray-300 text-gray-600' : ''"
        >
          All
        </button>
        <button
          @click="$emit('filter', 'active')"
          :class="filter === 'active' ? 'font-bold dark:text-gray-300 text-gray-600' : ''"
        >
          Active
        </button>
        <button
          @click="$emit('filter', 'completed')"
          :class="filter === 'completed' ? 'font-bold dark:text-gray-300 text-gray-600' : ''"
        >
          Completed
        </button>
      </div>
    <div class="flex flex-row items-center gap-3">
      <button
        @click="$emit('paginate', 'prev')"
        :disabled="page === 1"
        class="p-1 hover:rounded-full hover:bg-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon
          icon="bx:bxs-chevron-left"
          class="text-gray-400 text-2xl"
        />
      </button>
      <button
        @click="$emit('paginate', 'next')"
        :disabled="page === totalPage || totalPage === 0"
        class="p-1 hover:rounded-full hover:bg-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon
          icon="bx:bxs-chevron-right"
          class="text-gray-400 text-2xl"
        />
      </button>
    </div>
  </div>
</template>
   
   <script setup lang="ts">
import { defineProps } from "vue";
import { Icon } from "@iconify/vue";

defineProps({
  page: Number,
  totalPage: Number,
  totalDataLeft: Number,
  filter: String,
});
</script>
   