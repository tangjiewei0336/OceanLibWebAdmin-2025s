<template>
	<div class="container">
	  <!-- 数据表格 -->
	  <a-table
		:data-source="tableData"
		:pagination="pagination"
		@change="handleTableChange"
		bordered
		rowKey="fileID"
	  >
		  <a-table-column title="标题" dataIndex="title" width="200" />
		  <a-table-column title="用户名" dataIndex="uploadUsername" width="150" />
		  <a-table-column title="上传日期" dataIndex="uploadDate">
			<template #customRender="{ text }">
			  {{ formatDate(text) }}
			</template>
		  </a-table-column>
		  <a-table-column title="状态">
			<template #customRender="{ record }">
			  {{ record.isApproved == 0 ? '新提交' : '被举报' }}
			</template>
		  </a-table-column>
		  <a-table-column title="操作" width="120">
			<template #customRender="{ record }">
			  <a-button type="link" @click="handleReview(record.fileID)">进入审核</a-button>
			</template>
		  </a-table-column>
	  </a-table>
	</div>
  </template>
  
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { getFileList } from '@/assets/js/request/FileAPI.js';
  
// 响应式数据
const tableData = ref([]);
  
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
  
  // 初始化加载数据
onMounted(async () => {
	try {
		let data = await getFileList(1, 10);
		tableData.value = data.list;
		pagination.total = data.total;
		pagination.current = Number(data.pageNum);
	} catch (error) {
		message.error('获取数据失败: ' + error.message);
	}
});

// 处理表格变化
const handleTableChange = async (pag) => {
	pagination.current = Number(pag.current);
	pagination.pageSize = Number(pag.pageSize);

	try {
		const data = await getFileList(pagination.current, pagination.pageSize);
		tableData.value = data.list;
		pagination.total = data.total;
	} catch (error) {
		message.error('获取数据失败: ' + error.message);
	}
};

// 日期格式化
const formatDate = (timestamp) => {
	return new Date(timestamp).toLocaleDateString();
};

// 审核操作
const handleReview = (fileID) => {
	console.log('审核文件ID:', fileID);
	// 这里可以添加审核逻辑
};
</script>

<style scoped>
.container {
padding: 20px;
background: #fff;
}
</style>