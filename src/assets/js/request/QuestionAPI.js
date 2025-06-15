import axiosPlugin from '@/axiosPlugin.js'
import { message } from 'ant-design-vue';
import { errorHandler } from './common.js'
import qs from "qs";
import { baseURL } from '@/config.js'

// 搜索问题
export async function searchByKeywords(params = {}) {
    let data = null;
    await axiosPlugin({
        method: "GET",
        url: baseURL + '/qaService/question/search',
        params: {
            keywords: params.keywords,
            page: params.page,
            rows: params.rows
        },
    }).then((response) => {
        // console.log(response)
        let searchHits = response.data.msg.searchHits;
        // let questionListTemp = searchHits.map((data) => {
        //     if (data.highlightFields != null) {
        //       if (data.highlightFields.abstractContent != null && data.highlightFields.abstractContent.length > 0) {
        //         data.content.abstractContent = data.highlightFields.abstractContent[0];
        //       }
        //       if (data.highlightFields.title != null && data.highlightFields.title.length > 0) {
        //         data.content.title = data.highlightFields.title[0];
        //       }
        //       if (data.highlightFields.content != null && data.highlightFields.content.length > 0) {
        //         data.content.content = data.highlightFields.content[0];
        //       }
        //     }
        //     return data.content;
        //   });
        let questionListTemp = searchHits.map(data => data.content);
        data = questionListTemp;
        // localStorage.setItem("token", data);
        message.success('搜索成功');
    }).catch((response) => errorHandler(response));
    return data;
}

// 列表获取个人的或者所有问题
export async function listByUsername(params = {}) {
    let data = null;
    if (params.username) {
        await axiosPlugin({
            method: "GET",
            url: baseURL + "/qaService/question/list",
            params: {
                username: params.username,
                page: params.page,
                pageSize: params.pageSize,
                sort: 0,
                includeDeleted: params.includeDeleted
            },
        }).then((response) => {
            // console.log(params)
            // console.log(response)
            data = response.data.msg;
            localStorage.setItem("QuestionInfoList", JSON.stringify(data));
            message.success('问题查询成功');
        }).catch((response) => errorHandler(response));
    }
    else {
        await axiosPlugin({
            method: "GET",
            url: baseURL + "/qaService/question/list",
            params: {
                page: params.page,
                pageSize: params.pageSize,
                sort: 0,
                includeDeleted: params.includeDeleted
            },
        }).then((response) => {
            // console.log(params)
            // console.log(response)
            data = response.data.msg;
            localStorage.setItem("QuestionInfoList", JSON.stringify(data));
            message.success('问题查询成功');
        }).catch((response) => errorHandler(response));
    }
    return data;
}

// 列表获取个人的或者所有问题
export async function listAll(params = {}) {
    let data = null;
    await axiosPlugin({
        method: "GET",
        url: baseURL + "/qaService/question/admin/all",
        params: {
            page: params.page,
            pageSize: params.pageSize,
        },
    }).then((response) => {
        // console.log(params)
        // console.log(response)
        data = response.data.msg;
        localStorage.setItem("QuestionInfoList", JSON.stringify(data));
        message.success('问题查询成功');
    }).catch((response) => errorHandler(response));
    return data;
}

// 删除问题
export async function deleteQuestion(questionId) {
    let data = null;
    await axiosPlugin({
        method: "DELETE",
        url: baseURL + "/qaService/question/delete",
        params: {
            questionId: questionId,
        },
    }).then((response) => {
        // console.log(response)
        data = response.data.msg;
        if (response.data.state === "SUCCESS") {
            data = response.data.msg;
            message.success('问题删除成功');
        }
    }).catch((response) => errorHandler(response));
    return data;
}

// 修改/发布/隐藏问题
export async function updateQuestion(params) {
    let data = null;
    const formData = new FormData();
    formData.append("title", params.title);
    formData.append("content", params.content);
    // console.log(params.content)
    await axiosPlugin({
        method: "PUT",
        url: baseURL + "/qaService/question/update",
        // headers: {
        //     'Content-Type': 'multipart/form-data'
        // },
        params: {
            questionId: params.id,
            isPost: params.isPosted,
            isHide: params.isHidden,
        },
        data: formData
    }).then((response) => {
        // console.log(response)
        data = response.data.msg;
        if (response.data.state === "SUCCESS") {
            data = response.data.msg;
            message.success('问题修改成功');
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