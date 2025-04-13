import axiosPlugin from '@/axiosPlugin.js'
import { errorHandler } from './common.js'
import qs from "qs";
import { baseURL } from '@/config.js'

export async function getFileList(pageNum, pageSize) {
    let data = null;
    await axiosPlugin({
        method: "get",
        url: baseURL + "/docInfoService/getNotAcceptedFileList",
        params: {
            username: "bit-sunjz",
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