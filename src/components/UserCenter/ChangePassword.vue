<style lang="less"></style>
<template>
    <a-modal v-model:open="open" :footer="null" :bodyStyle="{ padding: '0px' }" wrapClassName="login" width="400px"
        :maskClosable="!isNoLoginChangePassword" :closable="!isNoLoginChangePassword">
        <a-flex style="height:400px">
            <a-flex justify="flex-start" style="width:100%; padding: 0px 30px; margin-top:40px" vertical gap="middle">
                <a-alert show-icon type="warning">
                    <template #message>
                        <b>安全敏感操作：您正在进行的操作为<span style="color:red">修改用户密码</span>。</b>如您未主动进行此类操作请勿继续，并关闭本页面，或向管理员咨询。
                    </template>
                </a-alert>
                <a-form :model="formState" name="forget_password" @finish="onFinish" @finishFailed="onFinishFailed">
                    <a-form-item name="oldPassword" :rules="[{ required: true, message: '请输入旧密码' }]"
                        v-if="!isNoLoginChangePassword">
                        <a-input v-model:value="formState.oldPassword" placeholder="旧密码" size="middle">
                            <template #prefix>
                                <font-awesome-icon :icon="['fas', 'lock']" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item name="newPassword" :rules="[{ required: true, message: '请输入您的账户密码' }, {
                        type: 'string',
                        pattern: /^(?=.*[a-z])(?=.*[0-9]).+$/,
                        min: 8,
                        message: '密码应至少包含字母和数字，且长度不小于8位'
                    }]" has-feedback>
                        <a-input-password v-model:value="formState.newPassword" placeholder="新密码" size="middle">
                            <template #prefix>
                                <font-awesome-icon :icon="['fas', 'lock']" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item name="newPassword2" :rules="[{
                        validator: validatePassword2,
                        trigger: 'change',
                    }]" has-feedback>
                        <a-input-password v-model:value="formState.newPassword2" placeholder="新密码确认" size="middle">
                            <template #prefix>
                                <font-awesome-icon :icon="['fas', 'lock']" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item>
                        <a-flex justify="space-between" vertical gap="middle">
                            <a-button type="primary" html-type="submit" style="width: 100%;">
                                确认修改密码
                            </a-button>
                        </a-flex>
                    </a-form-item>
                </a-form>
            </a-flex>
        </a-Flex>
    </a-modal>
</template>

<script setup>
// API
import { changePasswordByToken, changePasswordByUser } from '@/assets/js/request/UserInfoAPI.js';

import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';

const formState = reactive({
    oldPassword: '',
    newPassword: '',
    newPassword2: '',
});


const emit = defineEmits(['onSuccess', 'onError']);
const props = defineProps({
    isNoLoginChangePassword: { default: false },
    token: { default: null },
});

const validatePassword2 = async (_rule, value) => {
    if (value === '') {
        return Promise.reject('请再次输入新密码');
    } else if (value !== formState.newPassword) {
        return Promise.reject("两次输入的密码不匹配");
    } else {
        return Promise.resolve();
    }
};

const onFinish = async (values) => {
    let result;
    if (props.isNoLoginChangePassword) {
        result = await changePasswordByToken(props.token, values.newPassword);
    } else {
        result = await changePasswordByUser(values.oldPassword, values.newPassword);
    }
    if (result.data.state == "SUCCESS") {
        message.success('已成功重置密码');
        emit("onSuccess");
        open.value = false;
    } else {
        if (result.data.code == "-2") {
            if (props.isNoLoginChangePassword) {
                message.error("链接已过期，请重新发送找回密码邮件");
                emit("onError", "链接已过期，请重新发送找回密码邮件");
                open.value = false;
            } else {
                message.error("用户旧密码输入错误，请检查输入");
            }
        }
    }
};

const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
};


const open = ref(false);

const openModal = () => {
    open.value = true;
};

defineExpose({
    openModal,
});
</script>

<style></style>