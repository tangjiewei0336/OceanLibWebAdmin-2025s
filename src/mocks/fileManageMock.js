import MockAdapter from 'axios-mock-adapter';
import axiosPlugin from '@/axiosPlugin.js'

const mock = new MockAdapter(axiosPlugin);

const generateFile = (index) => {
    // 中文人名库
    const chineseNames = [
      '温德', '帕特', '林良军', '德克勒斯', '风云远', '赵静', '周强', 
      '吴秀英', '', '徐美丽', '孙小红', '马超', '朱建军', '胡雪岩',
      '林志颖', '郑成功', '谢娜', '董明珠', '曹操'
    ];
    
    // 英文人名库
    const englishNames = [
      'Ender Smoud', 'Emily Johnson', 'Michael Williams', 'Sarah Brown',
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
        '傲慢与偏见', '1984', '围城'
      ]},
      {type: '网络小说', names: [
        '斗破苍穹', '全职高手', '诡秘之主', '雪中悍刀行',
        '大王饶命', '庆余年', '凡人修仙传'
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
      isApproved: index % 3 === 0 ? 0 : 1,  // 审批状态模拟
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

export default mock;