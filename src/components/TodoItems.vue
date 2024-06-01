<template>
  <div class="bg-white dark:bg-gray-800 dark:border-gray-800 py-3 px-5 shadow-md flex flex-row items-center justify-between min-h-[58px]">
    <div class="flex flex-row gap-5 items-center w-full">
      <button
        class="p-1 rounded-full dark:border-gray-600 border-gray-300 border-[2px]"
        @click="toggleCheck"
        type="button"
      >
        <div
          v-if="todo?.completed"
          class="bg-green-500 w-3 h-3 rounded-full"
        />
        <div
          v-else
          class="bg-white dark:bg-gray-800 w-3 h-3 rounded-full"
        />
      </button>
      <div v-if="isEditing" class="w-full">
        <input 
          v-model="editedTitle"
          @keyup.enter="saveEdit"
          type="text"
          class="focus:outline-none bg-transparent focus:border-none border-none min-w-full"
          ref="editInput"
        />
      </div>
      <p v-else :class="['font-medium', { 'line-through': todo?.completed }]">
        {{ todo?.title }}
      </p>
    </div>
    <div class="flex gap-2 items-center">
      <button
        type="button"
        :class="['p-2 hover:rounded-full hover:bg-black/10',{'hidden' : todo?.completed}]"
        @click="isEditing ? saveEdit() : toggleEdit()"
      >
        <Icon
          :icon="isEditing ? 'ic:round-send' : 'jam:pencil-f'"
          class="text-gray-400 text-lg rounded-full"
        />
      </button>

      <button
        type="button"
        :class="['p-2 hover:rounded-full hover:bg-black/10',{'hidden' : isEditing}]"
        @click="deleteTodo"
      >
        <Icon
          icon="typcn:times"
          class="text-red-400 text-lg rounded-full"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, nextTick } from "vue";
import { Icon } from "@iconify/vue";

const props:any = defineProps({
  todo: Object,
});

const emit = defineEmits(["toggle", "update","delete"]);

const isEditing = ref(false);
const editedTitle = ref(props.todo.title);
const editInput = ref<HTMLInputElement | null>(null);

const toggleCheck = () => {
  emit("toggle", props.todo);
};

const toggleEdit = async () => {
  isEditing.value = true;
  editedTitle.value = props.todo.title;
  await nextTick();
  if (editInput.value) {
    editInput.value.focus();
  }
};

const saveEdit = () => {
  if (editedTitle.value !== props.todo.title) {
    emit("update", { ...props.todo, title: editedTitle.value });
  }
  isEditing.value = false;
};

const deleteTodo = () => {
  emit("delete", props.todo);
};
</script>
