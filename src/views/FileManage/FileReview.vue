<template>
	<div class="document-viewer">
		<div class="document-info" v-if="fileInfo">
			<h2>{{ fileInfo.title }}</h2>
			<div class="meta-info">
				<span>大小: {{ formatSize(fileInfo.size) }}</span>
				<span>上传者: {{ fileInfo.uploadUsername }}</span>
				<span>上传时间: {{ formatDate(fileInfo.uploadDate) }}</span>
			</div>
			<div class="abstract">
				<h3>内容摘要</h3>
				<p>{{ fileInfo.abstractContent || '暂无内容摘要' }}</p>
			</div>
	  	</div>
	</div>
	<div v-if="showPdf" class="iframe-container" style="display: flex; justify-content: center; align-items: center;">
		<iframe 
			:src="PdfUrl" 
			style="width: 100%; height: 80vh; object-fit: contain; border: none;"
		></iframe>
	</div>

	<div class="feedback-container">
		<!-- 大尺寸输入框 -->
		<a-textarea
			@input="feedbackText = $event.target.value"
			placeholder="请输入反馈意见（必填）"
			:auto-size="{ minRows: 4, maxRows: 6 }"
			class="large-input"
		/>
		
		<!-- 带间距的按钮组 -->
		<div class="button-group">
			<a-button 
				v-if="filter % 2 == 0"
				type="primary" 
				@click="submitFeedback(true)"
				class="btn-approve"
			>
				通过
			</a-button>
			
			<a-button
				v-if="filter !== 2"
				type="primary" 
				danger
				@click="submitFeedback(false)"
				class="btn-reject"
			>
				拒绝
			</a-button>
			
			<a-button 
				type="primary" 
				ghost
				@click="routerGoBack"
				class="btn-back"
			>
				返回
			</a-button>
		</div>
  	</div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { getFileInfo, postFileRejection, postFileApprove } from '@/assets/js/request/FileAPI'; 
import { useRouter } from 'vue-router';
import { objectStorageServer } from '@/config'

const router = useRouter();

// 响应式数据
const fileInfo = ref(null);
const PdfUrl = ref('');
const showPdf = ref(false);
const loading = ref(false);
const error = ref('');
const feedbackText = ref('')
const filter = ref(0)

// 格式化文件大小
const formatSize = (bytes) => {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 格式化日期
const formatDate = (dateString) => {
	return new Date(dateString).toLocaleString();
};

onMounted(async () => {
	const filterStatus = localStorage.getItem('filter')
	if (filterStatus == "pending") {
		filter.value = 0;
	} else if (filterStatus == "approved") {
		filter.value = 1;
	} else if (filterStatus == "rejected") {
		filter.value = 2;
	}
	
	const fileID = localStorage.getItem('fileID');
	if (!fileID) {
		error.value = '未找到文档ID';
		return;
	}

	loading.value = true;

	try {
		// 获取文档基本信息
		const infoResponse = await getFileInfo(fileID);
		if (infoResponse) {
			fileInfo.value = infoResponse;
			localStorage.setItem('fileName', infoResponse.fileName);
		}
		
		PdfUrl.value = objectStorageServer + infoResponse['previewPdfObjectName'];
		showPdf.value = true;
	} catch (err) {
		error.value = `加载失败: ${err.message}`;
		message.error(error.value);
	} finally {
		loading.value = false;
	}
});

// 提交反馈到后端
const submitFeedback = async (isAccept) => {
	if (!feedbackText.value && !isAccept) {
		message.error('拒绝意见不能为空！');
		return;
	}
	const fileID = localStorage.getItem('fileID');
	try {
		if (isAccept) {
			let data = await postFileApprove(fileID, feedbackText.value);
			message.success(`审核完成: 通过`);
		} else {
			let data = await postFileRejection(fileID, feedbackText.value);
			message.success(`审核完成: 拒绝`);
		}
		routerGoBack();
	} catch (error) {
		message.error(`操作失败: ${error.response?.data?.message || error.message}`);
	}
};

const routerGoBack = () => {
	router.back();
};

</script>
  
<style scoped>
.document-viewer {
	max-width: 1200px;
	margin: 0 auto;
}

.document-info {
	margin-bottom: 30px;
	padding: 20px;
	background: #f9f9f9;
	border-radius: 8px;
}

.meta-info {
	display: flex;
	gap: 20px;
	margin: 15px 0;
	color: #666;
	font-size: 14px;
}

.abstract {
	margin-top: 20px;
}

.abstract h3 {
	margin-bottom: 10px;
	color: #333;
}

.loading, .error {
	text-align: center;
	padding: 20px;
	font-size: 16px;
}

.error {
	color: #ff4d4f;
}

.iframe-container {
	margin-top: 20px;
	border: 1px solid #eee;
	border-radius: 8px;
	overflow: hidden;
}

.feedback-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.large-input {
  width: 100%;
  margin-bottom: 24px;
  font-size: 16px;
}

.button-group {
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* 按钮颜色定制 */
.btn-approve {
  background-color: #52c41a;
  border-color: #52c41a;
}

.btn-approve:hover {
  background-color: #73d13d;
  border-color: #73d13d;
}

.btn-reject {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

.btn-reject:hover {
  background-color: #ff7875;
  border-color: #ff7875;
}

.btn-back {
  color: #1890ff;
  border-color: #1890ff;
}

.btn-back:hover {
  color: #40a9ff;
  border-color: #40a9ff;
}

</style>