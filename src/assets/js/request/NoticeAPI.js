import axiosPlugin from '@/axiosPlugin.js'
import { errorHandler } from './common.js'

const module = "notice"

export async function getNotice() {
    let data = null;
    await axiosPlugin({
        method: "get",
        url: module + "/getNotice",
    }).then((response) => {
        data = response.data.msg;
    }).catch((response) => errorHandler(response));
    return data;
}