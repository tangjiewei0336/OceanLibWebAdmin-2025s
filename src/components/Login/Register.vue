<style lang="less">
.login .ant-modal-content {
  padding: 0px !important;
}
</style>
<template>
  <Modal v-model:open="open" :footer="null" :bodyStyle="{ padding: '0px' }" wrapClassName="login" width="800px" :destroyOnClose="true">
    <Flex style="height: 500px">
      <img src="@/assets/images/login.png" style="height: 500px" />
      <Flex justify="flex-start" style="width: 100%; padding: 0px 30px; margin-top: 40px; overflow-y: scroll" vertical gap="middle">
        <TypographyTitle :level="3">用户预注册</TypographyTitle>
        <Alert show-icon type="warning">
          <template #message> 预注册：<b>您的账号将在经过任课教师审核后激活，填写信息错误将影响注册。</b>请小组组长务必选择组长身份并填写队伍信息。 </template>
        </Alert>
        <Form :model="formState" name="normal_login" class="login-form" @finish="onFinish" @finishFailed="onFinishFailed" v-if="!successReg">
          <FormItem
            name="username"
            :rules="[
              { required: true, message: '请输入您的学号' },
              {
                min: 10,
                max: 10,
                message: '学号长度必须为10位',
              },
            ]"
            has-feedback
          >
            <Input v-model:value="formState.username" placeholder="学号" size="middle">
              <template #prefix>
                <FontAwesomeIcon :icon="['far', 'user']" />
              </template>
            </Input>
          </FormItem>

          <FormItem name="studentName" :rules="[{ required: true, message: '请输入您的学生姓名' }]" has-feedback>
            <Input v-model:value="formState.studentName" placeholder="学生姓名" size="middle">
              <template #prefix>
                <FontAwesomeIcon :icon="['far', 'user']" />
              </template>
            </Input>
          </FormItem>

          <FormItem
            name="password"
            :rules="[
              { required: true, message: '请输入您的账户密码' },
              {
                type: 'string',
                pattern: /^(?=.*[a-z])(?=.*[0-9]).+$/,
                min: 8,
                message: '密码应至少包含字母和数字，且长度不小于8位',
              },
            ]"
            has-feedback
          >
            <InputPassword v-model:value="formState.password" placeholder="密码" size="middle">
              <template #prefix>
                <FontAwesomeIcon :icon="['far', 'lock']" />
              </template>
            </InputPassword>
          </FormItem>

          <Flex justify="space-between" align="center" style="margin-bottom: 5px"
            ><span>是否作为小组组长组建团队:</span>
            <FormItem name="isTeamLeader" no-style>
              <Switch v-model:checked="formState.isTeamLeader" />
            </FormItem>
          </Flex>

          <FormItem name="groupName" :rules="[{ required: true, message: '请输入小组组名' }]" has-feedback v-if="formState.isTeamLeader">
            <Input v-model:value="formState.groupName" placeholder="小组组名" size="middle"> </Input>
          </FormItem>

          <FormItem name="groupDescription" v-if="formState.isTeamLeader">
            <Textarea v-model:value="formState.groupDescription" placeholder="小组描述" :rows="2"></Textarea>
          </FormItem>

          <Flex justify="space-between" vertical>
            <FormItem
              name="agreeServiceAgreement"
              :rules="[
                {
                  type: 'enum',
                  enum: [true],
                  message: '请阅读并同意用户协议',
                },
              ]"
            >
              <Checkbox v-model:checked="formState.agreeServiceAgreement">
                我已阅读并同意
                <TypographyLink @click="serviceAgreement.openModal()"> 用户协议 </TypographyLink>
                <ServiceAgreement ref="serviceAgreement" />
              </Checkbox>
            </FormItem>
            <FormItem>
              <Button type="primary" html-type="submit" style="width: 100%"> 注册账户 </Button>
            </FormItem>
          </Flex>
        </Form>
        <Result
          v-else
          status="success"
          title="您已成功预注册账户"
          sub-title="系统管理员将尽快审核您的信息。在审核成功前账户处于封禁状态，请耐心等待管理员处理，切勿反复注册或找回密码！"
        >
          <template #extra>
            <Button type="primary" @click="open = false">关闭页面</Button>
          </template>
        </Result>
      </Flex>
    </Flex>
  </Modal>
</template>

<script setup>
import {
  Alert,
  Button,
  Flex,
  Modal,
  TypographyTitle,
  Form,
  Switch,
  Input,
  Divider,
  InputPassword,
  TypographyLink,
  Checkbox,
  Textarea,
  Result,
} from 'ant-design-vue';
import ServiceAgreement from '@/components/base/common/ServiceAgreement.vue';

const FormItem = Form.Item;
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// API
import { preRegister } from '@/assets/js/request/UserInfoAPI.js';

import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';

const serviceAgreement = ref();

const formState = reactive({
  username: '',
  password: '',
  studentName: '',
  isTeamLeader: false,
  groupName: '',
  groupDescription: '',
  agreeServiceAgreement: false,
});

const successReg = ref(false);

const onFinish = async (values) => {
  console.log(values);
  let result = await preRegister(values.username, values.password, values.studentName, values.isTeamLeader, values.groupName, values.groupDescription);
  if (result.data.state == 'SUCCESS') {
    successReg.value = true;
    message.success('已成功注册，请等待管理员审核！');
  } else {
    if (result.data.code == '-3') {
      message.error('用户名已经注册，如确未注册账户请联系管理员处理，否则请自助找回账户密码！');
    } else if (result.data.code == '-2') {
      message.error('用户名已经注册，目前账户登录已被封禁，请等待管理员处理！切勿反复注册账户或找回密码，如确未注册账户请联系管理员处理！');
    } else if (result.data.code == '-4') {
      message.error('小组组名重复，请更换新的组名！');
    }
  }
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const emit = defineEmits(['onDelete']);

const open = ref(false);

const openModal = () => {
  open.value = true;
};

defineExpose({
  openModal,
});
</script>

<style></style>