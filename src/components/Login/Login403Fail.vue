<style lang="less"></style>
<template>
    <p>您的权限不足，请重新登录或联系管理员处理。</p>
    <Flex justify="flex-end" align="center">
        <Button type="primary" @click="login.openModal()">用户登录</Button>
    </Flex>
    <Login ref="login" />
</template>

<script setup>
import { Button, Flex } from 'ant-design-vue';
import { ref } from 'vue';
import Login from '@/components/Login/Login.vue';

const login = ref();
</script>