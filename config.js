/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
//var host = 'http://192.168.0.183:2119';
var host = 'http://192.168.0.250:8778/cpx';
var user = 'http://192.168.0.250:8778/auth';
var client = 'http://192.168.0.250:8778/contract';
var admin = 'http://192.168.0.250:8778/admin';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        getAll: `${host}/vlog/getAll`,
        // 上传图片 上传视频
        upFiles: `${host}/vlog/addFile`,
        conText: `${host}/vlog/save`,
        login: `${user}/oauth/token`,
        phone: `${user}/sms/send`,
        addObj: `${client}/customer`,
        queryObj: `${client}/customer/myPage`,
        userPending: `${client}/customer/pending`, //待审核客户
        userPass: `${client}/customer/pass`, //审核通过
        userFail: `${client}/customer/fail`, //审核通过
        userInfo: `${admin}/user/info`, //用户信息
        menu: `${admin}/menu`,//用户菜单
        pendingList: `${client}/contract/pendingList`,//合同列表
        approved: `${client}/contract/approved`,//合同通过
        denied: `${client}/contract/denied`,//合同不通过
        pactPending: `${client}/contractPlan/myPending`,//待完成计划列表
        planningList: `${client}/contract/planningList`,//待计划列表
        contractPlan: `${client}/contractPlan`,//修改合同计划
        startPact: `${client}/contract/start`,//启动计划
        closed: `${client}/contract/closed`, //关闭合同
    },
    token:''
};

module.exports = config;
