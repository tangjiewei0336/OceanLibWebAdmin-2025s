<template>
  <div class="answer-management">
    <a-breadcrumb style="margin-bottom: 16px">
      <a-breadcrumb-item>知乎</a-breadcrumb-item>
      <a-breadcrumb-item>回答管理</a-breadcrumb-item>
    </a-breadcrumb>

    <!-- 如果传入了 questionId，就显示当前问题标题 -->
    <div v-if="questionId" class="current-question" style="margin-bottom: 16px;">
      <a-typography-text>当前问题：</a-typography-text>
      <a-typography-text strong>{{ questionTitle }}</a-typography-text>
    </div>

    <!-- 搜索表单 -->
    <a-card v-if="!questionId" style="margin-bottom: 16px">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch">
        <a-form-item :label="questionId ? '回答者' : '回答者'" class="form-item-inline">
          <!-- 无论是否有 questionId，搜索框都改成按用户名搜 -->
          <a-input
            v-model:value="searchForm.username"
            placeholder="请输入用户名"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item class="form-actions-inline">
          <a-button type="primary" html-type="submit" :loading="loading">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button style="margin-left: 8px" @click="resetSearch">
            <template #icon><RedoOutlined /></template>
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-table
      :columns="filteredColumns"
      :data-source="answers"
      :loading="loading"
      :pagination="pagination"
      rowKey="id"
      @change="handleTableChange"
      :scroll="{ x: 'max-content' }"
    >
      <template #footer>
        <div>共计 {{ pagination.total }} 条数据</div>
      </template>
    </a-table>

    <EditAnswerDrawer
      v-model:visible="editVisible"
      :record="currentRecord"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { h, ref, onMounted, computed } from 'vue'
import { message, Modal, Badge } from 'ant-design-vue'
import { 
  EditOutlined, 
  DeleteFilled, 
  SearchOutlined,
  RedoOutlined
} from '@ant-design/icons-vue'
import EditAnswerDrawer from '@/components/UserCenter/EditAnswerDrawer.vue'
import { defineProps } from 'vue'
import {
  updateAnswerPut,
  deleteAnswer,
  gainAnswer,
  gainAnswerByUser,
  gainAnswerByQuestion,
} from '@/assets/js/request/AnswerAPI.js'


// 状态与数据
const answers = ref([])
const loading = ref(false)
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
})

const props = defineProps({
  questionId: {
    type: [String, Number],
    default: ''
  },
  questionTitle: {
    type: [String],
    default: ''
  },
})

// 搜索表单
const searchForm = ref({
  username: '',
  // question_connect: '',
  // status: undefined
})

// 添加状态控制
const editVisible = ref(false)
const currentRecord = ref({})

// 处理提交
const handleSubmit = async (formData) => {
  console.log('收到表单数据：', formData)
  try {
    await updateAnswerPut(formData)
    message.success('更新成功')
    loadData()
  } catch (error) {
    message.error('更新失败: ' + (error?.message || '未知错误'))
  }
}

// 加载数据
const loadData = async (params = {}) => {
  console.log('加载回答数据!!')
  loading.value = true
  try {
    if (props.questionId != '') {
      let res = await gainAnswerByQuestion({
        questionId: props.questionId,
        page: pagination.value.current,
        pageSize: pagination.value.pageSize,
      })
      console.log(res)
      answers.value = res.content
      pagination.value.total = res.totalElements
    }
    else if (searchForm.value.username && searchForm.value.username != '') {
      console.log("TODO")
      console.log({
        username: searchForm.value.username,
        page: pagination.value.current,
        pageSize: pagination.value.pageSize,
      })
      let res = await gainAnswerByUser({
        username: searchForm.value.username,
        page: pagination.value.current,
        pageSize: pagination.value.pageSize,
      })
      console.log(res)
      answers.value = res.content
      pagination.value.total = res.totalElements
    }
    else {
      console.log(searchForm.value.username)
      let res = await gainAnswer({
        page: pagination.value.current,
        pageSize: pagination.value.pageSize,
      })
      console.log(res)
      answers.value = res.content
      pagination.value.total = res.totalElements
    }
  } catch (error) {
    message.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.value.current = 1 // 重置到第一页
  loadData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    username: '',
    // question_connect: '',
  }
  pagination.value.current = 1
  loadData()
}


// 表格变更（分页、排序、筛选）
const handleTableChange = (pag, filters, sorter) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize

  const params = {}
  if (sorter.field) {
    params.sortField = sorter.field
    params.sortOrder = sorter.order
  }
  Object.keys(filters).forEach(key => {
    if (filters[key]) params[key] = filters[key]
  })
  loadData(params)
}

const editAnswer = (record) => {
  console.log('编辑回答', record.id)
  currentRecord.value = {
    id: record.id,
    content: record.content,
    userId: record.userId,
    createTime: record.createTime,
    updateTime: record.updateTime,
    likeCount: record.likeCount,
    commentCount: record.commentCount,
    question: record.question
  }
  editVisible.value = true
}

const delete_answer = async id => {
  Modal.confirm({
    title: '确认删除回答？',
    content: `您确定要删除ID为 ${id} 的回答吗？此操作不可恢复。`,
    okText: '删除',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      try {
        await deleteAnswer(id)
        message.success(`已删除回答 ${id}`)
        loadData()
      } catch (error) {
        message.error(`删除失败: ${error.message}`)
      }
    }
  })
}

const stripHtml = (html) => {
  return html.replace(/<[^>]+>/g, '');
}

const columns = ref([
  {
    title: 'ID',
    dataIndex: 'id',
    sorter: false,
    width: '8%',
  },
  {
    title: '内容',
    dataIndex: 'content',
    width: '26%',
    ellipsis: true,
    customRender: ({ text }) => {
      const plainText = stripHtml(text || '');
      return h(
        'div',
        {
          style: {
            maxWidth: '300px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          title: plainText, // 鼠标 hover 时可以看到完整内容
        },
        plainText
      );
    },
    onHeaderCell: () => ({ style: { minWidth: '150px' } }),
  },
  {
    title: '用户名',
    dataIndex: 'userId',
    ellipsis: true,
    width: '10%',
    onHeaderCell: () => ({ style: { minWidth: '80px' } }),
  },
  {
    title: '关联问题',
    key: 'question-title',
    dataIndex: ['question', 'title'],
    ellipsis: true,
    width: '18%',
    customRender: ({ text, record }) => {
      return h('a', {
        style: { color: '#1890ff' },
        onClick: () => console.log('查看问题:', record.question.bindId)
      }, text);
    },
    onHeaderCell: () => ({ style: { minWidth: '120px' } }),
  },
  {
    title: '状态',
    dataIndex: 'isDeleted',
    key: 'status',
    width: '12%',
    align: 'left',
    customRender: ({ record }) => {
      const { isDeleted } = record

      // 根据优先级依次判断
      let statusText = ''
      let badgeStatus = ''

      if (isDeleted === 1 || isDeleted === true) {
        statusText = '删除'
        badgeStatus = 'error'
      } else {
        statusText = '发布'
        badgeStatus = 'success'
      }

      return h(
        'span',
        { style: { display: 'inline-flex', alignItems: 'center' } },
        [
          h(Badge, {
            status: badgeStatus,
            style: { marginRight: '0px' }
          }),
          statusText
        ]
      )
    }
  },
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  //   width: '12%',
  //   ellipsis: true,
  // },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: '12%',
    ellipsis: true,
  },
  {
    title: '点赞量',
    dataIndex: 'likeCount',
    sorter: false,
    width: '8%',
    responsive: ['lg'],
    onHeaderCell: () => ({ style: { minWidth: '60px' } }),
  },
  {
    title: '点踩量',
    dataIndex: 'dislikeCount',
    sorter: false,
    width: '8%',
    responsive: ['lg'],
    onHeaderCell: () => ({ style: { minWidth: '60px' } }),
  },
  {
    title: '评论数',
    dataIndex: 'commentCount',
    sorter: false,
    width: '8%',
    responsive: ['lg'],
    onHeaderCell: () => ({ style: { minWidth: '60px' } }),
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    width: '15%',
    onHeaderCell: () => ({ style: { minWidth: '150px' } }),
    customRender: ({ record }) => {
      return h('div', { style: {justifyContent: 'center', display: 'flex', alignItems: 'center',gap: '12px', } }, [
          h('a', {
              onClick: () => editAnswer(record),
              style: {
                cursor: 'pointer',
                color: '#1677ff',
              },
            },
            [
              h(EditOutlined, { style: { marginRight: '5px' } }),
              '编辑',
            ]
          ),

          // 分隔竖线
          h('span', {
            style: {
              display: 'inline-block',
              width: '1px',
              height: '1.2em',
              backgroundColor: '#e0e0e0',
              verticalAlign: 'middle',
            },
          }),

          // 删除
          h('a', {
              onClick: () => {
                Modal.confirm({
                  title: '确认删除该回答？',
                  content: `回答 ID：${record.id}`,
                  okText: '确定',
                  cancelText: '取消',
                  onOk: () => delete_answer(record.id),
                })
              },
              style: {
                cursor: 'pointer',
                color: 'red',
              },
            },
            [
              h(DeleteFilled, { style: { marginRight: '5px' } }),
              '删除',
            ]
          ),
        ]
      )
    },
  },
])
// 添加计算属性过滤列
const filteredColumns = computed(() => {
  if (props.questionId) {
    // 过滤掉关联问题列
    return columns.value.filter(column => column.key !== 'question-title')
  }
  return columns.value
})

onMounted(() => {
  loadData()
})

</script>

<style scoped>
.answer-management {
  padding: 20px 24px;
  /* background-color: #f5f7fa; */
}

/* .answer-management :deep(.ant-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
} */

/* .answer-management :deep(.ant-table-thead > tr > th) {
  background-color: #1890ff;
  color: white;
  font-weight: 600;
} */

/* .answer-management :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #e6f7ff !important;
} */

/* .answer-management :deep(.ant-pagination) {
  margin: 16px 0;
  padding-right: 16px;
} */

/* .answer-management :deep(.ant-breadcrumb) {
  font-size: 16px;
  padding: 8px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
} */
</style>