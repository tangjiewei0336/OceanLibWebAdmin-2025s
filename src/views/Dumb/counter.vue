<template>
    <div class="simple-counter">
      <h1>{{ title }}</h1>
      <p>当前计数：{{ count }}</p>
      <button @click="increment">增加</button>
      <button @click="reset">重置</button>
    </div>
  </template>
  
<script setup>
import { ref, onMounted } from 'vue';

// 响应式数据
const title = ref('Vue 3 计数器示例');
const count = ref(0);

onMounted(async () => {
	// if (localStorage.token) {
    //     console.log("token exist")
    // } else {
	// 	console.log("token is fucked")
	// }
});

// 方法
const increment = () => {
	count.value++;
};

const reset = () => {
	count.value = 0;
};
</script>

<style scoped>
.simple-counter {
	text-align: center;
	font-family: Arial, sans-serif;
	margin-top: 50px;
}

button {
	margin: 5px;
	padding: 8px 16px;
	background-color: #42b983;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

button:hover {
	background-color: #33a06f;
}
</style>