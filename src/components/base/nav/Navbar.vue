<style scoped>
.a-layout-header {
  display: flex;
  width: 100%;
  z-index: 100;
  align-items: center;
  padding: 1.5rem !important;
  position: absolute;
}

.container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

.menu-list {
  display: flex !important;
  flex-basis: auto;
  flex-grow: 1;
  align-items: center;
}

.ant-menu-horizontal {
  border-bottom: unset;
}

.menu {
  background-color: unset;
}

.logo {
  width: 270px;
  margin-right: 20px;
}

.navbar {
  position: relative;
  background-image: url(src/assets/images/backgrounds/img-1.jpg);
  height: 110px;
}

.navbar__mask {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.7;
  height: 100%;
  width: 100%;
  background-color: #288cff !important;
}
</style>

<template>
  <a-layout-header style="display: flex; justify-content: space-between; align-items: center; padding: 0px 60px">
    <a-flex :gap="20" align="center">
      <img src="@/assets/images/logo.png" height="30px" />
      <a-menu :selectedKeys="index" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-menu-item key="1" @click="router.push({ name: 'Index' })"><b>首页</b></a-menu-item>
        <a-menu-item key="2" @click="router.push({ name: 'Welcome' })"><b>管理平台</b></a-menu-item>
      </a-menu>
    </a-flex>
    <div v-if="userInfo != null">
      <a-dropdown-button>
        <a-tag color="#cd201f" v-if="userInfo.role == 'teacher'">
          <template #icon> <font-awesome-icon :icon="['fas', 'chalkboard-user']" /> </template>
          教师
        </a-tag>
        <a-tag color="#108ee9" v-else-if="userInfo.role == 'student'">
          <template #icon> <font-awesome-icon :icon="['fas', 'graduation-cap']" /> </template>
          学生
        </a-tag>

        <a-typography-text type="secondary">{{ userInfo.studentName }}({{ userInfo.username }}) </a-typography-text>
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="logout">
              <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
              退出登录
            </a-menu-item>
          </a-menu>
        </template>
        <template #icon><font-awesome-icon :icon="['fas', 'user']" /></template>
      </a-dropdown-button>
    </div>
    <a-button @click="login.openModal()" type="primary" ghost v-else>用户登录</a-button>
    <Login ref="login" />
  </a-layout-header>
</template>
<script setup>
import { ref, onMounted, defineProps } from 'vue';
import Login from '@/components/Login/Login.vue';
import { message } from 'ant-design-vue';

import { useRouter } from 'vue-router';

const props = defineProps(['index']);
const index = ref([props.index]);

const router = useRouter();

const login = ref();
const logout = () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('token');
  userInfo.value = null;
  message.success('已退出登录');
  setTimeout(function () {
    location.reload();
  }, 1000);
};

const userInfo = ref();
onMounted(() => {
  let nowUserInfo = localStorage.getItem('userInfo');
  if (nowUserInfo != undefined) {
    userInfo.value = JSON.parse(localStorage.getItem('userInfo'));
  }
});
</script>