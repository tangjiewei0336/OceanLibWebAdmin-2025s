<template>
  <!-- 用户信息管理 头部 -->
  <a-page-header title="用户信息管理">
    <!-- 卡片形式的多字段搜索表单 -->
    <a-card style="margin-bottom: 16px">
      <a-form
        layout="inline"
        :model="searchParams"
        @finish="handleSearch"
        style="display: flex; flex-wrap: wrap;"
      >
        <!-- 多字段：用户名、昵称、真实姓名、学院、专业 -->
        <a-form-item label="用户名" class="form-item-inline">
          <a-input
            v-model:value="searchParams.username"
            placeholder="请输入用户名"
            allow-clear
            style="width: 180px"
          />
        </a-form-item>

        <a-form-item label="昵称" class="form-item-inline">
          <a-input
            v-model:value="searchParams.nickname"
            placeholder="请输入昵称"
            allow-clear
            style="width: 180px"
          />
        </a-form-item>

        <a-form-item label="真实姓名" class="form-item-inline">
          <a-input
            v-model:value="searchParams.realname"
            placeholder="请输入真实姓名"
            allow-clear
            style="width: 180px"
          />
        </a-form-item>

        <a-form-item label="学院" class="form-item-inline">
          <a-input
            v-model:value="searchParams.college"
            placeholder="请输入学院"
            allow-clear
            style="width: 180px"
          />
        </a-form-item>

        <a-form-item label="专业" class="form-item-inline">
          <a-input
            v-model:value="searchParams.major"
            placeholder="请输入专业"
            allow-clear
            style="width: 180px"
          />
        </a-form-item>

        <!-- 操作按钮，强制换行并右对齐 -->
        <a-form-item class="form-actions-inline">
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
          >
            <template #icon>
              <SearchOutlined />
            </template>
            查询
          </a-button>
          <a-button
            style="margin-left: 8px"
            @click="resetForm"
          >
            <template #icon>
              <RedoOutlined />
            </template>
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 用户列表表格（列文本左对齐） -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ x: 'max-content' }"
    >
      <template #footer>
        <div>共计 {{ dataSource.length }} 条数据</div>
      </template>
    </a-table>
  </a-page-header>

  <!-- 用户详情弹窗 -->
  <UserDetailModal
    v-if="currentUser"
    :user-data="currentUser"
    v-model:visible="detailVisible"
    @user-updated="onUserUpdated"
  />
</template>

<script setup>
import { h } from 'vue';
import { defineComponent, ref, onMounted } from 'vue';
import { Tag, Badge } from 'ant-design-vue';
import { Modal  } from 'ant-design-vue';
import { 
  UserOutlined, 
  CrownOutlined, 
  StarOutlined,
  StarFilled,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue';
import { SearchOutlined, EyeOutlined, DeleteFilled, SmileOutlined } from '@ant-design/icons-vue';
import { RedoOutlined } from '@ant-design/icons-vue';

import UserDetailModal from '@/components/UserCenter/UserDetailModal.vue';
// API
import { getManageInfo, update, banUser } from '@/assets/js/request/UserInfoAPI.js';

const aTag = Tag; // 获取组件引用
// 添加状态控制
const detailVisible = ref(false);
const currentUser = ref(null);

const dataSource = ref([]);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 50, // 从后端获取总条数
});
const searchParams = ref({ username: "", nickname: "", realname: "", college: "", major: "" }); // 搜索参数
const loading = ref(false);

const fetchUserData = async () => {
  try {
    loading.value = true;
    const pageNum = pagination.value.current;
    const pageSize = pagination.value.pageSize;
    const response = await getManageInfo(searchParams.value, pageSize, pageNum);
    let current_usersInfo = localStorage.getItem('current_usersInfo');

    if (current_usersInfo != undefined) {
      current_usersInfo = JSON.parse(current_usersInfo);
      dataSource.value = current_usersInfo.records;
      pagination.value.total = current_usersInfo.total;
    }
  } catch (error) {
    console.error('获取用户数据失败', error);
  } finally {
    loading.value = false;
  }
};

// 父组件脚本部分
const onUserUpdated = (updatedUser) => {
  // fetchUserData();
  const idx = dataSource.value.findIndex(u => u.username === updatedUser.username);
  if (idx !== -1) {
    dataSource.value.splice(idx, 1, updatedUser);
  }
  // 2) 更新当前详情
  currentUser.value = updatedUser;
  // 3) 关闭弹窗
  // detailVisible.value = false;
  // 方案 B：重新调用 fetchUserData()，刷新整张表
  // fetchUserData();
};


// 处理分页变化
const handleTableChange = (newPagination) => {
  pagination.value.current = newPagination.current;
  pagination.value.pageSize = newPagination.pageSize;
  fetchUserData();
};

// 处理查询
const handleSearch = () => {
  pagination.value.current = 1; // 搜索后从第一页开始
  fetchUserData();
};

// 处理重置
const resetForm = () => {
  searchParams.value = { username: "", nickname: "", realname: "", college: "", major: "" };
  handleSearch();
};

onMounted(() => {
  fetchUserData();
});

const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: '12%',
    align: 'left'
  },
  {
    title: '学号',
    dataIndex: 'studentID',
    key: 'studentID',
    width: '12%',
    align: 'left',
    ellipsis: true,
    customRender: ({ text }) => {
      return h('div', {
        style: {
          maxWidth: '100px',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, text);
    }
  },
  {
    title: '身份',
    dataIndex: 'role',
    key: 'role',
    width: '10%',
    align: 'left',
    customRender: ({ text }) => {
      // 使用 AntD 的图标和红蓝配色
      let icon = null;
      let label = '';
      let color = '';

      if (text === 'SUPERADMIN') {
        icon = h(CrownOutlined, { style: { marginRight: '0px' } });
        label = '超级管理员';
        color = '#cd201f';
      } else if (text === 'ADMIN') {
        icon = h(StarOutlined, { style: { marginRight: '0px' } });
        label = '管理员';
        color = '#cd201f';
      } else {
        icon = h(UserOutlined, { style: { marginRight: '0px' } });
        label = '用户';
        color = '#108ee9';
      }

      return h(
        Tag,
        { color },
        {
          default: () => [
            icon,
            h('span', label)
          ]
        }
      );
    }
  },
  // {
  //   title: '身份',
  //   dataIndex: 'role',
  //   key: 'role',
  //   width: '12%',
  //   align: 'left',
  //   customRender: ({ text }) => {
  //     let icon = null;
  //     let label = '';
  //     let colorStart = '';
  //     let colorEnd = '';
  //     let textColor = '';
  //     let iconColor = '';

  //     if (text === 'SUPERADMIN') {
  //       icon = h(CrownOutlined, { style: { marginRight: '0px', fontSize: '16px', color: '#fff' } });
  //       label = '超级管理员';
  //       colorStart = '#8e44ad';
  //       colorEnd = '#c0399f';
  //       textColor = '#fff';
  //       iconColor = '#fff';
  //     } else if (text === 'ADMIN') {
  //       icon = h(StarFilled, { style: { marginRight: '0px', fontSize: '16px', color: '#fff' } });
  //       label = '管理员';
  //       colorStart = '#e74c3c';
  //       colorEnd = '#c0392b';
  //       textColor = '#fff';
  //       iconColor = '#fff';
  //     } else {
  //       icon = h(UserOutlined, { style: { marginRight: '0px', color: '#fff' } });
  //       label = '用户';
  //       colorStart = '#3498db';
  //       colorEnd = '#2c81ba';
  //       textColor = '#fff';
  //       iconColor = '#fff';
  //     }

  //     return h(
  //       Tag,
  //       {
  //         color: 'default',
  //         style: {
  //           display: 'inline-flex',
  //           alignItems: 'center',
  //           padding: '5px 10px',
  //           borderRadius: '20px',
  //           background: `linear-gradient(45deg, ${colorStart}, ${colorEnd})`,
  //           color: textColor,
  //           boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
  //           fontWeight: 'bold',
  //           transition: 'all 0.3s ease'
  //         }
  //       },
  //       {
  //         default: () => [
  //           icon,
  //           h('span', { style: { color: textColor } }, label)
  //         ]
  //       }
  //     );
  //   }
  // },
  {
    title: '账号状态',
    dataIndex: 'isValid',
    key: 'isValid',
    width: '12%',
    align: 'left',
    customRender: ({ text }) => {
      const isValid = text === 1 || text === '1';
      return h(
        'span',
        { style: { display: 'inline-flex', alignItems: 'center' } },
        [
          // 红色或绿色小圆点
          h(Badge, {
            status: isValid ? 'success' : 'error',
            style: { marginRight: '0px' }
          }),
          // 文本
          isValid ? '正常' : '禁用'
        ]
      );
    }
  },
  {
    title: '真名',
    dataIndex: 'realname',
    key: 'realname',
    width: '12%',
    align: 'left'
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    width: '16%',
    align: 'left'
  },
  {
    title: '操作',
    key: 'action',
    align: 'left',
    customRender: ({ record }) => {
      return h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }
        },
        [
          h(
            'a',
            {
              onClick: () => {
                currentUser.value = record;
                detailVisible.value = true;
              },
              style: {
                cursor: 'pointer',
                color: '#1677ff'
              }
            },
            [
              h(EyeOutlined, { style: { marginRight: '5px' } }),
              '查看详细信息'
            ]
          ),
          h('span', {
            style: {
              display: 'inline-block',
              width: '1px',
              height: '1.2em',
              backgroundColor: '#f0f0f0',
              verticalAlign: 'middle',
            }
          }),
          h('a', {
            onClick: () => {
              const isActive = record.isValid === -1;
              const modalContent = isActive
                ? `确认激活用户：${record.username}？`
                : `确认封禁用户：${record.username}？`;
              Modal.confirm({
                title: isActive ? '确认激活该用户吗？' : '确认封禁该用户吗？',
                content: `用户名：${record.username}`,
                okText: '确定',
                cancelText: '取消',
                onOk: async () => {
                  const res = isActive
                  ? await update(record.username, { isValid: 1 })  // 激活用户
                  : await update(record.username, { isValid: -1 });  // 封禁用户
                  if (res) {
                    fetchUserData();
                  }
                },
              });
            },
            style: {
              cursor: 'pointer',
              color: record.isValid === -1 ? 'green':'red',
            }
            },
            [
              h(record.isValid === -1 ? SmileOutlined : DeleteFilled, { style: { marginRight: '5px'} }), // 垃圾桶图标
              record.isValid === -1 ? '激活用户' : '封禁用户'
            ]
          )
        ]
      );
    }
  }
];

columns.forEach(col => {
  col.customCell = () => ({
    style: {
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      padding: '10px 20px'
    }
  });
});
</script>

<style scoped>
.custom-search-form {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.form-item {
  margin-bottom: 0;
}

.form-item :deep(.ant-form-item-label) {
  text-align: left;
  padding-right: 8px;
}

.form-item :deep(.ant-form-item-label > label) {
  color: #64748b;
  font-weight: 500;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.action-button:hover {
  transform: translateY(-1px);
}

:deep(.ant-input:focus),
:deep(.ant-input-focused) {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

@media (max-width: 768px) {
  .form-actions {
    justify-content: center;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }
}
/* 设置表单项的行间距 */
.form-item-inline {
  margin-bottom: 16px;
  flex: 0 0 auto;
}

/* 修改操作按钮的样式，使其在空间足够时不换行 */
.form-actions-inline {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  margin-left: auto;
}

/* 添加表单容器样式，确保flex布局正确 */
:deep(.ant-form) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}
/* 覆盖表头单元格的上下左右内边距 */
:deep(.ant-table-thead > tr > th) {
  padding: 10px 20px !important;
}
</style>