<template>
  <!-- <PlatformNav :selectedKey="['3']">
    <template #content> -->
      <!-- <a-card title="用户管理"> -->
        <!-- 查询表单 -->
        <a-page-header
        :title="'用户信息管理'"
        >
          <!-- 查询表单 -->
          <a-form
            layout="inline"
            :model="searchParams"
            class="custom-search-form"
            :label-col="{ xs: 24, sm: 8, md: 6, lg: 6 }"
            :wrapper-col="{ xs: 24, sm: 16, md: 18, lg: 18 }"
          >
            <a-row :gutter="[24, 16]" class="form-row">
              <!-- 第一行 -->
              <a-col :xs="24" :sm="12" :md="8" :lg="6">
                <a-form-item label="用户名" class="form-item">
                  <a-input 
                    v-model:value="searchParams.username" 
                    placeholder="请输入用户名"
                    allow-clear
                  />
                </a-form-item>
              </a-col>

              <a-col :xs="24" :sm="12" :md="8" :lg="6">
                <a-form-item label="昵称" class="form-item">
                  <a-input 
                    v-model:value="searchParams.nickname" 
                    placeholder="请输入昵称"
                    allow-clear
                  />
                </a-form-item>
              </a-col>

              <a-col :xs="24" :sm="12" :md="8" :lg="6">
                <a-form-item label="真实姓名" class="form-item">
                  <a-input 
                    v-model:value="searchParams.realname" 
                    placeholder="请输入真实姓名"
                    allow-clear
                  />
                </a-form-item>
              </a-col>

              <!-- 第二行 -->
              <a-col :xs="24" :sm="12" :md="8" :lg="6">
                <a-form-item label="学院" class="form-item">
                  <a-input 
                    v-model:value="searchParams.college" 
                    placeholder="请输入学院"
                    allow-clear
                  />
                </a-form-item>
              </a-col>

              <a-col :xs="24" :sm="12" :md="8" :lg="6">
                <a-form-item label="专业" class="form-item">
                  <a-input 
                    v-model:value="searchParams.major" 
                    placeholder="请输入专业"
                    allow-clear
                  />
                </a-form-item>
              </a-col>

              <!-- 操作按钮 -->
              <a-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="form-actions">
                  <a-button 
                    type="primary" 
                    @click="handleSearch"
                    class="action-button"
                    style="margin-right: 12px"
                  >
                    <SearchOutlined style="margin-right: 0px;"/>
                    查询
                  </a-button>
                  <a-button 
                    @click="resetForm"
                    class="action-button"
                    style="margin-right: 12px"
                  >
                    <RedoOutlined style="margin-right: 0px;" />
                    重置
                  </a-button>
                </div>
              </a-col>
            </a-row>
          </a-form>
          <br>
          <a-table :columns="columns" :data-source="dataSource"
            :pagination="pagination" @change="handleTableChange"
            :scroll="{ x: 'max-content' }">
            <template #footer>
              <div>共计{{ dataSource.length }}条数据</div>
            </template>
        </a-table>
      </a-page-header>
      <a-modal 
        v-model:visible="detailVisible" 
        title="用户详情" 
        width="800px"
        :footer="null"
        >
        <UserDetailModal v-if="currentUser" :user-data="currentUser" />
      </a-modal>
    <!-- </template>
  </PlatformNav> -->
</template>
<script setup>
import { h } from 'vue';
import { defineComponent, ref, onMounted } from 'vue';
import PlatformNav from '@/components/base/nav/PlatformNav.vue';
import { Table } from 'ant-design-vue';
import { Tag } from 'ant-design-vue';
import { Modal, message, Switch  } from 'ant-design-vue';
import { UserOutlined, CrownOutlined, StarFilled } from '@ant-design/icons-vue';
import { SearchOutlined, EyeOutlined, DeleteFilled, DeleteOutlined } from '@ant-design/icons-vue';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';

import UserDetailModal from '@/components/UserCenter/UserDetailModal.vue';
import { RedoOutlined } from '@ant-design/icons-vue';
// API
import { getManageInfo, update, deleteUser } from '@/assets/js/request/UserInfoAPI.js';

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

const fetchUserData = async () => {
  try {
    const pageNum = pagination.value.current;
    const pageSize = pagination.value.pageSize;
    // let searchValue = searchText.value;
    const response = await getManageInfo(searchParams.value, pageNum, pageSize);
    console.log(response);
    let current_usersInfo = localStorage.getItem('current_usersInfo');
    if (current_usersInfo != undefined) {
      current_usersInfo = JSON.parse(current_usersInfo);
      dataSource.value = current_usersInfo;
      console.log(dataSource.value);
      pagination.value.total = current_usersInfo.length; // 需要加一个返回字段
    }
  } catch (error) {
    console.error('获取用户数据失败', error);
  }
};

// 处理分页变化
const handleTableChange = (newPagination) => {
  pagination.value.current = newPagination.current;
  pagination.value.pageSize = newPagination.pageSize;
  console.log(pagination.value.current);
  console.log(pagination.value.pageSize);
  // 重新获取数据
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
    title: '用户名', dataIndex: 'username', key: 'username',
    width: '12%',
    align: 'center',
  },
  {
    title: '学号', dataIndex: 'student_id', key: 'student_id',
    width: '12%',
    ellipsis: true,  // 超过最大宽度时显示省略号
    align: 'center',
    customRender: ({ text }) => {
      return h('div', {
        style: {
          maxWidth: '100px',  // 设置最大宽度，调整为你需要的宽度
          whiteSpace: 'normal',  // 允许换行
          wordWrap: 'break-word',  // 超过宽度时自动换行
          overflow: 'hidden',  // 防止溢出
          textOverflow: 'ellipsis'  // 处理溢出文本为省略号
        }
      }, text);
    }
  },
  {
    title: '身份', dataIndex: 'role', key: 'role',
    width: '12%',
    align: 'center',
    customRender: ({ text }) => {
      let icon = null;
      let label = '';
      let colorStart = '';
      let colorEnd = '';
      let textColor = '';
      let iconColor = '';

      if (text === 'SUPERADMIN') {
        icon = h(CrownOutlined, { style: { marginRight: '0px', fontSize: '16px', color: '#fff' } });
        label = '超级管理员';
        colorStart = '#8e44ad'; // 红色开始
        colorEnd = '#c0399f';   // 浅一些的橘红色
        textColor = '#fff';
        iconColor = '#fff';
      } else if (text === 'ADMIN') {
        icon = h(StarFilled, { style: { marginRight: '0px', fontSize: '16px', color: '#fff' } });
        label = '管理员';
        colorStart = '#e74c3c'; // 红色开始
        colorEnd = '#c0392b';   // 浅一些的橘红色
        textColor = '#fff';
        iconColor = '#fff';
      } else {
        icon = h(UserOutlined, { style: { marginRight: '0px', color: '#fff' } });
        label = '用户';
        colorStart = '#3498db'; // 蓝色开始
        colorEnd = '#2c81ba';   // 浅一些的天蓝色
        textColor = '#fff';
        iconColor = '#fff';
      }

      return h(
        Tag,
        {
          color: 'default',
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '5px 10px',
            borderRadius: '20px', // 圆角
            background: `linear-gradient(45deg, ${colorStart}, ${colorEnd})`,
            color: textColor,
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }
        },
        { 
          default: () => [
            icon, 
            h('span', { style: { color: textColor } }, label)
          ]
        }
      );
    }
  },
  {
    title: '账号状态', dataIndex: 'is_valid', key: 'is_valid',
    width: '12%',
    align: 'center',
    customRender: ({ text }) => {
      const isValid = text === 1 || text === '1';
      const label = isValid ? '正常' : '禁用';
      const bgColor = isValid ? 'linear-gradient(to right, #a8e063, #56ab2f)' : 'linear-gradient(to right, #f953c6, #b91d73)';
      const icon = isValid
        ? h('span', { style: { marginRight: '4px' } }, '✅')
        : h('span', { style: { marginRight: '4px' } }, '🚫');

      return h(
        'div',
        {
          style: { textAlign: 'center' }
        },
        [icon, label]
      );
    }
  },
  {
    title: '真名', dataIndex: 'realname', key: 'realname',
    width: '12%',
    align: 'center',
  },
  {
    title: '昵称', dataIndex: 'nickname', key: 'nickname',
    width: '12%',
    align: 'center',
  },
  {
    title: '操作', key: 'action',
    align: 'center',
    customRender: ({ record }) => {
      return h('div', { style: {justifyContent: 'center', display: 'flex', alignItems: 'center',gap: '12px', } }, [
        h('a', {
          onClick: () => {
            currentUser.value = record;
            detailVisible.value = true;
          },
          style: {
            cursor: 'pointer',
            color: '#1677ff',
            // textDecoration: 'underline'
          }
          },
          [
            h(EyeOutlined, { style: { marginRight: '5px' } }), // 放大镜图标
            '查看详细信息'
          ]
        ),

      ]);
    }
  },
];

// columns.forEach(col => {
//   col.customCell = () => ({
//     style: {
//       whiteSpace: 'normal',
//       wordBreak: 'break-word',
//     }
//   });
// });
columns.forEach(col => {
  col.customCell = () => ({
    style: {
      // display: 'inline-block',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
      wordBreak: 'break-word', 
      // WebkitLineClamp: 2,     // 显示最多2行（需结合 display: -webkit-box）
      // WebkitBoxOrient: 'vertical',
      // display: '-webkit-box',
      padding: '10px 20px',
    },
    align: 'center',
  });
});



</script>

<style scoped>

.custom-page-header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.custom-search-form {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.form-row {
  margin: -8px;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
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
  .custom-search-form {
    padding: 12px;
  }
  
  .form-actions {
    justify-content: center;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
