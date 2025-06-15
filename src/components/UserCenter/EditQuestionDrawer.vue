<template>
  <a-drawer
    title="编辑问题"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="form" layout="vertical">
      <!-- 标题仍然可以用普通写法 -->
      <a-form-item label="标题" name="title">
        <a-input v-model:value="form.title" placeholder="请输入问题标题" />
      </a-form-item>

      <!-- 把 wrapper-col 设为 0，然后把文字＋开关都放到 label 区 -->
      <a-form-item
        :wrapper-col="{ span: 0 }"
      >
        <!-- <template #label> -->
        <div>
          <span>是否隐藏问题</span>
          <a-switch
            v-model:checked="form.isHidden"
            style="margin-left: 8px;"
          />
        </div>
        <!-- </template> -->
        <!-- 没有默认插槽内容，control 区宽度被挤成 0，就不会留空 -->
        <div>
          <span style="color: rgba(0,0,0,0.45); font-size: 12px;">
            隐藏后，问题在前端页面不会显示，优先级高于“是否发布”
          </span>
        </div>
      </a-form-item>

      <a-form-item
        :wrapper-col="{ span: 0 }"
      >
        <!-- <template #label> -->
        <div>
          <span>是否发布</span>
          <a-switch
            v-model:checked="form.isPosted"
            :disabled="form.isHidden"
            style="margin-left: 8px;"
          />
        </div>
        <!-- </template> -->
        <!-- 没有默认插槽内容，control 区宽度被挤成 0，就不会留空 -->
        <div v-if="form.isHidden">
          <span style="color: rgba(0,0,0,0.45); font-size: 12px;">
            隐藏状态下无法发布问题
          </span>
        </div>
      </a-form-item>

      <a-form-item label="问题详情" name="content">
        <Toolbar
          v-if="visible"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
          style="border: 1px solid #d9d9d9; border-bottom: none; border-radius: 2px 2px 0 0;"
        />
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
import { defineProps, defineEmits, watch, ref, shallowRef, onBeforeUnmount } from 'vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

import {
  uploadImage,
} from '@/assets/js/request/QuestionAPI.js'

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
  title: '',
  content: '',
  // tagIds: [],
  id: '',
  isHidden: false,
  isPosted: false,
})

// 编辑器相关变量
const mode = ref('default') // 或 'simple'
const editorRef = shallowRef(null) // 使用 shallowRef 存储编辑器实例
const toolbarConfig = ref({}) // 工具栏配置
const editorConfig = ref({
  placeholder: '请输入问题详情...',
  MENU_CONF: {
    // 图片上传配置
    uploadImage: {
      // 不写server，自己实现上传逻辑
      customUpload: async (file, insertFn) => {
        // console.log(file)
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
    // console.log(props.record)
    // console.log(form.value)
    form.value = {
      title: props.record.title || '',
      content: props.record.content || '',
      // tagIds: props.record.tagIds ? [...props.record.tagIds] : [],
      id: props.record.bindId || '',
      isHidden: props.record.isHidden === 1 || props.record.isHidden === true,
      isPosted: props.record.isPosted === 1 || props.record.isPosted === true,
    }
  }
})

// 监听隐藏状态变化，当隐藏时自动关闭发布状态
watch(() => form.value.isHidden, (isHidden) => {
  if (isHidden) {
    form.value.isPosted = false
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