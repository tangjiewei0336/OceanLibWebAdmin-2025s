import { message } from 'ant-design-vue';

export async function errorHandler(e, noHandleBussinessERROR = false) {
    if (e.response != undefined) {
        console.log("Request ERROR", e.response);
        message.error('请求错误。HTTP状态码:' + e.response.status);
    } else {
        console.log("Business ERROR", e.data);
        if (e.data.state && e.data.state == "ERROR") {
            if (noHandleBussinessERROR) {
                return e
            }
            message.error('业务异常，请联系管理员处理。错误代码:' + e.data.code);
        }
    }
}

export function getURLByUserRole(URLs) {
    let nowUserInfo = localStorage.getItem('userInfo');
    if (nowUserInfo != undefined) {
        nowUserInfo = JSON.parse(nowUserInfo);
        return URLs[nowUserInfo.role];
    } else {
        return URLs['student'];
    }
}