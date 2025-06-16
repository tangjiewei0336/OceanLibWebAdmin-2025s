<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu :selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline" :style="{ height: '100%', borderRight: 0 }">
      <div v-for="(submenu, index1) in menu" :key="index1">
        <!-- 主菜单项跳转 -->
        <a-menu-item v-if="submenu.items == undefined" :key="submenu.row" @click="handleMenuItemClick(submenu, submenu.row)">
          <template #icon>
            <font-awesome-icon :icon="submenu.icon" />
          </template>
          {{ submenu.label }}
        </a-menu-item>
        <!-- 子菜单项跳转 -->
        <a-sub-menu :key="submenu.row" v-if="submenu.items != undefined" :title="submenu.label">
          <template #icon>
            <font-awesome-icon :icon="submenu.icon" />
            {{ submenu.label }}
          </template>
          <!-- <a-menu-item
            :key="index1 + '-' + index2"
            v-for="(item, index2) in submenu.items.filter((item) => item.role == null || (item.role != null && item.role == role))"
            @click="handleMenuItemClick(item)"
          >
            {{ item.label }}
          </a-menu-item> -->
          <a-menu-item
            v-for="(item, index2) in submenu.items.filter(item => !item.role || item.role === role)"
            :key="submenu.row + '-' + item.name"
            @click="handleMenuItemClick(item, submenu.row + '-' + item.name)"
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

// 点击菜单时保存状态
const handleMenuItemClick = (item, key) => {
  if (item.name) {
    selectedKeys.value = [key]; // 使用传入的真实 key
    sessionStorage.setItem('lastMenuState', JSON.stringify({
      openKeys: openKeys.value,
      selectedKeys: selectedKeys.value
    }));
    router.push({ name: item.name });
  }
};


// 初始化时恢复状态
onMounted(() => {
  const savedState = sessionStorage.getItem('lastMenuState');
  if (savedState) {
    const { openKeys: savedOpenKeys, selectedKeys: savedSelectedKeys } = JSON.parse(savedState);
    openKeys.value = savedOpenKeys;
    selectedKeys.value = savedSelectedKeys;
  } else {
    openKeys.value.push(props.selectedKey[0]);
    if (props.selectedKey.length > 1) {
      selectedKeys.value.push(props.selectedKey[0] + '-' + props.selectedKey[1]);
    } else {
      selectedKeys.value.push(props.selectedKey[0]);
    }
  }
});
</script>