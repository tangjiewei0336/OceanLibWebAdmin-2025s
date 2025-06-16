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
			<span>大小: {{ formatSize(fileInfo.size) }}</span>
			<span>上传者: {{ fileInfo.uploadUsername }}</span>
			<span>上传时间: 
				<span v-if="!isEditing">{{ formatDate(fileInfo.uploadDate) }}</span>
				<a-date-picker
					v-else
					v-model:value="editableInfo.uploadDate"
					show-time
					format="YYYY-MM-DD HH:mm"
					value-format="YYYY-MM-DD HH:mm"
					style="width: 160px"
				/>
			</span>
			<span class="tag-container">标签: {{ fileInfo.tagNames.join(', ') }}</span>
			<span>文件夹: {{ fileInfo.folderID || '无' }}
				<!-- <span v-if="!isEditing">{{ fileInfo.folderID || '无' }}</span> -->
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
        
        <h3>互动相关</h3>
        <div class="meta-info">
          	<span>评分: {{ fileInfo.fileExtraEntity.score }}分 ({{ fileInfo.fileExtraEntity.ratersNum }}人)</span>
        	<span>隐藏分: {{ fileInfo.hideScore }}</span> 
			<span>阅读:{{ fileInfo.fileExtraEntity.readNum }}次</span>
			<span>点赞: {{ fileInfo.fileExtraEntity.likeNum }}</span>
			<span>下载: {{ fileInfo.fileExtraEntity.downloadNum }}次</span>
			<span>收藏: {{ fileInfo.fileExtraEntity.collectionNum }}</span>
			<span>允许评论: 
				<span v-if="!isEditing">{{ fileInfo.isAllowComment ? '是' : '否' }}</span>
				<a-switch v-else v-model:checked="editableInfo.isAllowComment" />
			</span>
			<span>评论数: {{ fileInfo.fileExtraEntity.commentNum }}</span>
        </div>
        
        <h3>认证信息</h3>
        <div class="meta-info">
			<span>专业认证: 
				<span v-if="!isEditing">{{ fileInfo.fileExtraEntity.isProCert ? '是' : '否' }}</span>
				<a-switch v-else v-model:checked="editableInfo.fileExtraEntity.isProCert" />
			</span>
			<span>官方: 
				<span v-if="!isEditing">{{ fileInfo.fileExtraEntity.isOfficial ? '是' : '否' }}</span>
				<a-switch v-else v-model:checked="editableInfo.fileExtraEntity.isOfficial" />
			</span>
			<span>原创: 
				<span v-if="!isEditing">{{ fileInfo.fileExtraEntity.isOriginal ? '是' : '否' }}</span>
				<a-switch v-else v-model:checked="editableInfo.fileExtraEntity.isOriginal" />
			</span>
			<span>VIP收益: 
				<span v-if="!isEditing">{{ fileInfo.fileExtraEntity.isVipIncome ? '开启' : '关闭' }}</span>
				<a-switch v-else v-model:checked="editableInfo.fileExtraEntity.isVipIncome" />
			</span>
			<span>版权: 
				<span v-if="!isEditing">{{ formatCopyright(fileInfo.fileExtraEntity.copyrightNotice) || '无' }}</span>
				<a-input v-else v-model:value="editableInfo.fileExtraEntity.copyrightNotice" style="width: 150px" />
			</span>
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
			<a-button 
				v-if="!isEditing"
				@click="toggleEditMode" 
				type="primary" 
			>
				<template #icon>
					<EditOutlined/>
				</template>
				编辑信息
			</a-button>

			<a-button 
				v-if="isEditing" 
				type="default" 
				@click="isEditing=false"
				:loading="loading"
				style="margin-left: 10px"
			>
				<template #icon>
					<CloseOutlined />
				</template>
				取消编辑
			</a-button>

			<a-button 
				v-if="isEditing" 
				type="primary" 
				@click="submitChanges"
				:loading="loading"
				style="margin-left: 10px"
			>
				<template #icon>
					<CheckOutlined />
				</template>
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
  ArrowLeftOutlined,
  EditOutlined,
  CloseOutlined,
  CheckOutlined
} from '@ant-design/icons-vue';
import { ref, reactive, watch, onMounted } from 'vue';
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
const feedbackText = ref('');
const filter = ref(0);
const isEditing = ref(false);

// 编辑表单数据
const editableInfo = reactive({
  title: '',
  size: 0,
  uploadUsername: '',
  uploadDate: null,
  tagNames: [],
  paymentMethod: 1,
  paymentAmount: 0,
  isAllowAnon: false,
  isAllowVipfree: false,
  isAllowComment: false,
  hideScore: 0,
  folderID: 0,
  abstractContent: '',
  fileExtraEntity: {
    score: 0,
    ratersNum: 0,
    readNum: 0,
    likeNum: 0,
    downloadNum: 0,
    collectionNum: 0,
    commentNum: 0,
    isProCert: false,
    isOfficial: false,
    isOriginal: false,
    isVipIncome: false,
    copyrightNotice: ''
  }
});

// 存储初始数据用于比较
const initialData = ref({});

// 加载文档信息
const loadFileInfo = async () => {
  const fileID = localStorage.getItem('fileID');
  if (!fileID) {
    error.value = '未找到文档ID';
    return;
  }

  loading.value = true;
  try {
    const infoResponse = await getFileInfo(fileID);
    if (infoResponse) {
      fileInfo.value = infoResponse;
      PdfUrl.value = objectStorageServer + infoResponse['previewPdfObjectName'];
      showPdf.value = true;
      
      // 初始化编辑数据
      resetEditableInfo();
    }
  } catch (err) {
    error.value = `加载失败: ${err.message}`;
    message.error(error.value);
  } finally {
    loading.value = false;
  }
};

// 重置编辑表单
const resetEditableInfo = () => {
	if (!fileInfo.value) return;
	
	const data = fileInfo.value;
	Object.keys(editableInfo).forEach(key => {
		if (key !== 'fileExtraEntity' && data[key] !== undefined) {
		editableInfo[key] = data[key];
		}
	});
	
	if (data.fileExtraEntity) {
		Object.assign(editableInfo.fileExtraEntity, data.fileExtraEntity);
	}
	editableInfo.isAllowAnon = Boolean(fileInfo.value.isAllowAnon);
	editableInfo.isAllowComment = Boolean(fileInfo.value.isAllowComment);
	editableInfo.isAllowVipfree = Boolean(fileInfo.value.isAllowVipfree);
	editableInfo.fileExtraEntity.isOfficial = Boolean(fileInfo.value.fileExtraEntity.isOfficial);
	editableInfo.fileExtraEntity.isOriginal = Boolean(fileInfo.value.fileExtraEntity.isOriginal);
	editableInfo.fileExtraEntity.isProCert = Boolean(fileInfo.value.fileExtraEntity.isProCert);
	editableInfo.fileExtraEntity.isVipIncome = Boolean(fileInfo.value.fileExtraEntity.isVipIncome);

	// 保存初始数据
	initialData.value = JSON.parse(JSON.stringify(editableInfo));
};

// 切换编辑模式
const toggleEditMode = () => {
  if (!fileInfo.value) {
    message.warning('数据尚未加载完成，请稍后');
    return;
  }
  
  if (!isEditing.value) {
    resetEditableInfo();
  }
  
  isEditing.value = !isEditing.value;
};

// 提交修改
const submitChanges = async () => {
	try {
		loading.value = true;
		
		// 1. 收集修改过的字段
		const delta = {};
		
		// 比较顶层字段
		Object.keys(editableInfo).forEach(key => {
			if (key === 'fileExtraEntity') return;
			
			// 特殊处理日期字段
			if (key === 'uploadDate') {
				const initialDate = initialData.value[key] ? dayjs(initialData.value[key]).format('YYYY-MM-DD') : null;
				const currentDate = editableInfo[key] ? dayjs(editableInfo[key]).format('YYYY-MM-DD') : null;
				if (initialDate !== currentDate) {
				delta[key] = editableInfo[key];
				}
				return;
			}
			
			// 普通字段比较
			if (JSON.stringify(editableInfo[key]) !== JSON.stringify(initialData.value[key])) {
				delta[key] = editableInfo[key];
			}
		});
		
		// 比较嵌套对象
		const extraDelta = {};
		Object.keys(editableInfo.fileExtraEntity).forEach(key => {
			if (JSON.stringify(editableInfo.fileExtraEntity[key]) !== JSON.stringify(initialData.value.fileExtraEntity[key])) {
				extraDelta[key] = editableInfo.fileExtraEntity[key];
			}
		});
		
		if (Object.keys(extraDelta).length > 0) {
			delta.fileExtraEntity = extraDelta;
		}
		
		// 2. 检查是否有实际修改
		if (Object.keys(delta).length === 0) {
			message.info('未检测到任何修改');
			isEditing.value = false;
			return;
		}
		// 3. 提交修改
		const res = await postFileInfoChange(
			fileInfo.value.fileID, 
			editableInfo,
			fileInfo.value.uploadUsername
		);
		
		if (res) {
		message.success('修改成功');
		// 更新本地数据
		Object.assign(fileInfo.value, delta);
		if (delta.fileExtraEntity) {
			Object.assign(fileInfo.value.fileExtraEntity, editableInfo.fileExtraEntity);
		}
			isEditing.value = false;
		} else {
			message.error('修改失败');
		}
	} catch (err) {
		console.error('提交修改失败:', err);
		message.error(`修改失败: ${err.message}`);
	} finally {
		loading.value = false;
	}
};

// 初始化加载
onMounted(() => {
  const filterStatus = localStorage.getItem('filter');
  if (filterStatus == "pending") {
    filter.value = 0;
  } else if (filterStatus == "approved") {
    filter.value = 1;
  } else if (filterStatus == "rejected") {
    filter.value = 2;
  }
  
  loadFileInfo();
});

// 格式化函数
const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString) => {
  return dateString ? dayjs(dateString).format('YYYY-MM-DD HH:mm:ss') : '无日期';
};

const getTextPlaceHolder = () => {
  const filterStatus = localStorage.getItem('filter');
  if (filterStatus == "pending") return '请输入审核意见（必填）';
  if (filterStatus == "approved") return '请输入拒绝意见（必填）';
  if (filterStatus == "rejected") return '请输入通过意见（选填）';
  return '';
};

const formatPaymentMethod = (method) => {
  const map = {1: '免费', 2: '付费', 3: 'VIP免费'};
  return map[method] || '未知';
};

const formatApprovedStatus = (status) => {
  const map = {0: '待审核', 1: '已通过', 2: '已拒绝'};
  return map[status] || '未知';
};

const formatCopyright = (notice) => {
  const map = {
    'BY-NC-ND-SA': '署名-非商业-禁止演绎-相同方式共享'
  };
  return map[notice] || notice;
};

// 反馈提交
const submitFeedback = async (isAccept) => {
  if (!feedbackText.value && !isAccept) {
    message.error('拒绝意见不能为空！');
    return;
  }
  const fileID = localStorage.getItem('fileID');
  try {
    if (isAccept) {
      await postFileApprove(fileID, feedbackText.value);
      message.success(`审核完成: 通过`);
    } else {
      await postFileRejection(fileID, feedbackText.value);
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
  box-sizing: border-box; /* 新增 */
}

.document-card,
.feedback-card {
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  overflow: hidden; /* 新增：防止内容溢出圆角 */
}

.preview-container {
  width: 100%;
  height: calc(100vh - 100px);
  min-height: 500px;
  max-height: 800px; /* 新增：限制最大高度 */
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* 元信息网格布局 - 关键改进 */
.meta-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  gap: 16px;
  color: rgba(0, 0, 0, 0.45);
  margin: 12px 0;
  word-break: break-word; /* 新增：长文本换行 */
}

/* 每个元信息项的最小宽度控制 */
.meta-info > span {
  min-width: 0; /* 允许收缩 */
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.abstract {
  margin-top: 16px;
  width: 100%;
}

.abstract h3 {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  margin-bottom: 8px;
}

/* 按钮组响应式改进 */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  flex-wrap: wrap; /* 新增：允许换行 */
  gap: 12px; /* 替代margin-left */
}

/* 输入控件宽度限制 */
.ant-input-number,
.ant-select {
  max-width: 100% !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .document-viewer {
    padding: 16px;
  }
  
  .meta-info {
    grid-template-columns: 1fr; /* 单列布局 */
  }
  
  .preview-container {
    height: 400px;
  }

  /* 移动端按钮组优化 */
  .action-buttons {
    justify-content: space-between;
  }
  .action-buttons > button {
    flex: 1; /* 等宽按钮 */
    min-width: 120px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .meta-info > span {
    flex-direction: column;
    align-items: flex-start;
  }
}

.tag-container {
  display: inline-flex;
  min-width: 150px; /* 最小宽度 */
}

.auto-width-select {
  width: auto;
  min-width: 150px;
  max-width: 400px; /* 可选：设置最大宽度限制 */
}

/* 使标签项不换行 */
.auto-width-select .ant-select-selection-item {
  white-space: nowrap;
}

/* 下拉菜单宽度控制 */
.auto-width-select .ant-select-dropdown {
  min-width: 200px !important;
}
</style>