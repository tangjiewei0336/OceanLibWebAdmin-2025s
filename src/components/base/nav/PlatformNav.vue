<!-- Layout.vue -->
<template>
  <!-- 原有布局结构 -->
  <Navbar :index="'2'" />
  <div class="navbar">
    <span class="navbar__mask"></span>
  </div>
  
  <a-layout>
    <Sidebar :selectedKey="selectedKey" :menu="menu" :role="role" />
    <a-layout style="padding: 0 24px 24px; overflow: auto">
      <a-layout-content>
        <div style="padding: 0 50px">
          <!-- 动态路由视图 -->
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </div>
        <!-- 固定页脚 -->
        <!-- <a-layout-footer style="text-align: left">...</a-layout-footer> -->
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import Navbar from '@/components/base/nav/Navbar.vue';
import Sidebar from '@/components/base/nav/Sidebar.vue';
import { useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { h } from 'vue';

const props = defineProps(['selectedKey', 'menu', 'role']);
const router = useRouter();

const menu = [
	{
		label: '通知',
		icon: ['fas', 'home'],
		row: '0',
		name: 'Notice',
	},
	{
		label: '文档审核',
		icon: ['fas', 'book'],
		name: 'FileList',
		row: '1',
	},
	{
		label: '用户管理',
		icon: ['fas', 'user'],
		row: '2',
		items: [
		{
			label: '一般用户管理',
			name: 'UserManage',
		},
		{
			label: '管理员管理',
			name: 'AdminManage',
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