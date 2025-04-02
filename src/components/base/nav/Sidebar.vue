<template>
    <a-layout-sider width="200" style="background: #fff">
      <a-menu :selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline" :style="{ height: '100%', borderRight: 0 }">
        <div v-for="(submenu, index1) in menu" :key="index1">
          <!-- 主菜单项跳转 -->
          <a-menu-item v-if="submenu.items == undefined" :key="index1.toString()" @click="handleMenuItemClick(submenu)">
            <template #icon>
              <font-awesome-icon :icon="submenu.icon" />
            </template>
            {{ submenu.label }}
          </a-menu-item>
          <!-- 子菜单项跳转 -->
          <a-sub-menu :key="index1.toString()" v-if="submenu.items != undefined" :title="submenu.label">
            <template #icon>
              <font-awesome-icon :icon="submenu.icon" />
              {{ submenu.label }}
            </template>
            <a-menu-item
              :key="index1 + '-' + index2"
              v-for="(item, index2) in submenu.items.filter((item) => item.role == null || (item.role != null && item.role == role))"
              @click="handleMenuItemClick(item)"
            >
              {{ item.label }}
            </a-menu-item>
          </a-sub-menu>
        </div>
      </a-menu>
    </a-layout-sider>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const props = defineProps(['selectedKey', 'menu', 'role']);
  const router = useRouter();
  
  const selectedKeys = ref([]);
  const openKeys = ref([]);
  
  // 处理菜单项点击事件
  const handleMenuItemClick = (item) => {
    if (item.name) {
      selectedKeys.value = [item.row];
      router.push({ name: item.name });
    }
  }
  
  onMounted(() => {
    openKeys.value.push(props.selectedKey[0]);
    if (props.selectedKey.length > 1) {
      selectedKeys.value.push(props.selectedKey[0] + '-' + props.selectedKey[1]);
    } else {
      selectedKeys.value.push(props.selectedKey[0]);
    }
  });
  </script>