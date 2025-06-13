<template>
  <div class="question-management">
    <a-breadcrumb style="margin-bottom: 16px">
      <a-breadcrumb-item>知乎</a-breadcrumb-item>
      <a-breadcrumb-item>问题管理</a-breadcrumb-item>
    </a-breadcrumb>

    <!-- 搜索表单 -->
    <a-card style="margin-bottom: 16px">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch" style="display: flex; flex-wrap: wrap;">
        <!-- <a-form-item label="用户名">
          <a-input 
            v-model:value="searchForm.username" 
            placeholder="请输入用户名"
            allow-clear
            style="width: 180px"
          />
        </a-form-item> -->
        
        <a-form-item label="标题关键字" class="form-item-inline">
          <a-input 
            v-model:value="searchForm.titleKeyword" 
            placeholder="请输入标题关键字"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        
        <!-- <a-form-item label="状态">
          <a-select 
            v-model:value="searchForm.status" 
            placeholder="请选择状态"
            allow-clear
            style="width: 120px"
          >
            <a-select-option :value="1">公开</a-select-option>
            <a-select-option :value="0">隐藏</a-select-option>
          </a-select>
        </a-form-item> -->
        
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
      :columns="columns"
      :data-source="questions"
      :loading="loading"
      :pagination="pagination"
      rowKey="id"
      @change="handleTableChange"
      :scroll="{ x: true }"
    >
      <template #footer>
        <div>共计{{ pagination.total }}条数据</div>
      </template>
    </a-table>
    
    <EditQuestionDrawer
      v-model:visible="editVisible"
      :record="currentRecord"
      @submit="handleSubmit"
    />
  </div>
</template>
  
<script setup>
import { h, ref, onMounted } from 'vue'
import { message, Modal, Badge } from 'ant-design-vue'
import { 
  EditOutlined, 
  DeleteFilled, 
  SearchOutlined,
  RedoOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
import EditQuestionDrawer from '@/components/UserCenter/EditQuestionDrawer.vue'

import {
  searchByKeywords,
  listByUsername,
  deleteQuestion,
  updateQuestion,
  // listPostedByUsername,
  // listNotPostedByUsername
} from '@/assets/js/request/QuestionAPI.js'

import { useRouter } from 'vue-router';

const router = useRouter(); // 全局变量


// 状态与数据
const questions = ref([])
const loading = ref(false)
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
})

// 搜索表单
const searchForm = ref({
  // username: '',
  titleKeyword: '',
  // status: undefined
})

// 添加状态控制
const editVisible = ref(false)
const currentRecord = ref({})

// 处理提交
const handleSubmit = async (formData) => {
  console.log('收到表单数据：', formData)
  try {
    await updateQuestion(formData)
    loadData()
  } catch (error) {
    message.error('更新失败: ' + (error?.message || '未知错误'))
  }
}

// 根据搜索条件选择合适的API
// const getApiMethod = () => {
//   const { titleKeyword } = searchForm.value
  
//   // 1. 标题关键字搜索（优先级最高）
//   if (titleKeyword) {
//     return (params) => searchByKeywords({
//       keywords: titleKeyword,
//       page: params.page,
//       rows: params.pageSize
//     })
//   }
  // 2. 状态搜索
  // if (status !== undefined) {
  //   if (status === 1) {
  //     return (params) => listPostedByUsername({
  //       username,
  //       page: params.page,
  //       pageSize: params.pageSize
  //     })
  //   } else {
  //     return (params) => listNotPostedByUsername({
  //       username,
  //       page: params.page,
  //       pageSize: params.pageSize
  //     })
  //   }
  // }
  
  // if (username) {
  //   // 3. 用户名搜索（默认）
  //   return (params) => listByUsername({
  //     username,
  //     page: params.page,
  //     pageSize: params.pageSize
  //   })
  // }
// }

// 加载数据
const loadData = async (params = {}) => {
  loading.value = true
  try {
    // 获取当前分页参数
    const pageParams = {
      page: pagination.value.current,
      pageSize: pagination.value.pageSize,
      ...params
    }
    
    // 根据搜索条件选择API方法
    // const apiMethod = getApiMethod()
    
    // 调用API
    // const res = await apiMethod(pageParams)

    if (searchForm.value.titleKeyword) {
      const res = await searchByKeywords({
        keywords: searchForm.value.titleKeyword,
        page: pageParams.page,
        rows: pageParams.pageSize
      })
      // 处理响应数据（根据实际API响应结构调整）
      console.log(res)
      questions.value = res || []
      pagination.value.total = res.length || 0
    }
    else {
      const res = await listByUsername({
        page: pageParams.page,
        pageSize: pageParams.pageSize,
        includeDeleted: 1
      })
      console.log(res)
      questions.value = res.content || []
      pagination.value.total = res.totalElements || 0

    }
  } catch (error) {
    message.error('加载失败: ' + error.message)
    // questions.value = [
    //   {
    //     id: 1,
    //     title: 'Vue 中的响应式原理？',
    //     userId: 'user123',
    //     isPosted: 1,
    //     answerCount: 5,
    //     viewCount: 120,
    //     updateTime: '2024-05-10 12:34:56'
    //   },
    //   {
    //     id: 2,
    //     title: 'Ant Design Vue 如何集成？',
    //     userId: 'dev_user',
    //     isPosted: 0,
    //     answerCount: 2,
    //     viewCount: 45,
    //     updateTime: '2024-05-12 08:20:10'
    //   }
    // ]
    // console.log(questions)
    // pagination.value.total = 2
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
    // username: '',
    titleKeyword: '',
    // status: undefined
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

const editQuestion = (record) => {
  // console.log('编辑问题', record.bindId)
  currentRecord.value = {
    bindId: record.bindId,
    title: record.title,
    content: record.content,
    isPosted: record.isPosted,
    isHidden: record.isHidden,
    // tagIds: record.tagIds || [] 
  }
  editVisible.value = true
}

const delete_question = async id => {
  Modal.confirm({
    title: '确认删除问题？',
    content: `您确定要删除ID为 ${id} 的问题吗？此操作不可恢复。`,
    okText: '删除',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      try {
        // 实际项目中调用API删除
        await deleteQuestion(id)
        loadData()
      } catch (error) {
        message.error(`删除失败: ${error.message}`)
      }
    }
  })
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  const d = new Date(isoString)
  // zh-CN 会渲染成 “2020/6/4 上午11:39:54”，可按需调整选项
  return d.toLocaleString('zh-CN', {
    year:   'numeric',
    month:  '2-digit',
    day:    '2-digit',
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-') // 把 “2020/06/04” 改成 “2020-06-04”
}


onMounted(() => {
  const saved = localStorage.getItem('question-search-state')
  console.log(saved)
  if (saved) {
    const state = JSON.parse(saved)
    searchForm.value = state.searchForm
    pagination.value = state.pagination
    localStorage.removeItem('question-search-state')
    loadData()
  } else {
    loadData()
  }
})

const lineHeight = 22 // px，根据实际字体设置
const maxLinesDefault = 2
const maxLinesOnHover = 6

const columns = [
  {
    title: 'ID',
    dataIndex: 'bindId',
    sorter: false,
    width: '8%',
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: '15%',
    // ellipsis: true,
    customRender: ({ record }) =>
    h('div', {
      style: {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3,
        overflow: 'hidden',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        maxWidth: '200px',
        minWidth: '120px',
        transition: 'all 0.3s',
        cursor: 'pointer',
        overflow: 'hidden',
        lineHeight: `${lineHeight}px`,
        maxHeight: `${lineHeight * maxLinesDefault}px`,
      },
      onMouseenter: (e) => {
        e.currentTarget.style.WebkitLineClamp = maxLinesOnHover;
        e.currentTarget.style.maxHeight = `${lineHeight * maxLinesOnHover}px`; // 最多6行
      },
      onMouseleave: (e) => {
        e.currentTarget.style.WebkitLineClamp = maxLinesDefault;
        e.currentTarget.style.maxHeight = `${lineHeight * maxLinesOnHover}px`;
      }
    }, record.title)
  },
  {
    title: '用户名',
    dataIndex: 'userId',
    // ellipsis: true,
    width: '8%',
  },
  {
    title: '状态',
    dataIndex: 'isPosted',
    key: 'status',
    width: '8%',
    align: 'left',
    customRender: ({ record }) => {
      const { isDeleted, isPosted, isHidden } = record

      // 根据优先级依次判断
      let statusText = ''
      let badgeStatus = ''

      if (isDeleted === 1 || isDeleted === true) {
        // 1 * * => 删除
        statusText = '删除'
        badgeStatus = 'error'
      } else if (isPosted === 1 || isPosted === true) {
        // 此时 isDeleted==0
        if (isHidden === 1 || isHidden === true) {
          // 0 1 1 => 隐藏
          statusText = '隐藏'
          badgeStatus = 'warning'
        } else {
          // 0 1 0 => 发布
          statusText = '发布'
          badgeStatus = 'success'
        }
      } else {
        // 此时 isDeleted==0, isPosted==0
        if (isHidden === 1 || isHidden === true) {
          // 0 0 1 => 隐藏
          statusText = '隐藏'
          badgeStatus = 'warning'
        } else {
          // 0 0 0 => 草稿
          statusText = '草稿'
          badgeStatus = 'default'
        }
      }

      return h(
        'span',
        { style: { display: 'inline-flex', alignItems: 'center', minWidth: '50px' } },
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
  {
    title: '回答数',
    dataIndex: 'answerCount',
    sorter: false,
    width: '8%',
    responsive: ['lg'],
    customRender: ({ record }) =>
    h('div', {
      style: {
        minWidth: '50px',
      }
    }, record.answerCount)
  },
  {
    title: '浏览量',
    dataIndex: 'viewCount',
    sorter: false,
    width: '8%',
    responsive: ['lg'],
    customRender: ({ record }) =>
    h('div', {
      style: {
        minWidth: '50px',
      }
    }, record.viewCount)
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    sorter: false,
    width: '8%',
    customRender: ({ record }) =>
    h('div', {
      style: {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        overflow: 'hidden',
        whiteSpace: 'normal',
        maxWidth: '200px',
        minWidth: '80px',
      }
    }, formatDate(record.updateTime))
    // ellipsis: true,
  },
  {
    title: '点赞量',
    dataIndex: 'likeCount',
    sorter: false,
    width: '8%',
    responsive: ['lg'],
    customRender: ({ record }) =>
    h('div', {
      style: {
        minWidth: '50px',
      }
    }, record.likeCount)
  },
  {
    title: '点踩量',
    dataIndex: 'dislikeCount',
    sorter: false,
    width: '8%',
    responsive: ['lg'],
    customRender: ({ record }) =>
    h('div', {
      style: {
        minWidth: '50px',
      }
    }, record.dislikeCount)
  },
  // 操作列，删除仅在未删除时显示
  { title: '操作', key: 'actions', width: '12%',
    customRender: ({ record }) => {
      const { isDeleted } = record
      const actions = []
      // 编辑操作
      if (!isDeleted) {
      actions.push(
        h('a', { onClick: () => editQuestion(record), 
          style: { cursor: 'pointer', color: '#1677ff', whiteSpace: 'nowrap',display: 'flex', marginRight: '10px', } }, 
          [ h(EditOutlined, { style: { marginRight: '5px' } }), '编辑' ]),
        h('span', { style: { display: 'inline-block', width: '1px', height: '1.2em', backgroundColor: '#e0e0e0', marginRight: '10px'} })
      )
      // 删除操作，仅当未删除
        actions.push(
          h('a', { onClick: () => delete_question(record.bindId), 
            style: { cursor: 'pointer', color: 'red', whiteSpace: 'nowrap',display: 'flex', marginRight: '10px',  } }, 
            [ h(DeleteFilled, { style: { marginRight: '5px' } }), '删除' ]),
          h('span', { style: { display: 'inline-block', width: '1px', height: '1.2em', backgroundColor: '#e0e0e0', marginRight: '10px'} })
        )
      }
      // 查看回答
      actions.push(
        h('a', { onClick: () => {
          // 存储数据到 localStorage
          localStorage.setItem('question-search-state', JSON.stringify({
            searchForm: searchForm.value,
            pagination: pagination.value,
          }))

          // 然后跳转
          router.push({
            name: 'answer-management',
            query: {
              questionId: record.bindId,
              questionTitle: record.title
            }
          })
        }, 
        style: { cursor: 'pointer', color: '#52c41a', display: 'flex',flexBasis: '100%',} }, 
        [ h(EyeOutlined, { style: { marginRight: '5px' } }), '查看所有回答' ])
      )
      return h('div', { 
        style: { minWidth: '120px',display: 'flex', 
        alignItems: 'center', rowGap: '0px',
        flexWrap: 'wrap', // ✅ 启用换行
      } }, actions)
  }},
];

// columns.forEach(col => {
//   col.customCell = () => ({
//     style: {
//       overflow: 'hidden',
//       textOverflow: 'ellipsis',
//       whiteSpace: 'normal',
//       wordBreak: 'break-word',
//       padding: '10px 20px'
//     }
//   });
// });

</script>

<style scoped>
.question-management {
  padding: 20px 24px;
}

/* 优化搜索表单间距 */
.ant-form-item {
  margin-bottom: 0;
}

/* 设置表单项的行间距 */
.form-item-inline {
  margin-bottom: 16px;
}

/* 修改操作按钮的样式，使其在空间足够时不换行 */
.form-actions-inline {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  /* margin-top: 8px; */
  margin-left: auto;
}
/* 覆盖表头单元格的上下左右内边距 */
:deep(.ant-table-thead > tr > th) {
  padding: 10px 20px !important;
}
</style>