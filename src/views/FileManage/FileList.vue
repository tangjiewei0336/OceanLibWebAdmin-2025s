<template>
	<h2 style="margin-top: 24px;">文档审核</h2>
	<div class="container">
	  <div class="filter-buttons" style="margin-bottom: 16px;">
		<a-button 
		  :class="{
			'pending-btn': filterStatus === 'pending',
			'active-button': filterStatus === 'pending'
			}"
		  @click="changeFilter('pending')"
		>待审核</a-button>
		<a-button 
		  :class="{
			'approved-btn': filterStatus === 'approved',
			'active-button': filterStatus === 'approved'
			}"
		  @click="changeFilter('approved')"
		>审核通过</a-button>
		<a-button 
		  :class="{
			'rejected-btn': filterStatus === 'rejected',
			'active-button': filterStatus === 'rejected'
			}"
		  @click="changeFilter('rejected')"
		>审核未通过</a-button>
	  </div>
  
	  <a-table
		:data-source="tableData"
		:pagination="pagination"
		@change="handleTableChange"
		bordered
		rowKey="fileID"
	  >
		<!-- 原有表格列保持不变 -->
		<a-table-column title="标题" dataIndex="title" width="200" />
		<a-table-column title="用户名" dataIndex="uploadUsername" width="150" />
		<a-table-column title="上传日期" dataIndex="uploadDate">
		  <template #customRender="{ text }">
			{{ formatDate(text) }}
		  </template>
		</a-table-column>
		<a-table-column title="状态">
			<span v-if="filterStatus === 'approved'">已通过</span>
			<span v-else-if="filterStatus === 'pending'">待审核</span>
			<span v-else-if="filterStatus === 'rejected'">被举报</span>
		</a-table-column>
		<a-table-column title="操作" width="120">
		  <template #customRender="{ record }">
			<a-button type="link" @click="handleReview(record.fileID)">
				{{ record.isApproved == 0 ? '进入审核' : '重新审核' }}
			</a-button>
		  </template>
		</a-table-column>
	  </a-table>
	</div>
  </template>
  
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { getFileList } from '@/assets/js/request/FileAPI.js';
import { useRouter } from 'vue-router';

// 响应式数据
const tableData = ref([]);
const filterStatus = ref('pending');	// filtering
const router = useRouter();

// 分页配置
const pagination = reactive({
	current: 1,
	pageSize: 10,
	total: 0,
	showSizeChanger: true,
	showQuickJumper: true,
	showTotal: total => `共 ${total} 条`,
	pageSizeOptions: ['10', '20', '50']
});

// 修改筛选状态并刷新表格
const changeFilter = (status) => {
	filterStatus.value = status;
	// 重置到第一页
	pagination.current = 1;
	// 重新加载数据
	loadTableData();
	localStorage.setItem('filter', status)
};

const loadTableData = async () => {
	try {
		// 根据当前筛选状态传递不同的参数
		let filter = -1;
		// 根据筛选状态添加不同的参数
		if (filterStatus.value === 'pending') {
			filter = 0;
		} else if (filterStatus.value === 'approved') {
			filter = 1;
		} else if (filterStatus.value === 'rejected') {
			filter = 2;
		}

		const data = await getFileList(pagination.current, pagination.pageSize, filter);
		tableData.value = data.list;
		pagination.total = data.total;
	} catch (error) {
		message.error('获取数据失败: ' + error.message);
	}
};

// 初始化加载数据
onMounted(() => {
	if (localStorage.getItem('filter') !== null) {
		filterStatus.value = localStorage.getItem('filter')
	}
	loadTableData();
});

// 处理表格变化
const handleTableChange = async (pag) => {
	pagination.current = Number(pag.current);
	pagination.pageSize = Number(pag.pageSize);
	loadTableData();
};

// 日期格式化
const formatDate = (timestamp) => {
	return new Date(timestamp).toLocaleDateString();
};

// 审核操作
const handleReview = (fileID) => {
	localStorage.setItem('fileID', fileID);
	router.push({ name: 'FileReview', params: { fileID } });
};
</script>

<style scoped>
.container {
	padding: 20px;
	background: #fff;
}

.container h2 {
	color: #1890ff;
	font-weight: 500;
	border-left: 4px solid #1890ff;
	padding-left: 12px;
}

.filter-buttons {
	display: flex;
	gap: 8px;
}

.pending-btn {
  background-color: #faad14;
}
.approved-btn {
  background-color: #52c41a;
}
.rejected-btn {
  background-color: #f5222d;
}

.active-button {
	color: white;
	font-weight: bold;
	border: none !important;
}
</style>