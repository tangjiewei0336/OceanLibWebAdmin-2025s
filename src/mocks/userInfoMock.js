import MockAdapter from 'axios-mock-adapter';
import axiosPlugin from '@/axiosPlugin.js'

const mock = new MockAdapter(axiosPlugin);
const module = "adminInfo"

// login
const MOCK_USERNAME = "111";
const MOCK_PASSWORD = "111";

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

// 模拟一个 GET 请求
mock.onGet("/adminInfo/getManageInfo").reply((config) => {
    // 模拟的返回数据
    const mockResponse = {
        code: "0",
        msg: dataSource1,
        state: "SUCCESS"
    };

    return [200, mockResponse];  // 返回模拟的响应
});



// info
const MOCK_SUCCESS_MESSAGE = [
    200,
    {
        code: "0",
        msg: {
            "username": "admin",
            "password": null,
            "studentName": "李明",
            "createTime": 11111,
            "role": "admin",
            // "role": "superadmin",
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


const dataSource1 = [
{
    key: '1',
    username: '张三',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'admin',
    avatar:'http://app.its.csu.edu.cn/fe//upload/appserver/csuPortal/headimgs/3940312_1502498861516.jpg',
    college:'计算机科学与技术学院',
    nickname:'六百六十六',
    password:'252929289292'
},
{
    key: '2',
    username: '李四',
    age: 42,
    address: '上海市普陀区金沙江路 1517 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 0,
    role:'user',
    nickname:'七百七十七',
},
{
    key: '3',
    username: '张三1',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'superadmin',
},{
    key: '4',
    username: '张三2',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
},{
    key: '5',
    username: '张三3',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
},{
    key: '6',
    username: '张三4',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
},{
    key: '7',
    username: '张三5',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
},{
    key: '8',
    username: '张三6',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
},{
    key: '9',
    username: '张三7',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
},{
    key: '10',
    username: '张三8',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
},{
    key: '11',
    username: '张三9',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
},{
    key: '12',
    username: '张三10',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
},{
    key: '13',
    username: '张三11',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
},{
    key: '14',
    username: '张三12',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
},{
    key: '15',
    username: '张三13',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
    password: '123456',
},{
    key: '16',
    username: '张三14',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
},{
    key: '17',
    username: '张三15',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
    password: '123456',
},{
    key: '18',
    username: '张三16',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
    password: '123456',
},{
    key: '19',
    username: '张三17',
    age: 32,
    address: '上海市普陀区金沙江路 1518 弄',
    email: 'zhangsan@example.com',
    student_id: '13800000001',
    description: '张三是一个非常努力的人，热衷于学习和帮助他人。',
    is_valid: 1,
    role:'user',
    password: '123456',
}];











export default mock;