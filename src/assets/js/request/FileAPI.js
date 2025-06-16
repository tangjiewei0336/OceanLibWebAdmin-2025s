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

export async function postFileInfoChange(fileID, editableInfo, originalAuthor) {
    let data = null;
    await axiosPlugin({
        method: "post",
        url: baseURL + "/docInfoService/changeDocumentInfo",
        data: qs.stringify({
            fileID: fileID,
            // folderID: editableInfo.folderID,
            paymentAmount: editableInfo.paymentAmount,
            abstractContent: editableInfo.abstractContent,
            title: editableInfo.title,
            paymentMethod: editableInfo.paymentMethod,
            isAllowAnon: editableInfo.isAllowAnon ? 1 : 0,
            isAllowComment: editableInfo.isAllowComment ? 1 : 0,
            isAllowVipfree: editableInfo.isAllowVipfree ? 1 : 0,
            originalAuthor: originalAuthor,

            uploadDate: editableInfo.uploadDate,
            isProCert: editableInfo.fileExtraEntity.isProCert ? 1 : 0,
            isOfficial: editableInfo.fileExtraEntity.isOfficial ? 1 : 0,
            isOriginal: editableInfo.fileExtraEntity.isOriginal ? 1 : 0,
            isVipIncome: editableInfo.fileExtraEntity.isVipIncome ? 1 : 0,
            copyrightNotice: editableInfo.fileExtraEntity.copyrightNotice,
        }),
    }).then((response) => {
        data = response.data.msg;
    }).catch((response) => {
        data = errorHandler(response, true);
    });
    return data;
}