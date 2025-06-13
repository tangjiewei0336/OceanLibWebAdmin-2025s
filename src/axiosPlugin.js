import axios from 'axios'
import router from "./router";
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import Login401Fail from '@/components/Login/Login401Fail.vue'
import Login403Fail from '@/components/Login/Login403Fail.vue'

// export const baseServerAddr = 'mock.apifox.cn/m1/4591955-4241368-default';
// export const baseServerAddr = 'localhost:8081';

// export const baseServerAddr = '8.155.41.79:8088';
export const baseServerAddr = '127.0.0.1:8080';


// export const baseServerAddr = '81.70.166.86:8081';
// export const baseServerAddr = 'bit-hdp-server.neoyz.cn'
export const baseURL = 'http://' + baseServerAddr + '/';

export const Axios = axios.create({
    baseURL: baseURL,
    timeout: 10000,
});

//请求拦截器
Axios.interceptors.request.use(config => {
    //若存在这样的token，则从本地存储取出
    if (localStorage.token) {
        config.headers.Authorization = localStorage.getItem("token")
    }
    return config
}, error => {
    return Promise.reject(error)
});

//响应拦截器
Axios.interceptors.response.use(res => {
    if (res.headers.Authorization) {
        localStorage.setItem("token", res.headers.Authorization);
    }
    if (res.data.state !== 'SUCCESS') {
        //送入失败流程处理
        return Promise.reject(res)
    }
    return res
}, error => {
    if (error.response.status === 401) {
        // 401表明用户登录状态已经丢失，需跳转至登录页面重新登录获取 token
        Modal.confirm({
            title: "登录信息失效(401 Unauthorized)",
            content: createVNode(Login401Fail),
            footer: null,
        });
    } else if (error.response.status === 403) {
        // 检查用户是否加入了组
        if (localStorage.getItem("userInfo") != null && JSON.parse(localStorage.getItem("userInfo"))['groupId'] == null) {
            Modal.warning({
                title: "越权访问(403 Forbidden)",
                content: "该账户尚未加入团队，请加入团队后重试，或联系管理员处理。",
                okText: "前往 个人中心",
                onOk: () => {
                    router.push({ name: 'UserInfo' })
                }
            });
        } else {
            Modal.confirm({
                title: "越权访问(403 Forbidden)",
                content: createVNode(Login403Fail),
                footer: null,
            });
        }
    }
    return Promise.reject(error)
});

export default Axios;