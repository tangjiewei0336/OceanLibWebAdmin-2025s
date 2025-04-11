import MockAdapter from 'axios-mock-adapter';
import axiosPlugin from '@/axiosPlugin.js'
import { baseURL } from '@/config.js'

const mock = new MockAdapter(axiosPlugin);
const module = "adminInfo"

// login
const MOCK_USERNAME = "pat";
const MOCK_PASSWORD = "theworld";

mock.onPost(baseURL + '/userAuth/login').reply((config) => {

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

mock.onGet('/userInfoService/getUserLimitedInfo').reply((config) => {
    return MOCK_SUCCESS_MESSAGE;
});



const generateFile = (index) => {
    // 中文人名库
    const chineseNames = [
      '温德', '帕特', '林良军', '风云远', '文正', '文杰',
      '叶散归', '文心玥', '唐侠筱', '琳达赛', '林山', '帕莎', '宗元杰',
      '琪琼', '谢缇', '宝光', '铁其峰', '李华', '汪海',
    ];

    // 英文人名库
    const englishNames = [
      'Ender Smoud', 'Darkness', 'Michael Williams', 'Sarah Brown',
      'David Jones', 'Jennifer Garcia', 'Robert Miller', 'Lisa Davis',
      'William Rodriguez', 'Jessica Martinez'
    ];

    // 文件类型库
    const fileTypes = [
      {type: '教辅资料', names: [
        '高中数学必修一教案', '英语四级真题解析', '物理实验指导手册',
        '化学方程式大全', '高考作文范文集', '历史年表速记'
      ]},
      {type: '名家名著', names: [
        '红楼梦', '百年孤独', '活着', '三体', '小王子',
        '傲慢与偏见', '1984', '围城', '平凡的世界', '追风筝的人'
      ]},
      {type: '网络小说', names: [
        '斗破苍穹', '全职高手', '诡秘之主', '雪中悍刀行',
        '大王饶命', '庆余年', '凡人修仙传', '灾厄洪流', '银河纪实'
      ]},
      {type: '政府文件', names: [
        '关于促进经济发展的通知', '2023年度工作总结',
        '城市规划建设方案', '疫情防控指导意见',
        '乡村振兴战略实施方案', '安全生产管理办法'
      ]},
      {type: '企业文档', names: [
        'Q3财务报告', '市场调研分析', '新产品开发计划',
        '员工手册2023版', '项目立项申请书', '合作伙伴协议'
      ]}
    ];

    // 随机选择文件类型
    const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const fileName = fileType.names[Math.floor(Math.random() * fileType.names.length)];

    // 随机选择人名 (30%概率使用英文名)
    const useEnglishName = Math.random() < 0.3;
    const uploader = useEnglishName
      ? englishNames[Math.floor(Math.random() * englishNames.length)]
      : chineseNames[Math.floor(Math.random() * chineseNames.length)];

    // 生成随机的上传日期 (过去3年内)
    const randomDays = Math.floor(Math.random() * 365 * 3);
    const uploadDate = new Date();
    uploadDate.setDate(uploadDate.getDate() - randomDays);

    return {
		fileID: index,
		title: `${fileName}${fileType.type === '政府文件' ? '〔2023〕' + (index % 20 + 1) + '号' : ''}`,
		uploadUsername: uploader,
		uploadDate: uploadDate.toISOString(),
		isApproved: index % 3 === 0 ? 0 : 1,
		fileType: fileType.type,
		fileSize: `${Math.round(Math.random() * 10 + 1)}.${Math.floor(Math.random() * 99)} MB`,
		downloads: Math.floor(Math.random() * 1000),
		views: Math.floor(Math.random() * 5000)
    };
};

mock.onGet("/getNotAcceptedFileList").reply((config) => {
    const params = new URLSearchParams(config.data);
    const pageNum = params.get('pageNum')
    const pageSize = params.get('pageSize')

    // 构造分页数据
    try {
        return [200, {
            code: "0",
            state: "SUCCESS",
            msg: {
                pageNum: pageNum,
                pageSize: pageSize,
                total: 50,
                list: Array.from({length: pageSize}, (_, i) => generateFile((pageNum-1)*pageSize + i))
            }
        }];
    } catch (error) {
        console.error("Mock数据生成错误:", error);
        return [500, { code: "500", state: "ERROR", msg: "Mock数据生成失败" }];
    }
});

mock.onGet('/docFileService/doTempFilePreview').reply((config) => {
    return [200, { code: 0, state: "SUCCESS", msg: 'http://ocean.oriole.cn/pdfjs/web/viewer.html' }];
});

mock.onGet('/docInfoService/getFileInfoByFileID').reply(200, {
	"state": "SUCCESS",
	"code": "1",
	"msg": {
		"fileID": 0,
		"title": "Make Software Engineering Great Again",
		"abstractContent": "No one knows software engineering better than me.\nI have the best software engineering skills.\nI will make software engineering great again.",
		"size": 114514,
		"previewPictureObjectName": "string",
		"fileType": "string",
		"uploadUsername": "Donald Trump",
		"uploadDate": "2023-10-01T12:00:00Z",
		"realObjectName": "string",
		"previewPdfObjectName": "string",
		"paymentMethod": 0,
		"paymentAmount": 0,
		"isAllowAnon": 0,
		"isAllowVipfree": 0,
		"isAllowComment": 0,
		"hideScore": 0,
		"isApproved": 0,
		"indexString": "string",
		"tagNames": ["string"],
		"fileExtraEntity": {
		"score": 0,
		"ratersNum": 0,
		"readNum": 0,
		"likeNum": 0,
		"dislikeNum": 0,
		"downloadNum": 0,
		"collectionNum": 0,
		"commentNum": 0,
		"isProCert": 0,
		"isOfficial": 0,
		"isOriginal": 0,
		"isVipIncome": 0,
		"originalAuthor": "string",
		"copyrightNotice": "string",
		"fileId": 0
		},
		"fileCheckEntity": {
		"status": 0,
		"notice": "string",
		"processingTime": "string",
		"rejectReason": "string",
		"fileId": 0
		},
		"fileId": 0,
		"folderId": 0,
		"typeId": 0
	}
});

mock.onPost("/docFileService/postFileCensor").reply((config) => {
	return [200, { code: "0", msg: "mock-token", state: "SUCCESS" }];
});

export default mock;