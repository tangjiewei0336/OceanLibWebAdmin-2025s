import axiosPlugin from '@/axiosPlugin.js'
import { message } from 'ant-design-vue';
import { errorHandler } from './common.js'
import qs from "qs";

export async function getFileList(pageNum, pageSize) {
    let data = null;
    await axiosPlugin({
        method: "get",
        url: "/getNotAcceptedFileList",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        data: qs.stringify({
            pageNum: pageNum,
			pageSize: pageSize
        }),
    }).then((response) => {
        data = response.data.msg;
        localStorage.setItem("token", data);
        message.success('获取列表成功');
    }).catch((response) => {
        data = errorHandler(response, true);
    });
    return data;
}