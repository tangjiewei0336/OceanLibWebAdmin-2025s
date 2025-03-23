import MockAdapter from 'axios-mock-adapter';
import axiosPlugin from '@/axiosPlugin.js'

const mock = new MockAdapter(axiosPlugin);
const module = "adminInfo"

// login
const MOCK_USERNAME = "pat";
const MOCK_PASSWORD = "theworld";

mock.onPost(module + "/login").reply((config) => {

    const params = new URLSearchParams(config.data);
    const username = params.get("username");
    const password = params.get("password");

    if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
        return [200, { code: "0", msg: "mock-token", state: "SUCCESS" }];
    } else if (username === "pendingUser") {
        return [200, { code: "-3", msg: "账号未审核", state: "FAIL" }];
    } else {
        return [200, { code: "-2", msg: "用户名或密码错误", state: "FAIL" }];
    }
});


// info
const MOCK_SUCCESS_MESSAGE = [
    200,
    {
        code: "0",
        msg: {
            "username": "admin",
            "password": null,
            "studentName": "杨智雄",
            "createTime": 1722909079066,
            "role": "superadmin",
            "groupId": 0,
            "status": 0,
            "groupName": null
        },
        state: "SUCCESS"
    }
]

mock.onGet(module + "/getUserInfo").reply((config) => {
    console.log("here")
    return MOCK_SUCCESS_MESSAGE;
  });

  export default mock;