<template>
	<div class="document-review-container">
	  <!-- 顶部导航菜单 -->
	  <a-menu
		mode="horizontal"
		v-model:selectedKeys="selectedKeys"
		@select="handleMenuSelect"
		class="review-menu"
	  >
		<a-menu-item key="pending">
		  <template #icon><clock-circle-outlined /></template>
		  待审核
		</a-menu-item>
		<a-menu-item key="approved">
		  <template #icon><check-circle-outlined /></template>
		  审核通过
		</a-menu-item>
		<a-menu-item key="rejected">
		  <template #icon><close-circle-outlined /></template>
		  审核未通过
		</a-menu-item>
	  </a-menu>
  
	  <!-- 文档表格区域 -->
	  <a-card :bordered="false" class="review-table-card">
		<a-table
		  :data-source="tableData"
		  :pagination="pagination"
		  :loading="loading"
		  @change="handleTableChange"
		  rowKey="fileID"
		  :scroll="{ x: 800 }"
		>
		  <a-table-column 
			title="标题" 
			dataIndex="title" 
			width="200"
			:ellipsis="true"
		  />
		  <a-table-column 
			title="用户名" 
			dataIndex="uploadUsername" 
			width="150"
		  />
		  <a-table-column 
			title="上传日期" 
			dataIndex="uploadDate"
			:sorter="(a, b) => new Date(a.uploadDate) - new Date(b.uploadDate)"
		  >
			<template #customRender="{ text }">
			  {{ formatDate(text) }}
			</template>
		  </a-table-column>
		  <a-table-column 
			title="状态" 
			key="status"
			:filters="[
			  { text: '待审核', value: 0 },
			  { text: '已通过', value: 1 },
			]"
			:filterMultiple="false"
			:onFilter="(value, record) => record.isApproved === value"
		  >
			<template #customRender="{ record }">
			  <a-tag :color="getStatusColor(record.isApproved)">
				{{ getStatusText(record.isApproved) }}
			  </a-tag>
			</template>
		  </a-table-column>
		  <a-table-column title="操作" width="120" fixed="right">
			<template #customRender="{ record }">
			  <a-button 
				type="link" 
				size="small"
				@click="handleReview(record.fileID)"
			  >
				{{ selectedKeys == 'pending' ? '审核' : '查看' }}
			  </a-button>
			</template>
		  </a-table-column>
		</a-table>
	  </a-card>
	</div>
  </template>
  
<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { 
message, 
Card as ACard,
Tag as ATag
} from 'ant-design-vue';
import { 
ClockCircleOutlined,
CheckCircleOutlined,
CloseCircleOutlined
} from '@ant-design/icons-vue';
import { getFileList } from '@/assets/js/request/FileAPI.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const tableData = ref([]);
const selectedKeys = ref(['pending']);
const filterStatus = computed(() => selectedKeys.value[0]);

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

// 状态显示处理
const getStatusText = (status) => {
	const savedFilter = localStorage.getItem('filter');
	const map = { 'pending': '待审核', 'approved': '已通过', 'rejected': '未通过' };
	return map[savedFilter] || '未知';
};

const getStatusColor = (status) => {
	const savedFilter = localStorage.getItem('filter');
	const colors = { 'pending': 'orange', 'approved': 'green', 'rejected': 'red' };
	return colors[savedFilter] || 'gray';
};

// 菜单选择处理
const handleMenuSelect = ({ key }) => {
	pagination.current = 1;
	loadTableData();
	localStorage.setItem('filter', key);
};

// 加载表格数据
const loadTableData = async () => {
try {
	loading.value = true;
	const filterMap = { pending: 0, approved: 1, rejected: 2 };
	const filter = filterMap[filterStatus.value];

	const data = await getFileList(
	pagination.current, 
	pagination.pageSize, 
	filter
	);
	
	tableData.value = data.list;
	pagination.total = data.total;
} catch (error) {
	message.error('获取数据失败: ' + error.message);
} finally {
	loading.value = false;
}
};

// 初始化加载数据
onMounted(() => {
	const savedFilter = localStorage.getItem('filter');
	if (savedFilter) {
		selectedKeys.value = [savedFilter];
	}
	loadTableData();
});

// 处理表格变化
const handleTableChange = (pag) => {
	pagination.current = pag.current;
	pagination.pageSize = pag.pageSize;
	loadTableData();
};

// 日期格式化
const formatDate = (timestamp) => {
	return new Date(timestamp).toLocaleString();
};

// 审核操作
const handleReview = (fileID) => {
	localStorage.setItem('fileID', fileID);
	router.push({ 
		name: 'FileReview', 
		params: { fileID },
		query: { from: filterStatus.value }
	});
};
</script>

<style scoped>
.document-review-container {
	padding: 16px 24px;
	background: #fff;
}

.review-menu {
	margin-bottom: 16px;
	border-bottom: none;
	background: #fafafa;
	border-radius: 4px;
	padding: 0 16px;
}

.review-table-card {
	margin-top: 16px;
	border-radius: 4px;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.review-table-card :deep(.ant-card-body) {
	padding: 0;
}
</style>