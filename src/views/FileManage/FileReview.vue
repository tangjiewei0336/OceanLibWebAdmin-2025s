<template>
	<div class="document-viewer">
	  <!-- 文档信息卡片 -->
	  <a-card :bordered="false" class="document-card">
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
	  </a-card>
  
	  <!-- PDF预览区域 -->
	  <div v-if="showPdf" class="preview-container">
		<iframe 
		  :src="PdfUrl" 
		  class="pdf-iframe"
		></iframe>
	  </div>
  
	  <!-- 反馈区域 -->
	  <a-card :bordered="false" class="feedback-card">
		<div class="feedback-container">
		  <a-form layout="vertical">
			<a-form-item label="审核意见">
			  <a-textarea
				v-model:value="feedbackText"
				placeholder="请输入详细反馈意见（必填）"
				:auto-size="{ minRows: 4, maxRows: 8 }"
				allow-clear
			  />
			</a-form-item>
			
			<div class="action-buttons">
			  <a-space :size="16">
				<a-button 
				  v-if="filter % 2 == 0"
				  type="primary"
				  @click="submitFeedback(true)"
				>
				  <template #icon><check-circle-outlined /></template>
				  通过
				</a-button>
				
				<a-button
				  v-if="filter !== 2"
				  type="primary"
				  danger
				  @click="submitFeedback(false)"
				>
				  <template #icon><close-circle-outlined /></template>
				  拒绝
				</a-button>
				
				<a-button 
				  type="default"
				  @click="routerGoBack"
				>
				  <template #icon><arrow-left-outlined /></template>
				  返回
				</a-button>
			  </a-space>
			</div>
		  </a-form>
		</div>
	  </a-card>
	</div>
  </template>
  
<script setup>
import { 
	CheckCircleOutlined,
	CloseCircleOutlined,
	ArrowLeftOutlined 
} from '@ant-design/icons-vue';
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
		
		console.log(infoResponse)

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
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.document-card,
.feedback-card {
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.preview-container {
  width: 100%;
  height: calc(100vh - 100px);
  min-height: 500px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.meta-info {
  display: flex;
  gap: 16px;
  color: rgba(0, 0, 0, 0.45);
  margin: 12px 0;
}

.abstract {
  margin-top: 16px;
}

.abstract h3 {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .document-viewer {
    padding: 16px;
  }
  
  .meta-info {
    flex-direction: column;
    gap: 8px;
  }
  
  .preview-container {
    height: 400px;
  }
}
</style>