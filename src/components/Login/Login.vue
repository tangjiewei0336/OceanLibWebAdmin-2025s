<style lang="less">
.login .ant-modal-content {
    padding: 0px !important;
}
</style>
<template>
    <Modal v-model:open="open" :footer="null" :bodyStyle="{ padding: '0px' }" wrapClassName="login" width="800px">
        <Flex style="height:500px">
            <img src="@/assets/images/login.png" style="height:500px" />
            <Flex justify="flex-start" style="width:100%; padding: 0px 30px; margin-top:40px" vertical gap="middle">
                <TypographyTitle :level="3">用户登录</TypographyTitle>
                <Form :model="formState" name="normal_login" class="login-form" @finish="onFinish"
                    @finishFailed="onFinishFailed">
                    <FormItem name="username" :rules="[{ required: true, message: '请输入您的用户名' }]">
                        <Input v-model:value="formState.username" placeholder="学号/用户名" size="middle">
                        <template #prefix>
                            <FontAwesomeIcon :icon="['far', 'user']" />
                        </template>
                        </Input>
                    </FormItem>

                    <FormItem name="password" :rules="[{ required: true, message: '请输入您的账户密码!' }]">
                        <InputPassword v-model:value="formState.password" placeholder="密码" size="middle">
                            <template #prefix>
                                <FontAwesomeIcon :icon="['far', 'lock']" />
                            </template>
                        </InputPassword>
                    </FormItem>

                    <FormItem>
                        <Flex justify="space-between" vertical gap="middle">
                            <Button type="primary" html-type="submit" style="width: 100%;">
                                登录
                            </Button>
                            <Flex justify="space-between">
                                <FormItem name="remember" no-style>
                                    <Checkbox v-model:checked="formState.remember">下次自动登录</Checkbox>
                                </FormItem>
                                <div>
                                    <TypographyLink @click="register.openModal()">
                                        注册新用户
                                    </TypographyLink>
                                    <Register ref="register" />
                                    <Divider type="vertical" />
                                    <TypographyLink @click="forgetPassword.openModal()">忘记密码</TypographyLink>
                                    <ForgetPassword ref="forgetPassword" />
                                </div>
                            </Flex>
                        </Flex>
                    </FormItem>
                </Form>
                <p style="margin-top:120px"> 登录系统即视为接受
                    <TypographyLink @click="serviceAgreement.openModal()">
                        用户协议
                    </TypographyLink>
                </p>
                <ServiceAgreement ref="serviceAgreement" />
            </Flex>
        </Flex>
    </Modal>
</template>

<script setup>
import { Button, Flex, Modal, TypographyTitle, Form, Checkbox, Input, Divider, InputPassword, TypographyLink } from 'ant-design-vue';
import ServiceAgreement from '@/components/base/common/ServiceAgreement.vue';
import Register from './Register.vue';
import ForgetPassword from './ForgetPassword.vue';

const FormItem = Form.Item;
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// API
import { login, getUserInfo } from '@/assets/js/request/UserInfoAPI.js';

import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';

const serviceAgreement = ref();
const register = ref();
const forgetPassword = ref();
const formState = reactive({
    username: '',
    password: '',
    remember: true,
});
const onFinish = async (values) => {
    let result = await login(values.username, values.password);
    if (result != null) {
        await getUserInfo();
        open.value = false;
        location.reload()
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