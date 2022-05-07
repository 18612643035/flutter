/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var ip = 'https://www.madecloud.net:7012';
//var ip = 'http://192.168.0.250';
var host = ip+'/contract';
var user = ip+'/auth';
var client = ip+'/contract';
var admin = ip+'/admin';
var maintain = ip+'/contract';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        getAll: `${host}/vlog/getAll`,
        getMy: `${host}/vlog/getMy`,
        deleteMy: `${host}/vlog/delete`,
        // 上传图片 上传视频
        upFiles: `${host}/vlog/addFile`,
        conText: `${host}/vlog/save`,
        login: `${user}/oauth/token`,
        phone: `${user}/sms/send`,
        addObj: `${client}/customer`,
        dict: `${client}/customer/dict`,//客户字典
        queryObj: `${client}/customer/myPage`, //我的客户列表
        queryAll: `${client}/customer/officialCustomer`, //所有客户列表
        userPending: `${client}/customer/pending`, //待审核客户
        userPass: `${client}/customer/pass`, //审核通过
        userFail: `${client}/customer/fail`, //审核通过
        userInfo: `${admin}/user/info`, //用户信息
        menu: `${admin}/menu`,//用户菜单
        role: `${admin}/user/list`,//获取指派人列表
        pendingList: `${client}/contract/pendingList`,//合同列表
        approved: `${client}/contract/approved`,//合同通过
        denied: `${client}/contract/denied`,//合同不通过
        pactPending: `${client}/contractPlan/myPending`,//get待完成计划列表
        planningList: `${client}/contract/planningList`,//合同待计划列表
        pactPage: `${client}/contract/inProcessList`,//合同进行中列表
        finishedList: `${client}/contract/finishedList`,//合同已完成列表
        pay: `${client}/contractPayment/page`,//合同付款记录
        updatePayStatus: `${client}/contractPayment/updatePayStatus`,//合同付款记录
        paymentList: `${client}/contract/paymentList`,//代付款列表
        
        contractPlan: `${client}/contractPlan/finish`,//完成合同计划
        startPact: `${client}/contract/start`,//启动计划
        closed: `${client}/contract/closed`, //关闭合同
        cservicePending: `${maintain}/customersupport/pending`, //获取待指派客服记录列表
        cservicePage: `${maintain}/customersupport/page`, //获取客服记录列表
        cserviceSave: `${maintain}/customersupport`, //新增客服记录列表
        cserviceTodu: `${maintain}/customersupport/myTodo`, //获取待处理客服记录列表
        closeCus: `${maintain}/customersupport/close`, //关闭客服记录
        cvisitPage: `${maintain}/returnVisit/page`, //回访记录
        vClose: `${maintain}/returnVisit/close`, //关闭回访记录
        apending: `${maintain}/maintenance/pending`, //待指派维保列表
        assign: `${maintain}/maintenance/assign`, //指派给指定维保
        cassign: `${maintain}/customersupport/assign`, //指派给指定客服
        aservicemy:`${maintain}/maintenance/my`, //当前待处理维保
        aclose:`${maintain}/maintenance/close`, //关闭维保
        log:`${maintain}/maintenanceLog`, //新增维保日志
        showLog:`${maintain}/maintenanceLog/page`, //查询维保日志
        deleteLog:`${maintain}/maintenanceLog`, //删除维保日志
        aserviceDone:`${maintain}/maintenance/done`, //已完成维保
        inmProcess:`${maintain}/maintenance/inProcess`, //进行中维保
    },
    token:'',
    dict:''
};

module.exports = config;
