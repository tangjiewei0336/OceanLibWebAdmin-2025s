import axiosPlugin from '@/axiosPlugin.js'
import { message } from 'ant-design-vue';
import { errorHandler } from './common.js'
import qs from "qs";

const module = "adminInfo"

export async function login(username, password) {
    let data = null;
    await axiosPlugin({
        method: "post",
        // url: "adminInfo/login",
        url: module + "/login",
        data: qs.stringify({
            username: username,
            password: password,
        }),
    }).then((response) => {
        data = response.data.msg;
        localStorage.setItem("token", data);
        message.success('登录成功');
    }).catch((response) => {
        if (response.data.state && response.data.code == "-2") {
            message.error('用户名或密码错误');
        } else if (response.data.state && response.data.code == "-3") {
            message.error('用户身份验证通过，但账号尚未通过审核，无法登录');
        }
    });
    return data;
}

// 获取符合参数的用户信息列表，根据参数
export async function getManageInfo(params = {}, pageSize, pageNum) {
    let data = null;
    await axiosPlugin({
        method: "get",
        url: module + "/getManageInfo",
        data: {
            ...params,
            pageSize: pageSize,
            pageNum: pageNum,
        },
    }).then((response) => {
        data = response.data.msg;
        localStorage.setItem("current_usersInfo", JSON.stringify(data));
        message.success('用户信息查询成功');
    }).catch((response) => errorHandler(response));
    return data;
}

// 更新用户名为username的用户信息，根据其他参数
export async function update(username, params_obj = {}) {
    let data = null;
    await axiosPlugin({
        method: "put",
        url: module + "/update",
        params: {
            username: username
        },
        data: {
            ...params_obj
        },
    }).then((response) => {
        if (response.data.state === "SUCCESS") {
            data = response.data.msg;
            message.success('用户信息修改成功');
        }
    }).catch((response) => errorHandler(response));
    return data;
}

// 用于超级管理员删除用户
export async function deleteForSuperAdmin(username) {
    let data = null;
    await axiosPlugin({
        method: "DELETE",
        url: module + "/delete",
        params: {
            username: username
        },
    }).then((response) => {
        if (response.data.state === "SUCCESS") {
            data = response.data.msg;
            message.success('用户删除成功');
        }
    }).catch((response) => errorHandler(response));
    return data;
}


export async function preRegister(username, password, studentName, isTeamLeader, groupName, groupDescription) {
    let data = null;
    await axiosPlugin({
        method: "post",
        url: module + "/preRegister",
        data:{
            username: username,
            password: password,
            studentName: studentName,
            isTeamLeader: isTeamLeader,
            groupName: groupName,
            groupDescription: groupDescription,
        },
    }).then((response) => {
        data = response;
    }).catch((response) =>{
        data = errorHandler(response, true);
    });
    return data;
}

export async function getUserInfo() {
    let data = null;
    await axiosPlugin({
        method: "get",
        url: module + "/getUserInfo",
    }).then((response) => {
        data = response.data.msg;
        localStorage.setItem("userInfo", JSON.stringify(data));
        message.success('用户信息已更新');
    }).catch((response) => errorHandler(response));
    // return data;
}

export async function joinGroup(groupName, JoinCode) {
    let data = null;
    await axiosPlugin({
        method: "post",
        url: module + "/joinGroup",
        data: {
            groupName: groupName,
            joinCode: JoinCode,
        },
    }).then((response) => {
        data = response;
        localStorage.setItem("token", response.data.msg);
        message.success('用户Token已更新');
    }).catch((response) =>{
        data = errorHandler(response, true);
    });
    return data;
}

export async function sendForgetPasswordMail(username, studentName) {
    let data = null;
    await axiosPlugin({
        method: "post",
        url: module + "/sendForgetPasswordMail",
        data:{
            username: username,
            studentName: studentName,
        },
    }).then((response) => {
        data = response;
    }).catch((response) =>{
        data = errorHandler(response, true);
    });
    return data;
}

export async function changePasswordByToken(token, newPassword) {
    let data = null;
    await axiosPlugin({
        method: "post",
        url: module + "/changePasswordByToken",
        data:{
            token: token,
            newPassword: newPassword,
        },
    }).then((response) => {
        data = response;
    }).catch((response) =>{
        data = errorHandler(response, true);
    });
    return data;
}

export async function changePasswordByUser(oldPassword, newPassword) {
    let data = null;
    await axiosPlugin({
        method: "post",
        url: module + "/changePasswordByUser",
        data:{
            oldPassword: oldPassword,
            newPassword: newPassword,
        },
    }).then((response) => {
        data = response;
    }).catch((response) =>{
        data = errorHandler(response, true);
    });
    return data;
}


export async function getUserList(pageSize, pageNum) {
    let data = null;
    await axiosPlugin({
        method: "get",
        url: module + "/teacher/getUserInfoList",
        params: {
            pageSize: pageSize,
            pageNum: pageNum,
        },
    }).then((response) => {
        if (response.data.state === "SUCCESS") {
            data = response.data.msg;
        }
    });
    return data;
}