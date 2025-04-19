<template>
  <div class="user-detail-container">
    <!-- 编辑按钮 -->
    <div style="text-align: right; margin-bottom: 12px;">
      <a-button v-if="!isEditing" type="primary" @click="startEdit">编辑</a-button>
      <a-space v-else>
        <a-button type="primary" @click="handleUpdate">保存</a-button>
        <a-button @click="cancelEdit">取消</a-button>
      </a-space>
    </div>

    <a-descriptions bordered :column="2" :label-style="{ width: '120px' }"
      :content-style="{ maxWidth: '100px', whiteSpace: 'normal', wordBreak: 'break-word' }">
      <!-- 基本身份信息 -->
      <a-descriptions-item label="用户名">{{ userData.username }}</a-descriptions-item>
      <a-descriptions-item label="头像">
        <a-avatar 
          :src="userData.avatar" 
          :size="64" 
          style="border: 1px solid #eee; box-shadow: 0 0 4px rgba(0,0,0,0.1); border-radius: 8px;" 
        />
      </a-descriptions-item>
      <a-descriptions-item label="学号">
        <template v-if="!isEditing">{{ userData.student_id }}</template>
        <template v-else>
          <a-input v-model:value="formState.student_id" />
        </template>
      </a-descriptions-item>

      <a-descriptions-item label="身份">
        <template v-if="!isEditing">{{
            userData.role === 'superadmin'
              ? '超级管理员'
              : userData.role === 'admin'
              ? '管理员'
              : '用户'
          }}
        </template>
        <template v-else>
          <a-select v-model:value="formState.role" style="width: 120px">
            <a-select-option value="user">用户</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="superadmin">超级管理员</a-select-option>
          </a-select>
        </template>
      </a-descriptions-item>

      <a-descriptions-item label="昵称">
        <template v-if="!isEditing">{{ userData.nickname }}</template>
        <template v-else>
          <a-input v-model:value="formState.nickname" />
        </template>
      </a-descriptions-item>

      <a-descriptions-item label="账号状态">
        <template v-if="!isEditing">{{ userData.is_valid === 1 ? '正常' : '禁用' }}</template>
        <template v-else>
          <a-select v-model:value="formState.is_valid" style="width: 120px">
            <a-select-option :value='1'>正常</a-select-option>
            <a-select-option :value='0'>禁用</a-select-option>
          </a-select>
        </template>
      </a-descriptions-item>
      
      <a-descriptions-item label="真实姓名">
        <template v-if="!isEditing">{{ userData.realname }}</template>
        <template v-else>
          <a-input v-model:value="formState.realname" />
        </template>
      </a-descriptions-item>

      <a-descriptions-item label="密码">
        <template v-if="!isEditing">
          <div style="display: flex; align-items: center;">
            <span>{{ showPassword ? userData.password : '••••••' }}</span>
            <span style="margin-left: auto; cursor: pointer;">
              <EyeOutlined
                v-if="!showPassword"
                @click="showPassword = true"
              />
              <EyeInvisibleOutlined
                v-else
                @click="showPassword = false"
              />
            </span>
          </div>
        </template>

        <template v-else>
          <a-input
            v-model:value="formState.password"
            :type="showPassword ? 'text' : 'password'"
            style="width: 200px"
            :suffix="
              showPassword
                ? h(EyeInvisibleOutlined, { onClick: () => (showPassword = false), style: 'cursor: pointer' })
                : h(EyeOutlined, { onClick: () => (showPassword = true), style: 'cursor: pointer' })
            "
          />
        </template>
      </a-descriptions-item>



      <a-descriptions-item label="邮箱">
        <template v-if="!isEditing">{{ userData.email }}</template>
        <template v-else>
          <a-input v-model:value="formState.email" />
        </template>
      </a-descriptions-item>

      <a-descriptions-item label="电话号码">
        <template v-if="!isEditing">{{ userData.phone_num }}</template>
        <template v-else>
          <a-input v-model:value="formState.phone_num" />
        </template>
      </a-descriptions-item>

      <a-descriptions-item label="账号等级">
        <template v-if="!isEditing">{{ userData.level_grade }}</template>
        <template v-else>
          <a-input v-model:value="formState.level_grade" />
        </template>
      </a-descriptions-item>

      <a-descriptions-item label="注册时间">
        {{ userData.reg_date }}
      </a-descriptions-item>

      <a-descriptions-item label="学院">
        <template v-if="!isEditing">{{ userData.college }}</template>
        <template v-else>
          <a-input v-model:value="formState.college" />
        </template>
      </a-descriptions-item>

      <a-descriptions-item label="专业">
        <template v-if="!isEditing">{{ userData.major }}</template>
        <template v-else>
          <a-input v-model:value="formState.major" />
        </template>
      </a-descriptions-item>

      <a-descriptions-item label="认证信息">
        <template v-if="!isEditing">{{ userData.cert_id }}</template>
        <template v-else>
          <a-input v-model:value="formState.cert_id" />
        </template>
      </a-descriptions-item>
    </a-descriptions>


    <div class="extra-info">
      <h3>附加信息</h3>
      <p class="inline-field">
        <strong>个性签名：</strong>
        <!-- {{ userData.personal_signature || '暂无' }} -->
        <template v-if="!isEditing">{{ userData.personal_signature }}</template>
        <template v-else>
          <a-input v-model:value="formState.personal_signature" />
        </template>
      </p>
      <p><strong>总点赞量：</strong>{{ userData.like_num }}</p>
      <p><strong>文章发表量：</strong>{{ userData.file_collected_num }}</p>
    </div>
  </div>
</template>
  
<script setup>
import { ref, watch, h } from 'vue';
import { message } from 'ant-design-vue';
import { update } from '@/assets/js/request/UserInfoAPI.js';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue';


const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
});

const isEditing = ref(false);
const formState = ref({ ...props.userData });
const showPassword = ref(false);

const startEdit = () => {
  formState.value = { ...props.userData }; // 重新复制一份可编辑对象
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
};



const handleUpdate = async () => {
  const currentUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  if (currentUserInfo.role !== 'superadmin' && formState.value.role === 'superadmin') {
    message.error('您无权将用户角色设置为超级管理员');
    return;
  }

  const res = await update(props.userData.username, formState.value);
  if (res) {
    message.success('用户信息修改成功');
    isEditing.value = false;
    // 可选：emit 通知父组件刷新数据
  }
};

watch(
  () => props.userData,
  (newVal) => {
    formState.value = { ...newVal };
    isEditing.value = false;
  },
  { immediate: true, deep: true }
);

// defineProps({
//   userData: {
//     type: Object,
//     required: true
//   }
// });

</script>

<style scoped>
.user-detail-container {
  max-height: 60vh;
  overflow-y: auto;
  padding: 12px;
}

.extra-info {
  margin-top: 24px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
}

.extra-info h3 {
  margin-bottom: 12px;
}

.inline-field {
  display: flex;
  align-items: center;
  gap: 8px; /* 控制 label 与内容间的间距 */
}
.inline-field strong {
  white-space: nowrap; /* 防止 label 换行 */
}

</style>