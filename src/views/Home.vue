<template>
  <div>
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
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, ref, toRaw } from "vue";
import { useAuth } from "../composables/useAuth";
import api from "../utils/axios-interceptor";
import TodoItems from "../components/TodoItems.vue";
import { useToast } from "vue-toast-notification";
import PaginationAndFilter from "../components/PaginationAndFilter.vue";

const $toast = useToast({
  position: "top-right",
});

const title = ref<string>("");
const isCheck = ref<boolean>(false);

const data = ref<any>([]);
const page = ref<number>(1);
const totalData = ref<number>(0);
const totalDataLeft = ref<number>(0);
const totalPage = ref<number>(0);
const filter = ref<string>('all');

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

const { logout } = useAuth();

const handleGetAllTodos = async () => {
  $toast.info("Loading...");
  const body = {
    params: {
      page: page.value,
      pageSize: 5,
      searchFilters: {
        title: "",
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
