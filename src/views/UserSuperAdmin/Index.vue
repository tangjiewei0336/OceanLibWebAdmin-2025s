<template>
  <TestingPlatformNav :selectedKey="['0']">
    <template #content>
      <!-- <a-card title="用户管理"> -->
        <!-- 查询表单 -->
        <a-form layout="inline" :model="searchParams">
          <a-row :gutter="[30, 16]">
            <a-col :span="6">
              <a-form-item label="用户名">
                <a-input v-model:value="searchParams.username" placeholder="请输入用户名" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="昵称">
                <a-input v-model:value="searchParams.nickname" placeholder="请输入昵称" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="真名">
                <a-input v-model:value="searchParams.realname" placeholder="请输入真实姓名" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="学院">
                <a-input v-model:value="searchParams.college" placeholder="请输入学院" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="专业">
                <a-input v-model:value="searchParams.major" placeholder="请输入专业" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row  style="margin-top: 16px;">
            <a-col :span="24" style="text-align: right">
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetForm">重置</a-button>
            </a-col>
          </a-row>
        </a-form>

        <a-table :columns="columns" :data-source="dataSource"
          :pagination="pagination" @change="handleTableChange">
          <template #title>
            <h3>用户信息表格</h3>
          </template>
          <template #footer>
            <div>共计{{ dataSource.length }}条数据</div>
          </template>
          <template #expandedRowRender="{ record }">
            <p><strong>电话：</strong>{{ record.phone_num }}</p>
            <p><strong>当前状态：</strong>{{ record.is_valid }}</p>
            <p><strong>注册时间：</strong>{{ record.reg_date }}</p>
            <p><strong>真名：</strong>{{ record.realname }}</p>
            <p><strong>头像：</strong>{{ record.avatar }}</p>
            <p><strong>等级：</strong>{{ record.level_grade }}</p>
            <p><strong>邮箱：</strong>{{ record.email }}</p>
            <p><strong>学院：</strong>{{ record.college }}</p>
            <p><strong>专业：</strong>{{ record.major }}</p>
            <p><strong>生日：</strong>{{ record.birthday }}</p>
            <p><strong>个性签名：</strong>{{ record.personal_signature }}</p>
            <p><strong>总点赞量：</strong>{{ record.like_num }}</p>
            <p><strong>文章发表量：</strong>{{ record.file_collected_num }}</p>
          </template>
        </a-table>

      
    </template>
  </TestingPlatformNav>
</template>
<script setup>
import { defineComponent, ref, onMounted } from 'vue';
import TestingPlatformNav from '@/components/base/nav/TestingPlatformNav.vue';
import { Table } from 'ant-design-vue';

// API
import { getManageInfo, update, deleteForSuperAdmin } from '@/assets/js/request/UserInfoAPI.js';




// const dataSource1 = ref([
//     {
//       key: '1',
//       username: '张三',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },
//     {
//       key: '2',
//       username: '李四',
//       age: 42,
//       address: '上海市普陀区金沙江路 1517 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },
//     {
//       key: '3',
//       username: '张三1',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },{
//       key: '4',
//       username: '张三2',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },{
//       key: '5',
//       username: '张三3',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },{
//       key: '6',
//       username: '张三4',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },{
//       key: '7',
//       username: '张三5',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },{
//       key: '8',
//       username: '张三6',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },{
//       key: '9',
//       username: '张三7',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },{
//       key: '10',
//       username: '张三8',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },{
//       key: '11',
//       username: '张三9',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },{
//       key: '12',
//       username: '张三10',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },{
//       key: '13',
//       username: '张三11',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },{
//       key: '14',
//       username: '张三12',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },{
//       key: '15',
//       username: '张三13',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//       password: '123456',
//     },{
//       key: '16',
//       username: '张三14',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//     },{
//       key: '17',
//       username: '张三15',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//       password: '123456',
//     },{
//       key: '18',
//       username: '张三16',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//       password: '123456',
//     },{
//       key: '19',
//       username: '张三17',
//       age: 32,
//       address: '上海市普陀区金沙江路 1518 弄',
//       email: 'zhangsan@example.com',
//       student_id: '13800000001',
//       description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
//       password: '123456',
//     },
//   ]);

// const pagination = ref({
//   current: 1,
//   pageSize: 3,
//   total: 19, // 从后端获取总条数
// });

// const paginatedData = ref([]);
// const updatePaginatedData = () => {
//   const start = (pagination.value.current - 1) * pagination.value.pageSize;
//   const end = start + pagination.value.pageSize;
//   paginatedData.value = dataSource1.value.slice(start, end);
// };

// // 处理分页变化
// const handleTableChange = (newPagination) => {
//   pagination.value.current = newPagination.current;
//   pagination.value.pageSize = newPagination.pageSize;
//   updatePaginatedData(); // 更新当前页数据
// };

// // 初始化第一页数据
// updatePaginatedData();

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
    let current_usersInfo = localStorage.getItem('current_usersInfo');
    if (current_usersInfo != undefined) {
      current_usersInfo = JSON.parse(current_usersInfo);
      dataSource.value = current_usersInfo;
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
  },
  {
    title: '昵称', dataIndex: 'nickname', key: 'nickname',
  },
  {
    title: '学生学号', dataIndex: 'student_id', key: 'student_id',
  },
  {
    title: '身份', dataIndex: 'role', key: 'role',
  },
];



</script>