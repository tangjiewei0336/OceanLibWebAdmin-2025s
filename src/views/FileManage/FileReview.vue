<template>
	<div class="document-viewer">
	  <!-- 文档信息卡片 -->
	  <a-card :bordered="false" class="document-card">
		<div class="document-info" v-if="fileInfo">
			<h2 v-if="!isEditing">{{ fileInfo.title }}</h2>
			<a-input 
				v-else 
				v-model:value="editableInfo.title" 
				placeholder="请输入标题"
				style="width: 100%; font-size: 16px; margin-bottom: 16px;"
			/>
			<h3>基本信息</h3>
			<div class="meta-info">
			<span>大小: 
				<span v-if="!isEditing">{{ formatSize(fileInfo.size) }}</span>
				<a-input-number v-else v-model:value="editableInfo.size" />
			</span>
			<span>上传者: 
				<span v-if="!isEditing">{{ fileInfo.uploadUsername }}</span>
				<a-input 
					v-else 
					v-model:value="editableInfo.uploadUsername"
					style="display: inline-flex; width: auto;"
				/>
			</span>
			<span>上传时间: 
				<span v-if="!isEditing">{{ formatDate(fileInfo.uploadDate) }}</span>
				<a-date-picker v-else v-model:value="editableInfo.uploadDate" />
			</span>
			<span>标签: 
				<span v-if="!isEditing">{{ fileInfo.tagNames.join(', ') }}</span>
				<a-select
				v-else
				v-model:value="editableInfo.tagNames"
				mode="tags"
				style="width: 200px"
				/>
			</span>
			</div>

			<h3>付费设置</h3>
			<div class="meta-info">
			<span>付费方式: 
				<span v-if="!isEditing">{{ formatPaymentMethod(fileInfo.paymentMethod) }}</span>
				<a-select 
					v-else
					v-model:value="editableInfo.paymentMethod"
					style="width: 100px"
					:dropdownStyle="{ width: '350px' }"
				>
					<a-select-option :value="1">免费</a-select-option>
					<a-select-option :value="2">付费</a-select-option>
					<a-select-option :value="3">VIP免费</a-select-option>
				</a-select>
			</span>
			<span>金额: 
				<span v-if="!isEditing">¥{{ fileInfo.paymentAmount }}</span>
				<a-input-number v-else v-model:value="editableInfo.paymentAmount" />
				(元)
			</span>
			<span>匿名下载: 
				<span v-if="!isEditing">{{ fileInfo.isAllowAnon ? '允许' : '禁止' }}</span>
				<a-switch v-else v-model:checked="editableInfo.isAllowAnon" />
			</span>
			<span>VIP免费: 
				<span v-if="!isEditing">{{ fileInfo.isAllowVipfree ? '是' : '否' }}</span>
				<a-switch v-else v-model:checked="editableInfo.isAllowVipfree" />
			</span>
			</div>
			
			<h3>权限设置</h3>
			<div class="meta-info">
				<span>评论: {{ fileInfo.isAllowComment ? '允许' : '禁止' }}</span>
				<span>评分隐藏: {{ fileInfo.hideScore > 0 ? '是' : '否' }}</span>
				<span>文件夹: {{ fileInfo.folderID || '无' }}</span>
			</div>

			<h3>互动数据</h3>
			<div class="meta-info">
				<span>评分: {{ fileInfo.fileExtraEntity.score }}分({{ fileInfo.fileExtraEntity.ratersNum }}人)</span>
				<span>阅读: {{ fileInfo.fileExtraEntity.readNum }}次</span>
				<span>点赞: {{ fileInfo.fileExtraEntity.likeNum }}</span>
				<span>下载: {{ fileInfo.fileExtraEntity.downloadNum }}次</span>
				<span>收藏: {{ fileInfo.fileExtraEntity.collectionNum }}</span>
				<span>评论数: {{ fileInfo.fileExtraEntity.commentNum }}</span>
			</div>
			<h3>认证信息</h3>
			<div class="meta-info">
				<span>专业认证: {{ fileInfo.fileExtraEntity.isProCert ? '是' : '否' }}</span>
				<span>官方: {{ fileInfo.fileExtraEntity.isOfficial ? '是' : '否' }}</span>
				<span>原创: {{ fileInfo.fileExtraEntity.isOriginal ? '是' : '否' }}</span>
				<span>VIP收益: {{ fileInfo.fileExtraEntity.isVipIncome ? '开启' : '关闭' }}</span>
				<span>版权: {{ formatCopyright(fileInfo.fileExtraEntity.copyrightNotice) }}</span>
			</div>
			<div class="abstract">
				<h3>内容摘要</h3>
				<p v-if="!isEditing">{{ fileInfo.abstractContent || '暂无内容摘要' }}</p>
				<a-textarea
				v-else
				v-model:value="editableInfo.abstractContent"
				placeholder="请输入内容摘要"
				:auto-size="{ minRows: 3, maxRows: 6 }"
				style="width: 100%"
				/>
			</div>
		</div>

		<div class="action-buttons">
			<a-button @click="toggleEditMode" type="primary">
				{{ isEditing ? '取消编辑' : '编辑信息' }}
			</a-button>
			<a-button 
				v-if="isEditing" 
				type="primary" 
				@click="submitChanges"
				style="margin-left: 10px"
			>
				提交修改
			</a-button>
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
				:placeholder="getTextPlaceHolder()"
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
import { ref, onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { getFileInfo, postFileRejection, postFileApprove, postFileInfoChange } from '@/assets/js/request/FileAPI'; 
import { useRouter } from 'vue-router';
import { objectStorageServer } from '@/config'

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

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
// const formatDate = (dateString) => {
// 	return new Date(dateString).toLocaleString();
// };

const formatDate = (dateString) => {
  return dateString ? dayjs(dateString).format('YYYY-MM-DD HH:mm:ss') : '无日期';
};

const getTextPlaceHolder = () => {
	const filterStatus = localStorage.getItem('filter')
	if (filterStatus == "pending") {
		return '请输入审核意见（必填）'
	} else if (filterStatus == "approved") {
		return '请输入拒绝意见（必填）'
	} else if (filterStatus == "rejected") {
		return '请输入通过意见（选填）'
	}
}

const isEditing = ref(false)

const editableInfo = reactive({})

const toggleEditMode = () => {
  	isEditing.value = !isEditing.value;
};

const submitChanges = async () => {
	isEditing.value = false
	try {
		const changeResponse = await postFileInfoChange(fileInfo.value.fileID, fileInfo.value.paymentAmount, editableInfo, fileInfo.value.uploadUsername);
		if (changeResponse) {
			message.success('修改成功！');
			router.go(0);
		} else {
			message.error('修改失败！');
		}
	} catch (err) {
		message.error(err.message);
	} finally {
		loading.value = false;
	}
}

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

const formatPaymentMethod = (method) => {
    const map = {1: '免费', 2: '付费', 3: 'VIP免费'};
    return map[method] || '未知';
}

const formatApprovedStatus = (status) => {
	const map = {0: '待审核', 1: '已通过', 2: '已拒绝'};
	return map[status] || '未知';
}

const formatCopyright = (notice) => {
	const map = {
		'BY-NC-ND-SA': '署名-非商业-禁止演绎-相同方式共享'
	};
	return map[notice] || notice;
}

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