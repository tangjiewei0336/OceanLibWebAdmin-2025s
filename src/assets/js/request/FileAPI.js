import axiosPlugin from '@/axiosPlugin.js'
import { errorHandler } from './common.js'
import qs from "qs";
import { baseURL } from '@/config.js'

export async function getFileList(pageNum, pageSize, filter) {
    let data = null;
    await axiosPlugin({
        method: "get",
        url: baseURL + "/docInfoService/getNotAcceptedFileListByFileStatement",
        params: {
            approvedOrStatus: filter,
            pageNum: pageNum,
            pageSize: pageSize
        },
    }).then((response) => {
        data = response.data.msg;
    }).catch((response) => {
        data = errorHandler(response, true);
    });
    return data;
}

export async function getFileInfo(fileId) {
    let fileinfo = null;
    await axiosPlugin({
        method: "get",
        url: baseURL + "/docInfoService/getFileInfoByFileID",
        params: {
            fileID: fileId,
        },
    }).then((response) => {
        fileinfo = response.data.msg;
    }).catch((response) => {
        fileinfo = errorHandler(response, true);
    });
    return fileinfo;
}

export async function postFileRejection(fileID, reason) {
    let data = null;
    await axiosPlugin({
        method: "post",
        url: baseURL + "/docFunctionService/postFileCensor",
        data: qs.stringify({
            fileID: fileID,
            isApproved: 0,
            rejectReason: reason,
        }),
    }).then((response) => {
        data = response.data.msg;
    }).catch((response) => {
        data = errorHandler(response, true);
    });
    return data;
}

export async function postFileApprove(fileID, reason) {
    let data = null;
    await axiosPlugin({
        method: "post",
        url: baseURL + "/docFunctionService/postFileCensor",
        data: qs.stringify({
            fileID: fileID,
            isApproved: 1,
            rejectReason: reason,
        }),
    }).then((response) => {
        data = response.data.msg;
    }).catch((response) => {
        data = errorHandler(response, true);
    });
    return data;
}

export async function postFileInfoChange(fileID, paymentAmount, editableInfo) {
    let data = null;
    console.log(fileID)
    console.log(paymentAmount)
    console.log(editableInfo.abstractContent)
    console.log(editableInfo.copyrightNotice)
    console.log(editableInfo.title)
    console.log(editableInfo.paymentMethod)
    console.log(editableInfo.isAllowAnon)
    console.log(editableInfo.isAllowComment)
    console.log(editableInfo.isAllowVipfree)
    console.log(editableInfo.isOriginal)
    console.log(editableInfo.originalAuthor)
    await axiosPlugin({
        method: "post",
        url: baseURL + "/docInfoService/changeDocumentInfo",
        data: qs.stringify({
            fileID: fileID,
            paymentAmount: paymentAmount,
            abstractContent: editableInfo.abstractContent,
            copyrightNotice: editableInfo.copyrightNotice,
            title: editableInfo.title,
            paymentMethod: editableInfo.paymentMethod,
            isAllowAnon: editableInfo.isAllowAnon,
            isAllowComment: editableInfo.isAllowComment,
            isAllowVipfree: editableInfo.isAllowVipfree,
            isOriginal: editableInfo.isOriginal,
            originalAuthor: editableInfo.originalAuthor,
            
        }),
    }).then((response) => {
        data = response.data.msg;
    }).catch((response) => {
        data = errorHandler(response, true);
    });
    return data;
}