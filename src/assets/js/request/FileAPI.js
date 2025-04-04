import axiosPlugin from '@/axiosPlugin.js'
import { message } from 'ant-design-vue';
import { errorHandler } from './common.js'
import qs from "qs";
import { pdfjsViewerURL, objectStorageServer } from '@/config.js';

export async function getFileList(pageNum, pageSize) {
    let data = null;
    await axiosPlugin({
        method: "get",
        url: "/getNotAcceptedFileList",
        data: qs.stringify({
            pageNum: pageNum,
			pageSize: pageSize
        }),
    }).then((response) => {
        data = response.data.msg;
        localStorage.setItem("token", data);
    }).catch((response) => {
        data = errorHandler(response, true);
    });
    return data;
}

export async function getFileUrl(fileId) {
    let url = null;
    await axiosPlugin({
        method: "get",
        url: "/docFileService/doTempFilePreview",
        params: {
            uploadID: fileId,
        },
    }).then((response) => {
        if (response.data.code != -1) {
            // TODO: use the mock
            url = response.data.msg;
            // url = pdfjsViewerURL + objectStorageServer + response.data.msg;
        }
    }).catch((response) => {
        data = errorHandler(response, true);
    });
    return url;
}

export async function getFileInfo(fileId) {
    let fileinfo = null;
    await axiosPlugin({
        method: "get",
        url: "/docInfoService/getFileInfoByFileID",
        params: {
            uploadID: fileId,
        },
    }).then((response) => {
        fileinfo = response.data.msg;
    }).catch((response) => {
        fileinfo = errorHandler(response, true);
    });
    return fileinfo;
}

export async function postFileCensor(fileID, comment, isAccepted) {
    let data = null;
    await axiosPlugin({
        method: "post",
        url: "/docFileService/postFileCensor",
        data: qs.stringify({
            fileID: fileID,
            comment: comment,
            isAccepted: isAccepted,
        }),
    }).then((response) => {
        data = response.data.msg;
    }).catch((response) => {
        data = errorHandler(response, true);
    });
    return data;
}