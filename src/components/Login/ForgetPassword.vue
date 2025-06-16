<style lang="less">
.login .ant-modal-content {
    padding: 0px !important;
}
</style>
<template>
    <Modal v-model:open="open" :footer="null" :bodyStyle="{ padding: '0px' }" wrapClassName="login" width="800px" :destroyOnClose="true">
        <Flex style="height:500px">
            <img src="@/assets/images/login.png" style="height:500px" />
            <Flex justify="flex-start" style="width:100%; padding: 0px 30px; margin-top:40px; " vertical gap="middle">
                <TypographyTitle :level="3">找回密码</TypographyTitle>
                <Alert show-icon type="warning">
                    <template #message>
                        找回密码：<b>您需要登录校内邮箱查收密码重置链接，校内邮箱将默认为您的学号数字邮箱（与别名邮箱不冲突）。</b>如因意外无法登录校内邮箱，请联系管理员协助重置你的密码。
                    </template>
                </Alert>
                <Form :model="formState" name="forget_password" @finish="onFinish"
                    @finishFailed="onFinishFailed" v-if="!successSend">

                    <FormItem name="username" :rules="[{ required: true, message: '请输入您的学号' }]">
                        <Input v-model:value="formState.username" placeholder="学号" size="middle">
                        <template #prefix>
                            <FontAwesomeIcon :icon="['far', 'envelope']" />
                        </template>
                        <template #suffix>
                            @bit.edu.cn
                        </template>
                        </Input>
                    </FormItem>


                    <FormItem name="studentName" :rules="[{ required: true, message: '请输入您的学生姓名' }]">
                        <Input v-model:value="formState.studentName" placeholder="学生姓名" size="middle">
                        <template #prefix>
                            <FontAwesomeIcon :icon="['far', 'user']" />
                        </template>
                        </Input>
                    </FormItem>

                    <FormItem>
                        <Flex justify="space-between" vertical gap="middle">
                            <Button type="primary" html-type="submit" style="width: 100%;">
                                发送验证码
                            </Button>
                        </Flex>
                    </FormItem>
                </Form>



                <Result v-else status="success" :title="'已经成功发送至邮箱'+formState.username+'@bit.edu.cn'"
                    sub-title="密码重置链接将在10分钟后失效">
                    <template #extra>
                        <Button type="primary" @click="open = false">关闭页面</Button>
                    </template>
                </Result>
            </Flex>
        </Flex>
    </Modal>
</template>

<script setup>
import { Alert, Button, Flex, Modal, TypographyTitle, Form, Switch, Input, Divider, InputPassword, TypographyLink, Checkbox, Textarea, Result } from 'ant-design-vue';
import ServiceAgreement from '@/components/base/common/ServiceAgreement.vue';

const FormItem = Form.Item;
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// API
import { sendForgetPasswordMail } from '@/assets/js/request/UserInfoAPI.js';

import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';

const serviceAgreement = ref();

const formState = reactive({
    username: '',
    password: '',
    studentName: '',
    isTeamLeader: false,
    groupName: '',
    groupDescription: ''
});

const successSend = ref(false);

const onFinish = async (values) => {
    let result = await sendForgetPasswordMail(values.username, values.studentName);
    if (result.data.state == "SUCCESS") {
        message.success('已成功发送邮件，请通过链接修改密码！');
    } else {
        if (result.data.code == "-3") {
            message.error("学号与真实姓名不匹配，请核对！");
        } else if (result.data.code == "-4") {
            message.error("目前账户登录已被封禁，无法找回密码！请联系管理员处理！");
        } else if (result.data.code == "-2") {
            message.error("账号未注册，请前往预注册页面注册！");
        }
    }
};
const onFinishFailed = errorInfo => {
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