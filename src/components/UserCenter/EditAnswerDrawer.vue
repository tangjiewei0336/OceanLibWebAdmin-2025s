<template>
  <a-drawer
    title="编辑回答"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="form" layout="vertical">
      <!-- 问题标题展示 -->
      <a-form-item label="问题标题">
        <a-input v-model:value="questionTitle" placeholder="问题标题" disabled />
      </a-form-item>
      
      <!-- 问题详情（可缩放） -->
      <a-form-item label="问题详情">
        <a-collapse v-model:activeKey="activeKeys">
          <a-collapse-panel key="questionContent" :header="collapseHeader">
            <div 
              class="question-content" 
              v-html="questionContent"
            ></div>
          </a-collapse-panel>
        </a-collapse>
      </a-form-item>
      
      <!-- 回答编辑器 -->
      <a-form-item label="回答内容" name="content">
        <!-- 工具栏 -->
        <Toolbar
          v-if="visible"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
          style="border: 1px solid #d9d9d9; border-bottom: none; border-radius: 2px 2px 0 0;"
        />
        
        <!-- 编辑器 -->
        <Editor
          v-if="visible"
          v-model="form.content"
          :defaultConfig="editorConfig"
          :mode="mode"
          style="height: 400px; border: 1px solid #d9d9d9; border-top: none; border-radius: 0 0 2px 2px;"
          @onCreated="handleEditorCreated"
        />
      </a-form-item>
    </a-form>
    
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" @click="onSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>
  
<script setup>
import { defineProps, defineEmits, watch, ref, shallowRef, onBeforeUnmount, computed } from 'vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

import {
  uploadImage,
} from '@/assets/js/request/AnswerAPI.js'
  
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  record: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const form = ref({
  answerId:'',
  content: ''
})

// 问题详情相关
const questionTitle = ref('')
const questionContent = ref('')
const activeKeys = ref([]) // 默认折叠
const collapseHeader = computed(() => {
  return activeKeys.value.length > 0 
    ? '收起问题详情' 
    : '展开问题详情（点击查看完整内容）'
})

// 编辑器相关变量
const mode = ref('default') // 或 'simple'
const editorRef = shallowRef(null) // 使用 shallowRef 存储编辑器实例
const toolbarConfig = ref({}) // 工具栏配置
const editorConfig = ref({
  placeholder: '请输入回答内容...',
  MENU_CONF: {
    // 图片上传配置
    uploadImage: {
      // 不写server，自己实现上传逻辑
      customUpload: async (file, insertFn) => {
        console.log(file)
        const url = await uploadImage(file); // 你的上传函数
        if (url) {
          insertFn(url, '', '');
        } else {
          console.error('图片上传失败');
        }
      },
      allowedFileTypes: ['image/*']
    }
  }
})

// 工具栏配置 - 定义要显示的菜单项
const defaultToolbarKeys = [
  'headerSelect',
  'blockquote',
  '|',
  'bold',
  'underline',
  'italic',
  {
    key: 'group-more-style',
    title: '更多样式',
    menuKeys: ['through', 'code', 'sup', 'sub', 'clearStyle']
  },
  'color',
  'bgColor',
  '|',
  'fontSize',
  'fontFamily',
  'lineHeight',
  '|',
  'bulletedList',
  'numberedList',
  'todo',
  {
    key: 'group-justify',
    title: '对齐',
    menuKeys: ['justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify']
  },
  {
    key: 'group-indent',
    title: '缩进',
    menuKeys: ['indent', 'delIndent']
  },
  '|',
  'insertLink',
  'insertImage',
  'uploadImage', // 添加上传图片菜单项
  'insertTable',
  'codeBlock',
  'divider',
  '|',
  'undo',
  'redo',
  '|',
  'fullScreen'
]

// 设置工具栏配置
toolbarConfig.value = {
  toolbarKeys: defaultToolbarKeys,
  excludeKeys: [] // 排除某些菜单项
}

// 编辑器创建时的回调
const handleEditorCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例
}

// 当可见状态变化时更新表单数据
watch(() => props.visible, (visible) => {
  if (visible) {
    form.value = {
      content: props.record.content || '',
      answerId: props.record.id || 0
    }
    // 设置问题详情
    questionTitle.value = props.record.question?.title || '未知问题标题'
    questionContent.value = props.record.question?.content || '暂无问题详情'
  }
})

// 确保编辑器在关闭时正确销毁
const destroyEditor = () => {
  if (editorRef.value) {
    editorRef.value.destroy()
    editorRef.value = null
  }
}

const onClose = () => {
  destroyEditor()
  emit('update:visible', false)
}

const onSubmit = () => {
  // 提交表单数据
  emit('submit', form.value)
  onClose()
}

// 组件卸载时销毁编辑器
onBeforeUnmount(() => {
  destroyEditor()
})
</script>

<style scoped>
/* 问题内容样式 */
.question-content {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  margin-top: 8px;
}

/* 折叠面板样式 */
:deep(.ant-collapse) {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

:deep(.ant-collapse-header) {
  font-weight: 500;
  color: #1890ff;
}

:deep(.ant-collapse-content) {
  border-top: none;
}

/* 只读输入框样式 */
:deep(.ant-input[disabled]) {
  background-color: #fafafa;
  color: rgba(0, 0, 0, 0.85);
  cursor: default;
}

/* 编辑器容器样式 */
.editor-container {
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  margin-top: 8px;
}
</style>