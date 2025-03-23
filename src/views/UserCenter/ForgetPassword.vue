<template>
    <PlatformNav :selectedKey="['3', '0']">
        <template #breadcrumb-item>
            <a-breadcrumb-item>找回密码</a-breadcrumb-item>
        </template>
        <template #content>
            <p v-if="!isSuccess && !isError">
                <a-spin /> <a-typography-text type="secondary"> 请在弹出框中重置密码</a-typography-text>
            </p>
            <ChangePassword ref="changePassword" :isNoLoginChangePassword="true" :token="token"
                @onSuccess="successHandler" @onError="errorHandler"/>

            <a-result v-if="isSuccess" status="success" title="您已成功重置密码" :sub-title="'请妥善保管您的新密码，此页面将在'+closeTime+'秒后关闭'">
                <template #extra>
                    <a-button type="primary" @click="router.push({ name: 'index'})">回到主页</a-button>
                    <a-button type="primary" @click="router.push({ name: 'UserInfo'})">现在登录</a-button>
                </template>
            </a-result>

            <a-result v-if="isError" status="error" :title="errorMsg" :sub-title="'此页面将在'+closeTime+'秒后关闭'">
                <template #extra>
                    <a-button type="primary" @click="router.push({ name: 'index'})">回到主页</a-button>
                </template>
            </a-result>
        </template>
    </PlatformNav>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PlatformNav from '@/components/base/nav/PlatformNav.vue';
import ChangePassword from '@/components/UserCenter/ChangePassword.vue';


let route = useRoute();
let router = useRouter();
const token = ref(route.query.token);

const changePassword = ref();
const isSuccess = ref(false);
const isError = ref(false);
const errorMsg = ref();
const closeTime = ref(15);

onMounted(() => {
    changePassword.value.openModal();
})

const successHandler = () => {
    isSuccess.value = true
    setInterval(function () {
        closeTime.value = closeTime.value - 1;
        if (closeTime.value == 0){
            window.close();
        }
    }, 1000)
}

const errorHandler = (message) => {
    isError.value = true
    errorMsg.value = message
    setInterval(function () {
        closeTime.value = closeTime.value - 1;
        if (closeTime.value == 0){
            window.close();
        }
    }, 1000)
}
</script>