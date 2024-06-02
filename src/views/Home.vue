<template>
  <Header />
    <form
      @submit.prevent="handleTodoCreate"
      class="text-gray-700 dark:text-gray-300"
    >
      <div class="bg-white dark:bg-gray-800 dark:border-gray-800 border rounded py-5 px-5 shadow-md flex flex-row items-center justify-between">
        <div class="flex flex-row gap-5 items-center w-full">
          <button
            class="p-1 rounded-full dark:border-gray-600 border-gray-300 border-[2px]"
            @click="handleCheck()"
            type="button"
          >
            <div
              v-if="isCheck"
              class="bg-green-500 w-3 h-3 rounded-full"
            />
            <div
              v-else
              class="bg-white dark:bg-gray-800 w-3 h-3 rounded-full"
            />
          </button>

          <input
            v-model="title"
            type="text"
            class="focus:outline-none bg-transparent focus:border-none border-none w-full"
            placeholder="Create a new todo..."
          />
        </div>
        <button
          type="submit"
          class="p-3 hover:rounded-full hover:bg-black/10"
        >
          <Icon
            icon="lucide:file-input"
            class="text-gray-400 text-2xl rounded-full"
          />
        </button>
      </div>
    </form>
    <div class="flex flex-col mt-8 text-gray-700 dark:text-gray-300 divide-y dark:divide-gray-600 shadow-lg rounded overflow-hidden">
      <div v-if="data.length == 0" class="bg-white dark:bg-gray-800 dark:border-gray-800 py-5 px-5 shadow-md min-h-[58px] flex flex-col justify-center items-center">
        <img
          src="/images/no-data.png"
          alt="empty"
          class="w-1/2 max-w-[100px]"
        />
      <p class="mt-3 font-medium dark:text-gray-400 text-gray-600 md:text-sm text-xs">
        No data found
      </p>
      </div>

        <TodoItems
        v-for="(item, index) in data"
        :key="index"
        :todo="item"
        @toggle="handleTodoCheck"
        @update="handleTodoUpdate"
        @delete="handleTodoDelete"
      />
      
      <PaginationAndFilter
        :page="page"
        :totalPage="totalPage"
        :totalDataLeft="totalDataLeft"
        :filter="filter"
        @filter="handleFilter"
        @paginate="handlePagination"
      />
    </div>
    <div class="mt-5 flex flex-row justify-between items-center">
      <div class="rounded-full md:max-w-[300px] max-w-[230px] border-2 dark:border-gray-400 border-gray-500 flex flex-row gap-2 items-center py-2 px-3 text-sm dark:text-gray-400 text-gray-500">
        <Icon icon="gravity-ui:magnifier" class="text-lg" />
        <input v-model="searchQuery" @input="debouncedSearch" type="text" placeholder="Search..." class="focus:outline-none bg-transparent focus:border-none border-none w-fit md:max-w-[200px] max-w-[130px]">
      </div>
      <button
        class="w-fit md:text-sm text-xs bg-blue-500 bg-opacity-30 border-violet-600 border-2 rounded-full text-black dark:text-white font-semibold hover:translate-y-2 transition-all duration-200 py-2 px-8"
        @click="logout"
      >
        LOGOUT
      </button>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, ref, toRaw } from "vue";
import api from "../utils/axios-interceptor";
import TodoItems from "../components/TodoItems.vue";
import { useToast } from "vue-toast-notification";
import PaginationAndFilter from "../components/PaginationAndFilter.vue";
import { debounce } from "lodash";
import { useUserStore } from "@/stores/user-store";
import Header from "@/components/Header.vue";

const $toast = useToast({
  position: "top-right",
});

const {logout} = useUserStore();


const title = ref<string>("");
const isCheck = ref<boolean>(false);

const data = ref<any>([]);
const page = ref<number>(1);
const totalData = ref<number>(0);
const totalDataLeft = ref<number>(0);
const totalPage = ref<number>(0);
const filter = ref<string>('all');
const searchQuery = ref<string>("");

const handleCheck = () => {
  isCheck.value = !isCheck.value;
};

const handleTodoCreate = async () => {
  if (!title.value) {
    $toast.error("Title is required");
    return;
  }

  const body = {
    title: title.value,
    completed: isCheck.value ? true : false,
  };

  await api
    .post("/todos", body)
    .then(() => {
      $toast.success("Todo created");
      title.value = "";
      isCheck.value = false;
      handleGetAllTodos();
    })
    .catch(() => {
      $toast.error("Failed to create todo");
    });
};

const handleTodoCheck = async (todo: any) => {
  const todoData = toRaw(todo);
  
  const body = {
    status : !todoData.completed,
    id: todoData.id,
  };

  await api.patch('/todos/status', body)
    .then(() => {
      $toast.success('Todo updated');
      handleGetAllTodos();
    })
    .catch(() => {
      console.log('error')
    })

};

const handleTodoUpdate = async (todo: any) => {
  const todoData = toRaw(todo);
  // optimistic update
  data.value = data.value.map((item: any) => {
        if (item.id === todoData.id) {
          return {
            ...item,
            title: todoData.title,
          };
        }
        return item;
  });

  const body = {
    title: todoData.title,
  };

  await api.put(`/todos/${todoData.id}`, body) 
    .then(() => {
      $toast.success('Todo updated');
    })
    .catch(() => {
      $toast.error('Failed to update todo');
      handleGetAllTodos();
    })
};

const handleTodoDelete = async (todo: any) => {
  const todoData = toRaw(todo);

  await api.delete(`/todos/${todoData.id}`)
    .then(() => {
      $toast.success('Todo deleted');
      handleGetAllTodos();
    })
    .catch(() => {
      $toast.error('Failed to delete todo');
      handleGetAllTodos();
    })
};

const handlePagination = (type: string) => {
  if (type === "prev" && page.value > 1) {
    page.value = page.value - 1;
  } else if (type === "next" && page.value < totalPage.value) {
    page.value = page.value + 1;
  }
  handleGetAllTodos();
};

const handleFilter = (type: string) => {
  filter.value = type;
  handleGetAllTodos();
};

const handleSearch = () => {
  handleGetAllTodos();
};

// Wrap the search handler with debounce
const debouncedSearch = debounce(handleSearch, 300);

const handleGetAllTodos = async () => {
  $toast.info("Loading...");
  const body = {
    params: {
      page: page.value,
      pageSize: 5,
      searchFilters: {
        title: searchQuery.value,
      },
      orderBy: {
        field: "created_at",
        sort: "desc",
      },
      filters : {
        completed : filter.value === 'all' ? '' : filter.value === 'active' ? false : true
      }
    },
  } as any;

  if (filter.value === 'all') {
    delete body.params.filters.completed;
  }

  body.params.searchFilters = JSON.stringify(body.params.searchFilters);
  body.params.orderBy = JSON.stringify(body.params.orderBy);
  body.params.filters = JSON.stringify(body.params.filters);

  await api
    .get("/todos", body)
    .then((response) => {
      data.value = response.data.data.todos;
      totalData.value = response.data.data.totalData;
      page.value = response.data.data.currentPage;
      totalPage.value = response.data.data.totalPage;
      totalDataLeft.value = response.data.data.itemLeft;
    })
    .catch((error) => {
      console.log(error);
    });

  $toast.clear();
};

onMounted(() => {
  handleGetAllTodos();
});
</script>
