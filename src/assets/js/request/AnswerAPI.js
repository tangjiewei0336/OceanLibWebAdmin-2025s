import axiosPlugin from '@/axiosPlugin.js'
import { message } from 'ant-design-vue';
import { errorHandler } from './common.js'
import qs from "qs";
import { baseURL } from '@/config.js'

// 获取回答列表
export async function gainAnswer(params) {
    let data = null;
    // console.log(params)
    await axiosPlugin({
        method: "GET",
        url: baseURL + "/qaService/answer/all",
        params: {
            page: params.page,
            pageSize: params.pageSize,
        },
    }).then((response) => {
        console.log(response)
        data = response.data.msg;
        if (response.data.state === "SUCCESS") {
            data = response.data.msg;
            localStorage.setItem("AnswerInfoList", JSON.stringify(data));
            message.success('回答列表获取成功');
        }
    // }).catch((response) => errorHandler(response));
    }).catch((response) => {
        console.log(response);
    })
    return data;
}

// 获取指定问题的回答列表
export async function gainAnswerByQuestion(params) {
    let data = null;
    // console.log(params)
    await axiosPlugin({
        method: "GET",
        url: baseURL + "/qaService/answer/list",
        params: {
            questionId: params.questionId,
            page: params.page,
            pageSize: params.pageSize,
            includeDeleted: params.includeDeleted,
        },
    }).then((response) => {
        console.log(response)
        data = response.data.msg;
        if (response.data.state === "SUCCESS") {
            data = response.data.msg;
            localStorage.setItem("AnswerInfoList", JSON.stringify(data));
            message.success('回答列表获取成功');
        }
    // }).catch((response) => errorHandler(response));
    }).catch((response) => {
        console.log(response);
    })
    return data;
}

// 获取指定问题的回答列表 TODO
export async function gainAnswerByUser(params) {
    let data = null;
    console.log(params)
    await axiosPlugin({
        method: "GET",
        url: baseURL + "/qaService/answer/myAnswers",
        params: {
            username: params.username,
            page: params.page,
            pageSize: params.pageSize,
        },
    }).then((response) => {
        console.log(response)
        data = response.data.msg;
        if (response.data.state === "SUCCESS") {
            data = response.data.msg;
            localStorage.setItem("AnswerInfoList", JSON.stringify(data));
            message.success('回答列表获取成功');
        }
    // }).catch((response) => errorHandler(response));
    }).catch((response) => {
        console.log(response);
    })
    return data;
}

// 修改回答
export async function updateAnswerPut(params) {
    let data = null;
    await axiosPlugin({
        method: "PUT",
        url: baseURL + "/qaService/answer/update",
        params: {
            answerId: params.answerId,
            content: params.content,
        },
    }).then((response) => {
        // console.log(response)
        data = response.data.msg;
        if (response.data.state === "SUCCESS") {
            data = response.data.msg;
            message.success('回答修改成功');
        }
    }).catch((response) => errorHandler(response));
    return data;
}

// 删除回答
export async function deleteAnswer(answerId) {
    let data = null;
    await axiosPlugin({
        method: "DELETE",
        url: baseURL + "/qaService/answer/delete",
        params: {
            answerId: answerId,
        },
    }).then((response) => {
        console.log(response)
        data = response.data.msg;
        if (response.data.state === "SUCCESS") {
            data = response.data.msg;
            message.success('回答修改成功');
        }
    }).catch((response) => errorHandler(response));
    return data;
}

// 上传图片接口
export async function uploadImage(file) {
    if (!file) {
        message.error('请选择要上传的图片');
        return null;
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('图片不能超过10MB');
      message.error('图片不能超过10MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      console.error('只允许上传图片');
      message.error('只允许上传图片');
      return;
    }
    let data = null;

    const formData = new FormData();
    formData.append('uploadFile', file);

    await axiosPlugin({
        method: "POST",
        url: baseURL + "/qaService/qaFile/uploadFile",
        // headers: {
        //     'Content-Type': 'multipart/form-data'
        // },
        data: formData,
    }).then((response) => {
        // console.log(response)
        data = response.data.msg;
        if (response.data.state === "SUCCESS") {
            data = baseURL + "/qaService/qaFile/downloadFile/"
                 + response.data.msg.fileName + response.data.msg.fileSuffix;
            message.success('图片上传成功');
        } else {
            message.error(response.data.msg || '图片上传失败');
        }
    }).catch((response) => errorHandler(response));
    return data;
}