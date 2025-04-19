<template>
  <Navbar :index="'2'" />
  <div class="navbar">
    <span class="navbar__mask"></span>
  </div>
  <a-layout>
    <a-layout-sider width="200" style="background: #fff">
      <a-menu :selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline" :style="{ height: '100%', borderRight: 0 }">
        <div v-for="(submenu, index1) in menu" :key="index1">
          <a-menu-item 
            v-if="submenu.items == undefined" 
            :key="index1.toString()" 
            @click="goToPage(submenu)"
            >
            <!-- @click="router.push({ name: submenu.name })" -->
            <template #icon>
              <font-awesome-icon :icon="submenu.icon" />
            </template>
            {{ submenu.label }}
          </a-menu-item>
          
          <a-sub-menu 
            :key="index1.toString()" 
            v-if="submenu.items != undefined" 
            :title="submenu.label"
            >
            <template #icon>
              <font-awesome-icon :icon="submenu.icon" />
              {{ submenu.label }}
            </template>
            <a-menu-item
              :key="index1 + '-' + index2"
              v-for="(item, index2) in submenu.items.filter((item) => item.role == null || (item.role != null && item.role == role))"
              @click="goToPage(item)"
            >
              <!-- @click="router.push({ name: submenu.name })" -->
              {{ item.label }}
            </a-menu-item>
          </a-sub-menu>
        </div>
      </a-menu>
    </a-layout-sider>
    <a-layout style="padding: 0 24px 24px; overflow: auto">
      <a-layout-content>
        <div style="padding: 0 50px">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>{{ menu[selectedKey[0]].label }}</a-breadcrumb-item>
            <a-breadcrumb-item v-if="menu[selectedKey[0]].items != undefined">
              {{ menu[selectedKey[0]].items[selectedKey[1]].label }}
            </a-breadcrumb-item>
            <slot name="breadcrumb-item"></slot>
          </a-breadcrumb>
          <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
            <slot name="content"></slot>
          </div>
        </div>
        <a-layout-footer style="text-align: left">
          Fudan University & Oriole Software ©2024 Created by <a href="mailto:jzsun24@m.fudan.edu.cn">远致Neo</a>
          <a-divider type="vertical" />
          <a @click="about">关于系统</a>
        </a-layout-footer>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>




<script setup>
import { ref, defineProps, onMounted } from 'vue';
import Navbar from '@/components/base/nav/Navbar.vue';
import { useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { h } from 'vue';

const props = defineProps(['selectedKey']);
const router = useRouter();

const menu = [
  {
    label: '主页',
    icon: ['fas', 'home'],
    name: 'Welcome',
  },
  {
    label: '文档管理',
    icon: ['fas', 'book'],
    items: [
      {
        label: 'Test A-1',
        name: 'Test A-1',
      },
      {
        label: 'Test A-2',
      },
    ],
  },
  {
    label: '用户管理',
    icon: ['fas', 'user'],
    items: [
      {
        label: '管理员页面',
        name: 'user-management_admin',
        routeName: 'user-management_admin',
        role: 'admin',
      },
      {
        label: '超级管理员页面',
        name: 'user-management_superAdmin',
        routeName: 'user-management_superAdmin',
        role: 'superadmin',
      },
    ],
  },
];

const selectedKeys = ref([]);
const openKeys = ref([]);
const role = ref('student');

onMounted(() => {
  let nowUserInfo = localStorage.getItem('userInfo');
  if (nowUserInfo != undefined) {
    role.value = JSON.parse(nowUserInfo).role;
  }

  openKeys.value.push(props.selectedKey[0]);
  if (props.selectedKey.length > 1) {
    selectedKeys.value.push(props.selectedKey[0] + '-' + props.selectedKey[1]);
  } else {
    selectedKeys.value.push(props.selectedKey[0]);
  }
});

// 统一处理跳转逻辑
const goToPage = (menuItem) => {
  // console.log(11111);
  if (menuItem.routeName) {
    router.push({ name: menuItem.routeName });
    // console.log(menuItem.routeName);
  } else if (menuItem.name) {
    router.push({ name: menuItem.name });
  }
  // console.log(menuItem);
};

const about = () => {
  Modal.info({
    title: '关于系统',
    content: h('div', {}, [
      h(
        'p',
        '本系统版权归属烟台数方软件有限责任公司（Oriole Software）所有。本系统得到了 复旦大学 彭鑫教授 的资助与指导。'
      ),
      h('p', '系统版本：V0.0.1.build-/-.-/- 初始版'),
    ]),
    onOk() {
      console.log('ok');
    },
  });
};
</script>