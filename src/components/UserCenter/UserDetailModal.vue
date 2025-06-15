<template>
  <a-modal
    v-model:open="isVisible"
    title="用户详情"
    :footer="null"
    :maskClosable="false"
    :keyboard="false"
    :focusTriggerAfterClose="false"
    :focusLock="true"
    :wrapClassName="'user-detail-modal'"
    :width="'70vw'"
    :bodyStyle="{ maxHeight: '80vh', overflow: 'auto' }"
    @cancel="handleClose"
  >
    <div ref="detailTop">
      <a-descriptions
        bordered
        :column="2"
        :label-style="{ width: '120px' }"
        :content-style="{ maxWidth: '100px', whiteSpace: 'normal', wordBreak: 'break-word' }"
      >
        <!-- 用户名（必有） -->
        <a-descriptions-item label="用户名">{{ userData.username }}</a-descriptions-item>

        <!-- 头像 -->
        <a-descriptions-item label="头像">
          <template v-if="!isEditing">
            <a-avatar
              :src="userData.avatar || ''"
              :size="64"
              shape="circle"
              style="border: 1px solid #eee; box-shadow: 0 0 4px rgba(0,0,0,0.1);"
            />
          </template>
          <template v-else>
            <a-upload
              accept="image/*"
              :show-upload-list="false"
              :before-upload="handleAvatarBeforeUpload"
            >
            <a-avatar :src="formState.avatar || ''" :size="64" style="cursor: pointer;">
              <UploadOutlined style="font-size: 24px; color: #1890ff" />
            </a-avatar>
            </a-upload>
          </template>
        </a-descriptions-item>

        <!-- 学号 -->
        <a-descriptions-item label="学号">
          <template v-if="!isEditing">{{ userData.studentID || '' }}</template>
          <template v-else>
            <a-input v-model:value="formState.studentID" />
          </template>
        </a-descriptions-item>

        <!-- 身份 -->
        <a-descriptions-item label="身份">
          <template v-if="!isEditing">
            {{
              userData.role === 'SUPERADMIN'
                ? '超级管理员'
                : userData.role === 'ADMIN'
                ? '管理员'
                : '用户'
            }}
          </template>
          <template v-else>
            <a-select v-model:value="formState.role" style="width: 120px">
              <a-select-option value="user">用户</a-select-option>
              <a-select-option value="ADMIN">管理员</a-select-option>
              <a-select-option value="SUPERADMIN">超级管理员</a-select-option>
            </a-select>
          </template>
        </a-descriptions-item>

        <!-- 昵称 -->
        <a-descriptions-item label="昵称">
          <template v-if="!isEditing">{{ userData.nickname || '' }}</template>
          <template v-else>
            <a-input v-model:value="formState.nickname" />
          </template>
        </a-descriptions-item>

        <!-- 账号状态 -->
        <a-descriptions-item label="账号状态">
          <template v-if="!isEditing">{{ userData.isValid === 1 ? '正常' : userData.isValid === -1 ? '禁用' : '' }}</template>
          <template v-else>
            <a-select v-model:value="formState.isValid" style="width: 120px">
              <a-select-option :value="1">正常</a-select-option>
              <a-select-option :value="-1">禁用</a-select-option>
            </a-select>
          </template>
        </a-descriptions-item>

        <!-- 真实姓名 -->
        <a-descriptions-item label="真实姓名">
          <template v-if="!isEditing">{{ userData.realname || '' }}</template>
          <template v-else>
            <a-input v-model:value="formState.realname" />
          </template>
        </a-descriptions-item>

        <!-- 密码：不显示原密码，仅在编辑状态可输入 -->
        <a-descriptions-item label="密码">
          <template v-if="!isEditing">
            <span>已隐藏</span>
          </template>
          <template v-else>
            <form @submit.prevent>
              <!-- 添加隐藏的用户名输入框 -->
              <input
                type="text"
                :value="userData.username"
                style="display: none"
                autocomplete="username"
              />
              <a-input
                v-model:value="formState.password"
                type="password"
                autocomplete="new-password"
                placeholder="留空则不修改密码"
              />
            </form>
          </template>
        </a-descriptions-item>


        <!-- 邮箱 -->
        <a-descriptions-item label="邮箱">
          <template v-if="!isEditing">{{ userData.email || '' }}</template>
          <template v-else>
            <a-input v-model:value="formState.email" />
          </template>
        </a-descriptions-item>

        <!-- 电话号码 -->
        <a-descriptions-item label="电话号码">
          <template v-if="!isEditing">{{ userData.phoneNum || '' }}</template>
          <template v-else>
            <a-input v-model:value="formState.phoneNum" />
          </template>
        </a-descriptions-item>

        <!-- 账号等级 -->
        <a-descriptions-item label="账号等级">
          <!-- <template v-if="!isEditing">{{ userData.level || '' }}</template>
          <template v-else>
            <a-input v-model:value="formState.level" />
          </template> -->
          {{ formState.level }}
        </a-descriptions-item>

        <!-- 注册时间（只读） -->
        <a-descriptions-item label="注册时间">
          {{ formatDate(userData.regDate) || '' }}
        </a-descriptions-item>

        <!-- 学院 -->
        <a-descriptions-item label="学院">
          <template v-if="!isEditing">{{ userData.userExtraEntity?.college || '' }}</template>
          <template v-else>
            <a-input v-model:value="formState.userExtraEntity.college" />
          </template>
        </a-descriptions-item>

        <!-- 专业 -->
        <a-descriptions-item label="专业">
          <template v-if="!isEditing">{{ userData.userExtraEntity?.major || '' }}</template>
          <template v-else>
            <a-input v-model:value="formState.userExtraEntity.major" />
          </template>
        </a-descriptions-item>

        <!-- 认证信息 -->
        <!-- <a-descriptions-item label="认证信息">
          <template v-if="!isEditing">{{ userData.certID || '' }}</template>
          <template v-else>
            <a-input v-model:value="formState.certID" />
          </template>
        </a-descriptions-item> -->
      </a-descriptions>

      <!-- 操作按钮区 -->
      <div style="text-align: right; margin-top: 16px; margin-right: 16px;">
        <template v-if="isEditing">
          <a-button type="primary" @click="handleUpdate">保存</a-button>
          <a-button @click="cancelEdit" style="margin-left: 8px;">取消</a-button>
        </template>
        <template v-else>
          <a-button type="primary" @click="startEdit">编辑</a-button>
        </template>
      </div>

      <!-- 附加信息 -->
      <div class="extra-info">
        <h3>附加信息</h3>
        <p class="inline-field">
          <strong>个性签名：</strong>
          <template v-if="!isEditing">{{ userData.userExtraEntity?.personalSignature || '' }}</template>
          <template v-else>
            <a-input
              v-model:value="formState.userExtraEntity.personalSignature"
            />
          </template>
        </p>
        <p><strong>总点赞量：</strong>{{ userData.userExtraEntity?.likeNumber ?? 0 }}</p>
        <p><strong>文章发表量：</strong>{{ userData.userExtraEntity?.fileCollectedNumber ?? 0 }}</p>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount, computed } from 'vue';
import { message } from "ant-design-vue";
import { update, uploadImage } from "@/assets/js/request/UserInfoAPI.js";
import { UploadOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["user-updated", "update:visible"]);

// 使用计算属性来处理 visible 的双向绑定
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const isEditing = ref(false);
const formState = ref({});
const initialData = ref({});
const detailTop = ref(null);

// 添加焦点管理
const modalRef = ref(null);
let previousActiveElement = null;

onMounted(() => {
  // 保存当前活动元素
  previousActiveElement = document.activeElement;
});

onBeforeUnmount(() => {
  // 恢复之前的焦点
  if (previousActiveElement) {
    previousActiveElement.focus();
  }
});

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

watch(
  () => props.userData,
  (newVal) => {
    formState.value = {
      ...newVal,
      avatar: newVal.avatar || "",
      password: "",
      userExtraEntity: {
        college: newVal.userExtraEntity?.college || "",
        major: newVal.userExtraEntity?.major || "",
        personalSignature: newVal.userExtraEntity?.personalSignature || "",
        likeNumber: newVal.userExtraEntity?.likeNumber ?? 0,
        fileCollectedNumber: newVal.userExtraEntity?.fileCollectedNumber ?? 0,
      },
    };
    initialData.value = {
      ...newVal,
      avatar: newVal.avatar || "",
      // 注意：初始密码肯定是空，因为我们并不展示原密码
      password: "",
      userExtraEntity: {
        college: newVal.userExtraEntity?.college || "",
        major: newVal.userExtraEntity?.major || "",
        personalSignature: newVal.userExtraEntity?.personalSignature || "",
        likeNumber: newVal.userExtraEntity?.likeNumber ?? 0,
        fileCollectedNumber: newVal.userExtraEntity?.fileCollectedNumber ?? 0,
      },
    };
    isEditing.value = false;
  },
  { immediate: true, deep: true }
);

const startEdit = () => {
  formState.value = {
    ...props.userData,
    password: "",
    userExtraEntity: {
      college: props.userData.userExtraEntity?.college || "",
      major: props.userData.userExtraEntity?.major || "",
      personalSignature: props.userData.userExtraEntity?.personalSignature || "",
      likeNumber: props.userData.userExtraEntity?.likeNumber ?? 0,
      fileCollectedNumber: props.userData.userExtraEntity?.fileCollectedNumber ?? 0,
    },
  };
  isEditing.value = true;
  nextTick(() => {
    detailTop.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
};

const cancelEdit = () => {
  isEditing.value = false;
};

// 上传头像之前手动调用自己的接口
async function handleAvatarBeforeUpload(file) {
  const url = await uploadImage(file);
  if (url) {
    formState.value.avatar = url;
  }
  return false; // 阻止 <a-upload> 自动上传
}

const handleUpdate = async () => {
  // 权限校验
  const currentUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  if (
    currentUserInfo.role !== "SUPERADMIN" &&
    initialData.value.role === "SUPERADMIN"
  ) {
    message.warning("您无权修改超级管理员的信息");
    return;
  }
  if (
    currentUserInfo.role !== "SUPERADMIN" &&
    formState.value.role === "SUPERADMIN"
  ) {
    message.error("您无权将用户角色设置为超级管理员");
    return;
  }

  // ====== 核心：只收集被修改过的字段 ======
  const delta = {};

  // 1. 比较顶层字段（不含 userExtraEntity）
  Object.keys(formState.value).forEach((key) => {
    if (key === "userExtraEntity") return; // 嵌套部分后面单独处理
    if (key === "password") {
      // 密码特殊处理：为空就不发；不为空就直接发
      if (formState.value.password && formState.value.password !== "") {
        delta.password = formState.value.password;
      }
      return;
    }
    if (key === "username") {
      // username 不可修改，后端接口通常用作 URL 一部分，就不放到 payload 里
      return;
    }
    if (key === "avatar") {
      // ① 如果 initialData.value.avatar 和 formState.value.avatar 都是 空字符串 或 都是 null/undefined，视为"没改"：
      const oldAvatar = initialData.value.avatar ?? "";
      const newAvatar = formState.value.avatar ?? "";
      if (newAvatar !== oldAvatar) {
        console.log(oldAvatar)
        console.log(newAvatar)
        delta.avatar = newAvatar;
      }
      return;
    }
    // 简单的原始值比较（如果是对象或数组等更复杂的类型，要做更深度的对比）
    if (formState.value[key] !== initialData.value[key]) {
      delta[key] = formState.value[key];
    }
  });

  // 2. 处理 userExtraEntity 里的字段（因为它本身是一个对象）
  const extraDelta = {};
  const formExtra = formState.value.userExtraEntity || {};
  const initExtra = initialData.value.userExtraEntity || {};
  Object.keys(formExtra).forEach((subKey) => {
    // 如果是 likeNumber 或 fileCollectedNumber 这种只读的，也可跳过。但这里假设都可以改。
    if (formExtra[subKey] !== initExtra[subKey]) {
      extraDelta[subKey] = formExtra[subKey];
    }
  });
  // 只有当确实有改动时，才把 userExtraEntity 发给后端
  if (Object.keys(extraDelta).length > 0) {
    delta.userExtraEntity = extraDelta;
  }

  // 如果除了 role/avatar/email/…都没变，delta 可能是空对象，就直接提示"未做任何修改"，或者不发请求也行：
  if (Object.keys(delta).length === 0) {
    message.info("您未对任何字段进行修改");
    return;
  }

  // ====== 最终把 delta 发给后端 ======
  try {
    const res = await update(props.userData.username, delta);
    if (res) {
      message.success("用户信息修改成功");
      console.log(res)
      isEditing.value = false;
      // 把更新后的用户数据回传给父组件
      // 通常后端返回的是完整的 user 对象，也可以在服务端 merge 之后再返回
      emit("user-updated", { ...res });
    }
  } catch (err) {
    console.error(err);
    message.error("更新失败，请稍后重试");
  }
};

// 处理关闭事件
const handleClose = () => {
  isVisible.value = false;
  if (isEditing.value) {
    isEditing.value = false;
  }
};

// 修改 onClose 为 handleClose
const onClose = handleClose;
</script>


<style scoped>
.user-detail-modal {
  /* 确保模态框内容可以正确获得焦点 */
  outline: none;
}

.user-detail-modal :deep(.ant-modal) {
  /* 设置模态框最大宽度 */
  max-width: 90vw;
}

.user-detail-modal :deep(.ant-modal-content) {
  /* 移除可能导致焦点问题的样式 */
  outline: none;
  /* 优化内容区域样式 */
  padding: 24px;
}

.user-detail-modal :deep(.ant-modal-body) {
  /* 优化内容区域样式 */
  padding: 0;
}

/* .user-detail-modal :deep(.ant-modal-wrap) { */
  /* 使用 inert 属性替代 aria-hidden */
  /* contain: strict; */
/* } */

/* 确保模态框背景不会获得焦点 */
/* .user-detail-modal :deep(.ant-modal-mask) {
  pointer-events: none;
} */

/* 确保模态框内容可以正常交互 */
.user-detail-modal :deep(.ant-modal-content) {
  pointer-events: auto;
}

/* 优化描述列表样式 */
.user-detail-modal :deep(.ant-descriptions) {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.user-detail-modal :deep(.ant-descriptions-item-label) {
  width: 140px;
  font-weight: 500;
  color: #1f2937;
}

/* .user-detail-modal :deep(.ant-descriptions-item-content) {
  color: #4b5563;
} */

/* 优化额外信息区域样式 */
.extra-info {
  margin-top: 24px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.extra-info h3 {
  margin-bottom: 16px;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.inline-field {
  display: flex;
  align-items: center;
  /* gap: 12px; */
  margin-bottom: 12px;
}

.inline-field strong {
  /* color: #4b5563; */
  /* min-width: 100px; */
  flex-shrink: 0;
}

.inline-field :deep(.ant-input) {
  width: 300px;
  flex-shrink: 0;
}

/* 响应式布局调整 */
@media (max-width: 768px) {
  .user-detail-modal :deep(.ant-modal) {
    max-width: 95vw;
  }
  
  .user-detail-modal :deep(.ant-descriptions-item-label) {
    width: 120px;
  }
}
</style>
